import express from "express";
import expressWinston from "express-winston";
import { format, transports } from "winston";
import router from "./router.js";
import db from "./db.js";
import cors from "cors";
import path from "path";
import { rootDir } from "./config.js";
import { Db } from "./dbv2.js";

const CLIENT_ROOT_DIR = path.resolve(rootDir, "client/dist");
const CLIENT_ENTRY = path.resolve(CLIENT_ROOT_DIR, "index.html");

console.log({ CLIENT_ENTRY, CLIENT_ROOT_DIR });

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

  // app.use(logger);

  app.use(express.static(CLIENT_ROOT_DIR));

  app.get("/testdbv2", async (req, res) => {
    try {
      let result = await Db.raw("select now()");
      res.json(result);
    } catch (err) {
      res.status(500).json({ message: "error occured " + err.message });
    }
  });
  app.use("/api/", router);

  app.use("*", (req, res) => {
    res.sendFile(CLIENT_ENTRY);
  });

  app.use((error, req, res, next) => {
    res.status(500).send();
  });

  return app;
};

const PORT = process.env.PORT ?? 5183;

const runServer = async () => {
  // await db.connect();
  let app = await createApp();
  app.listen(PORT, () =>
    console.log(`app is running on port localhost:${PORT}`)
  );
};

runServer();
