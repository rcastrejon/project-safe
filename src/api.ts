import { Elysia } from "elysia";

import { assignController } from "./controllers/assign";
import { driversController } from "./controllers/drivers";
import { helloController } from "./controllers/hello";
import { invitationTokenController } from "./controllers/invitationToken";
import { usersController } from "./controllers/users";
import { vehiclesController } from "./controllers/vehicles";

// The API instance that uses the controllers we have created so far. Every
// controller here will be mounted on the API instance.
//
// New controllers can be added by chaining the `.use` method.
export const api = new Elysia()
  .use(helloController)
  .use(usersController)
  .use(invitationTokenController)
  .use(assignController)
  .use(vehiclesController)
  .use(driversController);
