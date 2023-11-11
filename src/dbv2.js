import knex from "knex";
import { dbConfig } from "./config.js";

export const Db = knex({
  client: "mysql2",
  connection: dbConfig,
});

export const DbTables = {
  MoviesDownloadLinks: Db("movies_download_links"),
  Movies: Db("movies"),
};
