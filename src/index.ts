import { Elysia } from "elysia";

import { api } from "./api";

const app = new Elysia().use(api).listen(3000);

console.log(
  `Server is running at http://${app.server?.hostname}:${app.server?.port}`,
);
