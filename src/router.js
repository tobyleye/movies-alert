import express from "express";
import db from "./db.js";
import { v4 as uuid } from "uuid";
import {
  generateDownloadLinkFromMovieLink,
  getFrontPageMovies,
} from "./crawler.js";

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

router.get("/recent-movies", async (req, res) => {
  try {
    let topMovies = await getFrontPageMovies();
    res.json({ data: topMovies });
  } catch (err) {
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
  if (!url) {
    return res.status(400).json({ error: "movie link is required" });
  }
  let links = await generateDownloadLinkFromMovieLink(url);
  res.json({
    data: links,
  });
});

export default router;
