import axios from "axios";
import htmlParser from "node-html-parser";
import puppeteer from "puppeteer";
import { v4 as uuid } from "uuid";
import dayjs from "dayjs";
import fs from "fs/promises";
import { isDev } from "./utils.js";

let USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.5112.79 Safari/537.36";

const getTotalPages = (pageContent) => {
  let $ = htmlParser.parse(pageContent);
  let lastPageUrl = $.querySelector(".pagination .last").getAttribute("href");
  let lastPageUrlParts = lastPageUrl.split("/").filter((part) => part !== "");
  let lastPage = lastPageUrlParts[lastPageUrlParts.length - 1];
  lastPage = Number(lastPage);
  return lastPage;
};

export const crawlMoviePage = async (page = 1) => {
  let url = `https://tfpdl.se/category/movies/page/${page}`;

  let { data: pageContent } = await axios.get(url, {
    headers: {
      "User-Agent": USER_AGENT,
    },
  });
  let $ = htmlParser.parse(pageContent);
  let items = $.querySelectorAll(".item-list");

  let pageMovies = [];

  [...items].forEach((item) => {
    let title = item.querySelector(".post-title a").textContent;
    let description = item.querySelector(".entry p").textContent.split("\n")[1];
    let link = item.querySelector(".post-title a").getAttribute("href");
    let dateString = item.querySelector(".tie-date").textContent.trim();
    const poster = item.querySelector(".entry img")?.getAttribute("src");
    let timestamp = dayjs(dateString, "MMMM DD, YYYY").toDate();

    pageMovies.push({
      id: uuid(),
      title,
      description,
      link,
      created: timestamp,
      poster,
      source: "tfpdl",
    });
  });

  let TOTAL_PAGES = getTotalPages(pageContent);

  return [pageMovies, TOTAL_PAGES];
};

export const promiseWait = (seconds) =>
  new Promise((resolve) => setTimeout(resolve, seconds * 1000));

const getMovieDownloadLink = (page) => {
  // try the first solution
  let downloadLink = page.querySelector(".button")?.getAttribute("href");
  if (!downloadLink) {
    downloadLink = page.querySelector(".entry a").getAttribute("href");
  }
  return downloadLink;
};

export const extractMovieDetails = async (tfpdlMovieUrl) => {
  let response = await axios.get(tfpdlMovieUrl, {
    headers: {
      "User-Agent": USER_AGENT,
    },
  });
  let page = htmlParser.parse(response.data);
  let downloadLink = getMovieDownloadLink(page);
  let movieTitle = page.querySelector(".post-title")?.textContent;
  let movieAdded = page.querySelector(".tie-date")?.textContent;
  let movieDescription = page.querySelector(".entry p")?.textContent?.trim();
  let moviePoster = page.querySelector(".entry img")?.getAttribute("src");
  return {
    downloadLink,
    movieTitle,
    movieAdded,
    movieDescription,
    moviePoster,
  };
};

const waitForCountdownToFinish = async (element) => {
  let wait = async () => {
    return new Promise(async (resolve) => {
      let text = await (await element.getProperty("textContent")).jsonValue();
      let [seconds = ""] = text.split(/seconds/i);
      console.log(seconds);

      if (seconds > 0) {
        setTimeout(async () => {
          await wait();
          resolve();
        }, 1000);
      } else {
        // wait 2 more seconds
        let finalWait = 2000;
        setTimeout(() => {
          resolve();
        }, finalWait);
      }
    });
  };

  await wait();
};

const forceClickBtn = async (btn) => {
  const CLICK_TIMES = 1;
  if (btn) {
    for (let i = 0; i < CLICK_TIMES; i++) {
      await btn.click();
    }
  }
};

const blockAds = (page) => {
  const rejectRequestPattern = [
    "pixfuture.com",
    "served-by.pixfuture.com",
    "securepubads",
    "securepubads.g.doubleclick.net",
    "googlesyndication.com",
    "/*.doubleclick.net",
    "/*.adnxs.com",
  ];

  page.on("request", (request) => {
    let matchedPattern = rejectRequestPattern.find((pattern) =>
      request.url().match(pattern)
    );
    if (matchedPattern) {
      if (isDev()) {
        console.log("-- blocked", request.url(), "pattern", matchedPattern);
      }
      request.abort();
    } else request.continue();
  });
};

