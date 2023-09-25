import puppeteer from "puppeteer";
import { generateDownloadLink } from "./crawler.js";

let greenlandMovie = "https://tfpdl.se/greenland-2020-720p-bluray-x264-tfpdl/";
generateDownloadLink(greenlandMovie).then((links) => {
  console.log("::links::");
  console.log(links);
});

const crawlTest = async () => {
  let browser = await puppeteer.launch({
    headless: false,
  });

  let page = await browser.newPage();
  await page.setRequestInterception(true);
  await page.setJavaScriptEnabled(false);
  page.on("request", (interceptedRequest) => {
    console.log("browser sent a request");
    console.log({
      url: interceptedRequest.url(),
    });
    interceptedRequest.continue();
  });
  //   page.goto("http://google.com");
  await page.goto("http://safetxt.net");
  setTimeout(() => {}, 5 * 60 * 1000);
};

// crawlTest();
