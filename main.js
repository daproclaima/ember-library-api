import Koa from "koa";
import logger from "koa-logger";
import bodyParser from "koa-body-parser";
import cors from "@koa/cors";

import config from "./config/app";
import router from "./routes/index";
import db from "./models/index";
import errorMiddleware from "./errors/middleware";
import serialize from "./resources";
import getAttributes from "./middleware/get-attributes";

try {
  const app = new Koa();
  app.db = db;
  app.serialize = serialize;

  app.use(errorMiddleware);
  app.use(logger());
  app.use(cors());
  app.use(bodyParser());
  app.use(getAttributes);

  app.use(router.allowedMethods());
  app.use(router.routes());

  app.listen(config.port, () => {
    console.log(`Server listening on PORT ${config.port}`);
  });
} catch (error) {
  console.error(error);
}
