import dotenv from "dotenv";
dotenv.config();

export const dbConfig = {
  user: "root",
  password: "root",
  host: "localhost",
  port: "3307",
};

export const mailConfig = {
  user: process.env.MAIL_USER,
  pass: process.env.MAIL_PASSWORD,
};
