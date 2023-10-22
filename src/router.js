import express from "express";
import {
  crawlMoviePage,
  promiseWait,
  generateDownloadLinkFromMovieLink,
} from "./crawler.js";
import { cacheIt } from "./cache.js";
import { Db } from "./dbv2.js";

const router = express.Router();

const parseStringToNumber = (number) => {
  number = Number(number);
  if (Number.isNaN(number)) {
    return undefined;
  } else {
    return number;
  }
};

router.get("/", async (req, res) => {
  let welcomeMessage = [
    "Hey there, welcome",
    "I'm not entirely sure what this is yet",
    "but we are very glad to have you. Hope you having a wonderful day?",
  ].join(" ");

  res.json({
    message: welcomeMessage,
  });
});

router.get("/recentMovies", async (req, res) => {
  let pageNumber = parseStringToNumber(req.query.page) ?? 1;

  // index starts from 0
  pageNumber = pageNumber - 1;

  let ITEMS_PER_PAGE = 10;

  try {
    let movies = await Db.select()
      .limit(ITEMS_PER_PAGE)
      .offset(ITEMS_PER_PAGE * pageNumber)
      .orderBy('created', 'desc')
      .table("movies");
    let totalMovies = await Db.count("id").table("movies");
    let lastPage = Math.ceil(totalMovies / ITEMS_PER_PAGE);

    res.json({ data: movies, lastPage: lastPage });
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

// router.post("/subscribe", async function addNewSubscription(req, res) {
//   let { movieTitle, email } = req.body;
//   if (!movieTitle && !email) {
//     return res
//       .status(400)
//       .json({ error: "movie title and email are required man" });
//   }
//   let subId = uuid();

//   let values = {
//     id: subId,
//     movie_title: movieTitle,
//     email: email,
//     created: String(Date.now()),
//   };
//   await db.query("insert into movie_subscriptions set ?", values);
//   res
//     .status(200)
//     .json({ data: null, message: "your subscription added created" });
// });

router.post("/generateDownloadLink", async (req, res) => {
  let { url } = req.body;
  let urlParts = url.split("/").filter((part) => part.trim() !== "");
  let movieTitle = urlParts[urlParts.length - 1];
  if (!url) {
    return res.status(400).json({ error: "movie link is required" });
  }

  let cacheKey = `movie:${movieTitle}`;
  let links = await cacheIt(cacheKey, () =>
    generateDownloadLinkFromMovieLink(url)
  );
  res.json({
    data: links,
  });
});

/* system routes */
router.get("/_system/crawlPages", async (req, res) => {
  try {
    let { pages } = req.query;
    pages = parseStringToNumber(pages);

    let [movies, totalPages] = await crawlMoviePage(1);
    await Db("movies").insert(movies);
    let stopPage = pages ? Math.min(pages, totalPages) : totalPages;

    // do one page at a time
    const crawlRemainingPages = async () => {
      for (let page = 2; page < stopPage; page++) {
        console.log(`crawling page ${page}`);
        try {
          let [movies] = await crawlMoviePage(page);
          await Db("movies").insert(movies);
          let randomWaitSeconds = 3 + Math.floor(Math.random() * 5);
          await promiseWait(randomWaitSeconds);
        } catch (err) {
          console.log(`can't crawl page ${page}. ${err.message}`);
        }
      }
    };

    crawlRemainingPages();

    res.json({
      message: `1 movie page crawled, ${totalPages - 1} to go`,
    });
  } catch (err) {
    res.status(500).json({
      message: "ooops, an error occurred",
      error: err.message,
    });
  }
});
export default router;
