import dotenv from "dotenv";
import { dirname } from "path";
import { fileURLToPath } from "url";

dotenv.config();

let dbConfig = {
  user: "root",
  password: "root",
  host: "localhost",
  port: "3307",
  database: "moviesalert",
};

console.log({
  env: process.env.NODE_ENV,
});

if (process.env.NODE_ENV === "production") {
  dbConfig = {
    uri: process.env.MYSQL_URL,
  };
}

console.log({ dbConfig });

export { dbConfig };

export const mailConfig = {
  user: process.env.MAIL_USER,
  pass: process.env.MAIL_PASSWORD,
};

export const rootDir = dirname(fileURLToPath(import.meta.url));
