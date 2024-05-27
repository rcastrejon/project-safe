import { createPinoLogger, pino } from "@bogeychan/elysia-logger";
import { ecsFormat } from "@elastic/ecs-pino-format";

import { env } from "../env";

export const log = createPinoLogger({
  level: env.LOG_LEVEL,
  stream: pino.destination(env.LOG_OUTPUT_PATH),
  redact: ["*.password"],
  ...ecsFormat(),
});
