import { logger } from "@bogeychan/elysia-logger";
import { Elysia } from "elysia";
import pretty from "pino-pretty";

import { env } from "./env";

const stream = pretty({
  colorize: true,
});

const loggerConfig =
  env.NODE_ENV === "development"
    ? {
        level: env.LOG_LEVEL,
        stream,
      }
    : { level: env.LOG_LEVEL };

export const setup = new Elysia({ name: "Global.Setup" }).use(
  logger(loggerConfig),
);
