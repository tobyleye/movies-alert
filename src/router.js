import express from "express";
import db from "./db.js";
import { v4 as uuid } from "uuid";
import {
  generateDownloadLinkFromMovieLink,
  getFrontPageMovies,
} from "./crawler.js";
import { cacheIt } from "./cache.js";

const router = express.Router();

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
  let { page = 1 } = req.query;
  page = parseInt(page);
  if (page < 1 || typeof page !== "number") {
    page = 1;
  }

  console.log({ page });

  try {
    let cacheKey = `movies-${page}`;
    let { movies, lastPage } = await cacheIt(cacheKey, () =>
      getFrontPageMovies(page)
    );

    res.json({ data: movies, lastPage });
  } catch (err) {
    console.log(err);
    res.json({ data: [] });
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

export default router;