export const getSafeTxtLink = async (browser, xproxxLink) => {
  return new Promise(async (resolve, reject) => {
    let page;

    try {
      page = await browser.newPage();
      await page.setRequestInterception(true);
      blockAds(page);

      browser.on("targetcreated", async function (target) {
        let url = target.url();

        if (url) {
          let urlObject = new URL(url);
          if (urlObject.host === "safetxt.net") {
            let targetPage = await target.page();
            let pageCookies = await targetPage.cookies();
            resolve([url, pageCookies]);
          }
        }
      });

      await page.goto(xproxxLink);

      let firstCountdown = await page.waitForXPath(
        `//*[@id="landing"]/div[2]/center/span`
      );
      await waitForCountdownToFinish(firstCountdown);

      let btn1 = await page.waitForXPath(
        `//*[@id="landing"]/div[2]/center/img[2]`
      );
      await forceClickBtn(btn1);

      /*
      possible xpaths for second countdown
      // id="_0xdf7244729e"
      //*[@id="_0x70a7f547cc"]
      //*[@id="landing"]/center/center
  
      let secondCountdown = await page.waitForXPath(
        `//*[@id="landing"]/div[2]/center/center/span`
      );

      //*[@id="landing"]/center/center
      */

      let secondCountdown = await waitForOneOfXpaths(page, [
        `//*[@id="landing"]/center/center/span`,
        `//*[@id="_0xcc5881a9f7"]`,
        `//*[@id="_0x70a7f547cc"]`,
        `//*[@id="landing"]/div[2]/center/center/span`,
      ]);
      await waitForCountdownToFinish(secondCountdown);
      let btn2 = await page.waitForXPath(`//*[@id="landing"]/center/div[3]/a`);
      // await btn2.click();
      await forceClickBtn(btn2);

      let lastCountdown = await page.waitForXPath(
        `//*[@id="content"]/div[2]/center/div[1]/span`
      );
      await waitForCountdownToFinish(lastCountdown);
      let btn3 = await page.waitForXPath(
        `//*[@id="content"]/div[2]/center/div[1]/img[2]`
      );
      // await btn3.click();
      await forceClickBtn(btn3);
    } catch (err) {
      // if (page) {
      //   let pageFilename;
      //   try {
      //     let html = await page.content();
      //     pageFilename = `./safe-txt-error.html`;
      //     await fs.writeFile(pageFilename, html);
      //     console.info(`an error occured last page logged at ${pageFilename}`);
      //   } catch (err) {
      //     console.info(
      //       `got an error saving the last step we got stuck`,
      //       err.message
      //     );
      //   }
      // } else {
      //   console.log(`page isn't initialized yet`);
      // }
      reject(err);
    }
  });
};

const disableJavascript = async (page) => {
  await page.setRequestInterception(true);
  page.on("request", (request) => {
    if (request.resourceType() === "script") {
      request.abort();
    } else {
      request.continue();
    }
  });
};

async function waitForOneOfXpaths(page, xpaths) {
  try {
    let xpath = xpaths[0];
    return await page.waitForXPath(xpath);
  } catch (err) {
    if (xpaths.length === 1) {
      // no more xpaths to check
      throw err;
    } else {
      return await waitForOneOfXpaths(page, xpaths.slice(1));
    }
  }
}

const getDownloadLinksFromSafeTxt = async (browser, safeTxtLink) => {
  let page = await browser.newPage();
  await disableJavascript(page);
  try {
    await page.goto(safeTxtLink, {
      waitUntil: "domcontentloaded",
      timeout: 10 * 1000,
    });
  } catch {}
  let pageContent = await page.content();

  let token = pageContent.match(/token\:\s?\'(.*?)\'/)[1];
  let slug = pageContent.match(/slug\:\s?\'(.*?)\'/)[1];

  if (!token && !slug) {
    throw new Error(`Couldn't extract token and slug from page`);
  }

  const PASSWORD = "tfpdl";

  let API_URL = "https://safetxt.net/get-paste";
  let response = await axios.post(API_URL, {
    _token: token,
    password: PASSWORD,
    slug,
  });

  let content = atob(response.data.content);
  content = decodeURIComponent(content.replace(/\+/g, "%20"));
  let links = htmlParser
    .parse(content)
    .querySelectorAll(".cm-url")
    .map((link) => link.getAttribute("href"));
  return links;
};

export const generateDownloadLinksFromRedirectLink = async (xproxxLink) => {
  let browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"],
  });
  let [safeTxtLink] = await getSafeTxtLink(browser, xproxxLink);
  let links = await getDownloadLinksFromSafeTxt(browser, safeTxtLink);
  await browser.close();
  return links;
};

export const generateDownloadLinkFromMovieLink = async (url) => {
  let movieDetails = await extractMovieDetails(url);
  let { downloadLink } = movieDetails;
  if (!downloadLink) {
    throw new Error(`Cannot extract link from movie ${url}`);
  }
  let links = await generateDownloadLinksFromRedirectLink(downloadLink);
  return [movieDetails, links];
};
