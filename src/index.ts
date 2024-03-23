import { Elysia } from "elysia";

import { api } from "./api";
import { setup } from "./setup";

// The main entry point of the application. It setups the global plugins and
// the api instance, finally it starts the server.
const app = new Elysia().use(setup).use(api).listen(3000);

console.log(
  `Server is running at http://${app.server?.hostname}:${app.server?.port}`,
);
