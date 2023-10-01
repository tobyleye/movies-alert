import express from "express";
import expressWinston from "express-winston";
import { format, transports } from "winston";
import router from "./router.js";
import db from "./db.js";
import cors from "cors";
import schedule from "node-schedule";
import path from "path";
import { rootDir } from "./config.js";

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
  let publicPath = path.resolve(rootDir, "public");
  app.use(express.static(publicPath));

  app.use("/api/", router);

  app.use("*", (req, res) => {
    res.sendFile(path.resolve(rootDir, "public/index.html"));
  });

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
};

runServer();
