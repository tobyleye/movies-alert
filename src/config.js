import dotenv from "dotenv";
import { dirname } from "path";
import { fileURLToPath } from "url";

dotenv.config();

export const dbConfig = {
  user: "root",
  password: "root",
  host: "localhost",
  port: "3307",
  database: "moviesalert",
};

export const mailConfig = {
  user: process.env.MAIL_USER,
  pass: process.env.MAIL_PASSWORD,
};

export const rootDir = dirname(fileURLToPath(import.meta.url));
