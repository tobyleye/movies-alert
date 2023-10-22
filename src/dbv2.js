import knex from "knex";
import { dbConfig } from "./config.js";

let Db = knex({
  client: "mysql2",
  connection: {
    connectionString: process.env.MYSQL_URL,
    database: dbConfig.database,
    user: dbConfig.user,
    password: dbConfig.password,
    port: dbConfig.port,
  },
});

export { Db };
