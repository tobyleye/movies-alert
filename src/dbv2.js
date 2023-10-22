import knex from "knex";
import { dbConfig } from "./config.js";

let Db = knex({
  client: "mysql2",
  connection: dbConfig,
});

export { Db };
