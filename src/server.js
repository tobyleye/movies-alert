import express from "express";
import expressWinston from "express-winston";
import { format, transports } from "winston";
import router from "./router.js";
import db from "./db.js";
import cors from "cors";
import schedule from "node-schedule";
import { startSubscriptionJob } from "./jobs.js";

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
  const logger = expressWinston.logger({
    transports: [new transports.Console()],
    format: format.json(),
  });

  app.use(logger);

  app.use("/", router);
  app.use((error, req, res, next) => {
    res.status(500).send();
  });

  return app;
};

const PORT = process.env.PORT ?? 5183;

const runServer = async () => {
  await db.connect();
  let app = await createApp();
  app.listen(PORT, () =>
    console.log(`app is running on port localhost:${PORT}`)
  );
  startSubscriptionJob();
};

runServer();
