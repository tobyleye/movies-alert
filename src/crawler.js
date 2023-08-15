import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs/promises";

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
  let $ = cheerio.load(data);
  let items = $(".item-list");

  let movies = [];

  [...items].forEach((item) => {
    let $item = cheerio.load(item);
    let title = $item(".post-title a").text();
    let synopsis = $item(".entry p").text().split("\n")[1];
    // let downloadLinks = [];
    let poster = $item("img").attr("src");
    poster = poster && poster.split("?")[0];
    let link = $item(".post-title a").attr("href");
    movies.push({
      title,
      synopsis,
      link,
      poster,
    });
  });

  return movies;
};

//   crawlPages();
