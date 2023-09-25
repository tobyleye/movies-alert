import axios from "axios";
import fs from "fs/promises";
import htmlParser from "node-html-parser";
import puppeteer from "puppeteer";

// do 4 pages for starters
let MAX_PAGE = 4;

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
  let response = await axios.get(url);
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
  let response = await axios.get(tfpdlMovieUrl);
  let page = htmlParser.parse(response.data);
  let downloadLink = page.querySelector(".button");
  if (downloadLink) {
    return downloadLink.getAttribute("href");
  }
  return;
};

const getSafeTxtLink = async (xproxxLink) => {
  return new Promise(async (resolve) => {
    let browser = await puppeteer.launch({
      headless: false,
    });

    browser.on("targetcreated", async function (target) {
      let url = target.url();

      if (url) {
        let urlObject = new URL(url);
        if (urlObject.host === "safetxt.net") {
          let page = await target.page();
          let pageCookies = await page.cookies();
          await new Promise((resolve) => setTimeout(resolve, 15000));
          const links = await extractDownloadLinks(url, pageCookies);
          console.log({ links });

          setTimeout(async () => {
            await browser.close();
            resolve([url, pageCookies]);
          }, 2 * 60 * 1000);
        }
      }
      console.log("New Tab Created", url);
    });

    let page = await browser.newPage();
    await page.goto(xproxxLink);

    const waitForCountdownToFinish = async (element) => {
      let run = async () => {
        let text = await (await element.getProperty("textContent")).jsonValue();
        let [seconds = ""] = text.split(/seconds/i);
        console.log(seconds);
        if (seconds !== 0) {
          setTimeout(() => {
            run();
          }, 1000);
        } else {
          return;
        }
      };
      return run();
    };

    console.log("executing first wait..");
    let firstCountdown = await page.waitForSelector("#soradodo > span");
    await waitForCountdownToFinish(firstCountdown);
    let btn1 = await page.waitForSelector("#lite-human-verif-button");
    await btn1.click();

    let secondCountdown = await page.waitForSelector("#soradodo > span");
    await waitForCountdownToFinish(secondCountdown);
    let btn2 = await page.waitForSelector("#lite-start-sora-button");
    await btn2.click();

    let lastCountdown = await page.waitForSelector("#soradodo-end > span");
    await waitForCountdownToFinish(lastCountdown);
    let btn3 = await page.waitForSelector("#lite-end-sora-button");
    await btn3.click();
  });
};

const extractDownloadLinks = async (safeLink, cookies) => {
  let Cookie = cookies
    .map((cookie) => {
      return `${cookie.name}=${cookie.value};`;
    })
    .join(" ");

  console.log({ Cookie });

  try {
    let response = await axios.get(safeLink, {
      headers: {
        Cookie: Cookie,
      },
    });

    let content = atob(response.data.content);
    content = decodeURIComponent(content.replace(/\+/g, "%20"));
    let links = htmlParser
      .parse(content)
      .querySelectorAll(".cm-url")
      .map((link) => link.getAttribute("href"));
    return links;
  } catch (err) {
    return [];
  }
};

export const generateDownloadLink = async (url) => {
  let xproxxLink = await getXproxxxLink(url);
  console.log({ xproxxLink });
  if (!xproxxLink) {
    throw new Error("movie url is not available");
  }
  let [safeTxtLink, cookies] = await getSafeTxtLink(xproxxLink);
  // let downloadLinks = await extractDownloadLinks(safeTxtLink, cookies);
  // console.log({ downloadLinks });
  // return downloadLinks;

  /*

    extract link from safetxt.net
    let response = await axios.post('https://safetxt.net/get-paste', {
          slug: 'pl3btc9cz3', 
          password: 'tfpdl', 
          _token: 'JAox6OrSBvykWlmX0WL1EXUmcZKl8KDkwhtVRnqQ'
    })
    content = atob(data.content);
    content = decodeURIComponent(content.replace(/\+/g, '%20'));

  */
};

const logInterceptedRequests = async (url) => {
  let browser = await puppeteer.launch({
    headless: false,
  });
  let page = await browser.newPage();
  await page.setRequestInterception(true);
  page.on("request", (interceptedRequest) => {
    console.log({
      url: interceptedRequest.url(),
      headers: interceptedRequest.headers(),
      requestBody: interceptedRequest.postData(),
      response: interceptedRequest.response(),
    });
    interceptedRequest.continue();
  });

  await page.goto(url);
};

// getFrontPageMovies().then((movies) => {
//   console.log(movies);
// });

let barbieDownloadLink = `https://tfpdl.se/tfpdl?d048c7b91a=K2h3VWplSEdFckk3MWF0RGNiaHV6bFl1bExPMVJjYVJtbVpOZjdoeG5RL3MvUGJvc00wQXhUWkVDZWFIaXF5d1RFK3ZhT3JONkVKTjA3VlVINEIvaEE9PQ==`;

// logInterceptedRequests(
//   "https://tfpdl.se/tfpdl?d048c7b91a=Q0lsWUtrbG8ydS9sRE5QelppR1loMldlblhzdmF0YTVKVmh6V1JIV2N6MngvUVMwVkl6N1ZxWGZvVmJmRUVMU0JXSnpXYjhyRDBkNGVMYmhwQnY2Yks1NGhyQ3g3NVFmcUQvMU80NnB0djQ9"
// );
