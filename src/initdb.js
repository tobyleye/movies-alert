import { dbConfig } from "./config.js";
import mysql from "mysql2/promise.js";
import fs from "fs";

const run = async () => {
  const db = await mysql.createConnection(dbConfig);
  let query = fs.readFileSync("./init.sql", "utf-8");
  await db.execute(query);
};

run();
