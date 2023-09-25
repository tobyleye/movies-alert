import express from "express";
import db from "./db.js";
import { v4 as uuid } from "uuid";
import { getFrontPageMovies } from "./crawler.js";

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
    throw err;
  }
});

router.get("/dbHealth", async (req, res) => {
  let result = await db.queryOne("select now() as currentTime");
  res.status(200).json({
    data: {
      database: "okay",
      server: "okay",
      currentTime: result.currentTime,
    },
  });
});

router.post("/subscribe", async function addNewSubscription(req, res) {
  let { movieTitle, email } = req.body;
  if (!movieTitle && !email) {
    return res
      .status(400)
      .json({ error: "movie title and email are required man" });
  }
  let subId = uuid();

  let values = {
    id: subId,
    movie_title: movieTitle,
    email: email,
    created: String(Date.now()),
  };
  await db.query("insert into movie_subscriptions set ?", values);
  res
    .status(200)
    .json({ data: null, message: "your subscription added created" });
});

router.get("/initTables", async function initializeTables(req, res) {
  try {
    await db.query(`
            create table people (
                name varchar(255) not null,
                created_timestamp varchar(255) not null
            );
    `);
    res.status(200).json({ message: "table created" });
  } catch (err) {
    res
      .status(500)
      .json({ message: `error creating tables.. sorry: ${err.message}` });
  }
});

router.post("/generateDownloadLink", (req, res) => {
  let { url } = req.body;
  if (!url) {
    return res.status(400).send();
  }
});

export default router;
