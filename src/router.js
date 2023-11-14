import express from "express";
import {
  crawlMoviePage,
  promiseWait,
  generateDownloadLinksFromRedirectLink,
  extractMovieDetails,
} from "./crawler.js";
import { Db } from "./db.js";
import dayjs from "dayjs";
import { v4 as uuid } from "uuid";
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
      .orderBy("created", "desc")
      .table("movies");
    let totalMovies = await Db.count("id").table("movies");
    let lastPage = Math.ceil(totalMovies / ITEMS_PER_PAGE);

    res.json({ data: movies, lastPage: lastPage });
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

// 2 days
const LINK_VALIDITY_PERIOD = 2 * 24 * 60 * 60 * 1000;

const invalidateDownloadLinks = async (
  movieSlug,
  movieLink,
  mirrorDownloadLink
) => {
  let [movieDownloadLinks] = await Db.select()
    .where("movie_slug", movieSlug)
    .limit(1)
    .table("movies_download_links");
  let links;
  if (movieDownloadLinks) {
    let linkGeneratedDate = new Date(movieDownloadLinks.created);
    linkGeneratedDate = dayjs(linkGeneratedDate);
    const linkHasExpired =
      dayjs().diff(linkGeneratedDate, "milliseconds") > LINK_VALIDITY_PERIOD;
    if (linkHasExpired) {
      // generate new ones
      links = await generateDownloadLinksFromRedirectLink(mirrorDownloadLink);
      await Db("movies_download_links")
        .update({ download_links: links })
        .where("id", movieDownloadLinks.id);
      return links;
    } else {
      links = movieDownloadLinks.download_links;
      return links;
    }
  } else {
    links = await generateDownloadLinksFromRedirectLink(mirrorDownloadLink);
    await Db("movies_download_links").insert({
      id: uuid(),
      movie_slug: movieSlug,
      movie_link: movieLink,
      download_links: JSON.stringify(links),
      created: new Date(),
    });
    return links;
  }
};

router.post("/generateDownloadLink", async (req, res) => {
  let { url } = req.body;
  let urlParts = url.split("/").filter((part) => part.trim() !== "");
  let movieSlug = urlParts[urlParts.length - 1];
  if (!url) {
    return res.status(400).json({ error: "movie link is required" });
  }

  try {
    const movieDetails = await extractMovieDetails(url);
    if (!movieDetails.downloadLink) {
      throw new Error(`Cannot extract download link from movie ${url}`);
    }
    let movieMirrorDownloadLink = movieDetails.downloadLink;

    const links = await invalidateDownloadLinks(
      movieSlug,
      url,
      movieMirrorDownloadLink
    );

    movieDetails.movieSlug = movieSlug;

    res.json({
      data: {
        movieDetails,
        downloadLinks: links,
      },
    });
  } catch (err) {
    throw err;
  }
});

router.get(
  "/recentlyGeneratedMovies",
  async function getRecentlyGeneratedMovies(req, res) {
    const lastTenGeneratedMovies = await Db("movies_download_links")
      .select()
      .orderBy("created", "desc")
      .limit(10);
    // lastTenGeneratedMovies.map(each =>)
    res.json({ data: lastTenGeneratedMovies });
  }
);

router.get("/dl/:movieSlug", async function getMovieDownloadLinks(req, res) {
  const { movieSlug } = req.params;
  let result = await Db("movies_download_links")
    .select()
    .where("movie_slug", movieSlug);

  const [movieDownloadLinks] = result;
  if (!movieDownloadLinks) {
    return res.status(404).send();
  }
  let movieLink = movieDownloadLinks.movie_link;

  let movieDetails;
  if (movieLink) {
    movieDetails = await extractMovieDetails(movieLink);
  }

  res.json({
    data: {
      movieDetails,
      downloadLinks: movieDownloadLinks,
    },
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
