import { generateDownloadLinkFromMovieLink } from "./crawler.js";

const run = async () => {
  let link = process.argv[2];
  if (!link) {
    console.error("A movie link is required dawg");
    return;
  }
  try {
    console.log("working...");
    let links = await generateDownloadLinkFromMovieLink(link);
    console.log("Here are your links");
    links.forEach((link) => {
      console.log(link);
    });
  } catch (err) {
    console.log(`Sorry. an error occured. ${err.message}`);
  }
};

run().finally(process.exit);

