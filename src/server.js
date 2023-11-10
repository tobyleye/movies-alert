import express from "express";
import router from "./router.js";
import cors from "cors";
import { Db } from "./dbv2.js";
// import { format, transports } from "winston";
// import expressWinston from "express-winston";

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

  app.use((error, req, res, next) => {
    res.status(500).send();
  });

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
};

runServer();
