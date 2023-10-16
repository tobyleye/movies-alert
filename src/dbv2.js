import knex from "knex";
import { dbConfig } from "./config.js";

let Db = knex({
  client: "mysql2",
  connection: {
    database: dbConfig.database,
    user: dbConfig.user,
    password: dbConfig.password,
    port: dbConfig.port,
  },
});

export { Db };
