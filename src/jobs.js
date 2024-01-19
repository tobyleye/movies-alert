import schedule from "node-schedule";
import { Db } from "./db.js";
import { crawlMoviePage, promiseWait } from "./crawler.js";
import {
  getLastCrawledMovie,
  setLastCrawledMovie,
} from "./helpers/crawlSettings.js";

const crawlMoviesSynchronously = async (stopAtMovieLink) => {
  console.log("now crawling movies synchronously");
  let firstMovie;
  for (let pageNo = 1; ; pageNo++) {
    let [movies] = await crawlMoviePage(pageNo);
    // set first movie here. done only once
    if (!firstMovie) {
      firstMovie = movies[0];
    }
    let moviesToInsert = [];
    let reachedEnd = false;

    for (let movie of movies) {
      if (movie.link === stopAtMovieLink) {
        reachedEnd = true;
        break;
      } else {
        moviesToInsert.push(movie);
      }
    }
    if (moviesToInsert.length > 0) {
      await Db("movies").insert(moviesToInsert);
    }

    if (reachedEnd) {
      return firstMovie;
    }
  }
};

// crawl first page
async function crawlMoviesAsync() {
  return new Promise(async (resolve) => {
    console.log(">>> crawling movie asynchronously ");
    let [movies, totalPages] = await crawlMoviePage(1);

    await Db("movies").insert(movies);
    let pagesScrapped = 1;
    let firstMovie = movies[0];

    totalPages = Math.min(5, totalPages);
    for (let pageNo = 2; pageNo <= totalPages; pageNo++) {
      console.log(`>>> crawling page ${pageNo}`);
      crawlMoviePage(pageNo)
        .then(async (response) => {
          console.log(`>>> saving movies from page ${pageNo}`);
          let [pageMovies] = response;
          await Db("movies").insert(pageMovies);
        })
        .catch((err) => {
          console.error(`scraping page ${pageNo} failed: ${err.message}`);
        })
        .finally(() => {
          pagesScrapped += 1;
          console.log({
            pagesScrapped,
            totalPages,
          });
          if (pagesScrapped === totalPages) {
            return resolve(firstMovie);
          }
        });

      // random wait before hittin the next page
      let randomWaitSeconds = 3 + Math.floor(Math.random() * 5);
      await promiseWait(randomWaitSeconds);
    }
  });
}

export const crawlMovies = async () => {
  try {
    let lastCrawledMovie = await getLastCrawledMovie();

    let firstCrawledMovie;

    if (!lastCrawledMovie.link) {
      firstCrawledMovie = await crawlMoviesAsync();
    } else {
      firstCrawledMovie = await crawlMoviesSynchronously(lastCrawledMovie.link);
    }
    if (firstCrawledMovie) {
      await setLastCrawledMovie({
        link: firstCrawledMovie.link,
        title: firstCrawledMovie.title,
      });
    }
    console.log("done crawling movies");
  } catch (err) {
    console.error("can't crawl movie");
  }
};

export const startJobs = () => {
  schedule.scheduleJob("* * * * *", () => {
    console.log("this function runs every minutes");
  });
};
