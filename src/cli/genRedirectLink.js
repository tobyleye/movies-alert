import { extractMovieDetails } from "../crawler.js";

const run = async () => {
  let link = process.argv[2];
  if (!link) {
    console.error("A movie link is required!");
    return;
  }
  const details = await extractMovieDetails(link);
  console.log(details.downloadLink);
};

run();
