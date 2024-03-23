import { Elysia } from "elysia";

import { helloController } from "./controllers/hello";

export const api = new Elysia().use(helloController);
