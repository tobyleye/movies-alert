import express from "express";
import mysql from "mysql2/promise";
import { dbConfig } from "./config.js";
import { body } from "express-validator";
import { getFrontPageMovies } from "./crawler.js";
import expressWinston from "express-winston";
import { format, transports } from "winston";
import { validationMiddleware } from "./middleware.js";

const createApp = async (db) => {
  const app = express();
  app.use(express.json({}));
  app.use(
    express.urlencoded({
      extended: false,
    })
  );
  const logger = expressWinston.logger({
    transports: [new transports.Console()],
    format: format.json(),
  });

  app.use(logger);

  app.get("/", async (req, res) => {
    let welcomeMessage = [
      "Hey there, welcome",
      "I'm not entirely sure what this is yet",
      "but we are very glad to have you. Hope you having a wonderful day?",
    ].join(" ");

    res.json({
      message: welcomeMessage,
    });
  });

  app.get("/recent-movies", async (req, res) => {
    try {
      let topMovies = await getFrontPageMovies();
      res.json({ data: topMovies });
    } catch (err) {
      throw err;
    }
  });

  // app.post(
  //   "/login",
  //   body("email").isEmail().withMessage("a valid email is required"),
  //   body("password").isLength({ min: 1 }),
  //   (req, res) => {
  //     let { email, password } = req.body;
  //     console.log({ email, password });
  //     res.json({ message: "login successful" });
  //   }
  // );

  // let registerSchema = [
  //   body("email").isEmail(),
  //   body("password").isStrongPassword(),
  //   body("firstname").isLength({ min: 3 }),
  //   body("lastname").isLength({ min: 3 }),
  // ];

  // app.post("/register", validationMiddleware(registerSchema), (req, res) => {
  //   res.json({ message: "registration successful " });
  // });

  // app.post(
  //   "/subscribe",
  //   validationMiddleware([
  //     body("movieTitle")
  //       .isLength({ min: 1 })
  //       .withMessage("expecting a movie with atleast one length"),
  //     body("email").isEmail().withMessage("field must be a valid email"),
  //   ]),

  //   async (req, res) => {
  //     let { movieTitle, email } = req.body;
  //     await db.query(
  //       "insert into subscriptions (movie_title, email) values (?, ?)",
  //       [movieTitle, email]
  //     );
  //     res.json({ message: "movie has been added" });
  //   }
  // );

  app.use((error, req, res, next) => {
    res.status(500).send();
  });

  return app;
};

const PORT = process.env.PORT ?? 5183;

const runServer = async () => {
  let dbClient = await mysql.createPool(dbConfig).pool.promise();
  let app = await createApp(dbClient);
  app.listen(PORT, () =>
    console.log(`app is running on port localhost:${PORT}`)
  );
};

runServer();
