import axios from "axios";
import fs from "fs/promises";
import htmlParser from "node-html-parser";
import puppeteer from "puppeteer";

// do 4 pages for starters
let MAX_PAGE = 4;

let USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.5112.79 Safari/537.36";

export const crawlPages = async () => {
  let response = await axios.get("https://tfpdl.se/category/movies/");
  let html = response.data;

  let movies = [];

  const parsePage = (pageContent, pageNo) => {
    let $ = cheerio.load(pageContent);
    let items = $(".item-list");

    let pageMovies = [];
    [...items].forEach((item) => {
      let $item = cheerio.load(item);
      let title = $item(".post-title a").text();
      let synopsis = $item(".entry p").text().split("\n")[1];
      // let downloadLinks = [];
      let link = $item(".post-title a").attr("href");
      pageMovies.push({
        title,
        synopsis,
        link,
      });
    });

    movies.push({
      page: pageNo,
      movies: pageMovies,
    });
  };

  const getLastPageNo = (pageContent) => {
    let $ = cheerio.load(pageContent);

    let pages = $(".pagination a");
    let lastPage = pages[pages.length - 1];
    let lastLink = lastPage.attribs["href"];
    if (lastLink.endsWith("/")) {
      lastLink = lastLink.slice(0, -1);
    }
    let lastLinkParts = lastLink.split("/");
    let lastPageNo = Number(lastLinkParts[lastLinkParts.length - 1]);
    return lastPageNo;
  };

  parsePage(html, 1);

  // scrape other pages
  let lastPageNo = getLastPageNo(html);

  lastPageNo = Math.min(MAX_PAGE, lastPageNo);

  let promises = [];
  for (let page = 2; page <= lastPageNo; page++) {
    let pageUrl = `https://tfpdl.se/category/movies/page/${page}`;
    promises.push(
      axios
        .get(pageUrl)
        .then(({ data: pageContent }) => {
          parsePage(pageContent, page);
        })
        .catch((err) => {
          console.error(`skipping page ${page}, reason: ${err.message}`);
        })
    );
  }

  await Promise.all(promises);

  await fs.writeFile("./movies.json", JSON.stringify(movies, null, 2));
};

export const getFrontPageMovies = async () => {
  let url = "https://tfpdl.se/category/movies/";
  let response = await axios.get(url, {
    headers: {
      "User-Agent": USER_AGENT,
    },
  });

  console.log(`${url} status (${response.status})`);
  let { data } = response;

  let $ = htmlParser.parse(data);
  let items = $.querySelectorAll(".item-list");

  let movies = [];

  const getFirstNonEmptyLine = (lines) => {
    for (let line of lines) {
      if (line && line.trim().length > 0) {
        return line;
      }
    }
    return "";
  };

  [...items].forEach((item) => {
    let title = item.querySelector(".post-title a").text;
    let synopsis = getFirstNonEmptyLine(
      item.querySelector(".entry p").text.split("\n")
    );
    // let downloadLinks = [];
    let poster = item.querySelector("img").getAttribute("src");
    poster = poster && poster.split("?")[0];
    let link = item.querySelector(".post-title a").getAttribute("href");
    movies.push({
      title,
      synopsis,
      link,
      poster,
    });
  });

  return movies;
};

const getXproxxxLink = async (tfpdlMovieUrl) => {
  let response = await axios.get(tfpdlMovieUrl, {
    headers: {
      "User-Agent": USER_AGENT,
    },
  });
  let page = htmlParser.parse(response.data);
  let downloadLink = page.querySelector(".button");
  if (downloadLink) {
    return downloadLink.getAttribute("href");
  } else {
    throw new Error(`cant get movie ${tfpdlMovieUrl} xproxxxLink`);
  }
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

    // let SELECTORS = {
    //   FIRST_COUNTDOWN: "#soralink-human-verif-countdown-text",
    //   SECOND_COUNTDOWN: "",
    //   LAST_COUNTDOWN: "",
    // };

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
  console.log({ token, slug });

  const PASSWORD = "tfpdl";

  let API_URL = "https://safetxt.net/get-paste";
  console.log("fetching with axios..");
  let response = await axios.post(API_URL, {
    _token: token,
    password: PASSWORD,
    slug,
  });
  console.log("fetch done!");

  let content = atob(response.data.content);
  content = decodeURIComponent(content.replace(/\+/g, "%20"));
  let links = htmlParser
    .parse(content)
    .querySelectorAll(".cm-url")
    .map((link) => link.getAttribute("href"));
  console.log({ links });
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
  let xproxxLink = await getXproxxxLink(url);
  let links = await generateDownloadLinksFromRedirectLink(xproxxLink);
  console.log({ links });
  return links;
};
