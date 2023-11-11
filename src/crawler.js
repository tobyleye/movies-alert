import axios from "axios";
import htmlParser from "node-html-parser";
import puppeteer from "puppeteer";
import { v4 as uuid } from "uuid";
import dayjs from "dayjs";

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

const getFirstNonEmptyLine = (lines) => {
  for (let line of lines) {
    if (line && line.trim().length > 0) {
      return line;
    }
  }
  return "";
};

export const extractMovieDetails = async (tfpdlMovieUrl) => {
  let response = await axios.get(tfpdlMovieUrl, {
    headers: {
      "User-Agent": USER_AGENT,
    },
  });
  let page = htmlParser.parse(response.data);
  let downloadLink = page.querySelector(".button")?.getAttribute("href");
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

export const getSafeTxtLink = async (browser, xproxxLink) => {
  return new Promise(async (resolve) => {
    let page = await browser.newPage();

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

    const waitForCountdownToFinish = async (element) => {
      let wait = async () => {
        return new Promise(async (resolve) => {
          let text = await (
            await element.getProperty("textContent")
          ).jsonValue();
          let [seconds = ""] = text.split(/seconds/i);
          console.log(seconds);

          if (seconds > 0) {
            setTimeout(async () => {
              await wait();
              resolve();
            }, 1000);
          } else {
            let finalWait = 1000;
            setTimeout(() => {
              resolve();
            }, finalWait);
          }
        });
      };

      await wait();
    };

    await page.goto(xproxxLink);

    let firstCountdown = await page.waitForXPath(
      `//*[@id="landing"]/div[2]/center/span`
    );
    await waitForCountdownToFinish(firstCountdown);
    let btn1 = await page.waitForXPath(
      `//*[@id="landing"]/div[2]/center/img[2]`
    );
    await btn1.click();

    let secondCountdown = await page.waitForXPath(
      `//*[@id="landing"]/center/center/span`
    );
    await waitForCountdownToFinish(secondCountdown);
    let btn2 = await page.waitForXPath(`//*[@id="landing"]/center/div[3]/a`);
    await btn2.click();

    let lastCountdown = await page.waitForXPath(
      `//*[@id="content"]/div[2]/center/div[1]/span`
    );
    await waitForCountdownToFinish(lastCountdown);
    let btn3 = await page.waitForXPath(
      `//*[@id="content"]/div[2]/center/div[1]/img[2]`
    );
    await btn3.click();
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
  let links = await generateDownloadLinksFromRedirectLink(xproxxLink);
  return [movieDetails, links];
};
