import { dbConfig } from "./config.js";
import mysql from "mysql2/promise";

class Db {
  constructor() {
    this.pool = mysql.createPool(dbConfig);
  }

  async connect() {
    await this.pool.getConnection();
  }

  async query(...args) {
    const results = await this.pool.query(...args);
    let [rows] = results;
    return rows;
  }

  async queryOne(...args) {
    let rows = await this.query(...args);
    return rows[0];
  }
}

export default new Db();
