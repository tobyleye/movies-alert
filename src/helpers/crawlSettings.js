import { Db } from "../db.js";

export const setLastCrawledMovie = async ({ link, title }) => {
  let value = JSON.stringify({
    link: link,
    title: title,
  });
  await Db("config")
    .where("field", "last_crawled_movie")
    .update("value", value);
};

export const getLastCrawledMovie = async () => {
  let [field] = await Db("config")
    .where("field", "last_crawled_movie")
    .select();
  return (
    field.value ?? {
      link: null,
      title: null,
    }
  );
};
