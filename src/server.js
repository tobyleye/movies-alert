import express from "express";
import router from "./router.js";
import cors from "cors";
import { Db } from "./db.js";
// import { format, transports } from "winston";
// import expressWinston from "express-winston";
import errors from "./handlers/errors.js";
import { crawlMovies } from "./jobs.js";

const createApp = async () => {
  const app = express();
  app.use(
    cors({
      origin: "*",
    })
  );
  app.use(express.json({}));
  app.use(
    express.urlencoded({
      extended: false,
    })
  );
  // const logger = expressWinston.logger({
  //   transports: [new transports.Console()],
  //   format: format.json(),
  // });

  // app.use(logger);

  app.use("/api/", router);

  app.use(errors.errorHandler);

  return app;
};

const PORT = process.env.PORT ?? 5183;

const runServer = async () => {
  Db.on("connect", () => {
    console.log("db connected!");
  });
  let app = await createApp();
  app.listen(PORT, () =>
    console.log(`app is running on port localhost:${PORT}`)
  );
  crawlMovies();
};

runServer();
