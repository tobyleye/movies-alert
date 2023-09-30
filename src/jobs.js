import schedule from "node-schedule";
import { dbPool } from "./db";

const populateMoviesDatabase = async () => {
  let [configResults] = await dbPool.query(
    "select * from movies_crawler_config"
  );
  let config = configResults[0];
  console.log({ config });

  let lastCrawledMovie = null;

  if (config) {
    // set last crawled movie
  }
};

export const startJobs = () => {
  schedule.scheduleJob("* * * * *", () => {
    console.log("this function runs every minutes");
  });
};
