import { Elysia } from "elysia";

import { assignmentsController } from "./controllers/assignments";
import { driversController } from "./controllers/drivers";
import { helloController } from "./controllers/hello";
import { invitationsController } from "./controllers/invitations";
import { registrationsController } from "./controllers/registrations";
import { routesController } from "./controllers/routes";
import { sessionsController } from "./controllers/sessions";
import { usersController } from "./controllers/users";
import { vehiclesController } from "./controllers/vehicles";

// The API instance that uses the controllers we have created so far. Every
// controller here will be mounted on the API instance.
//
// New controllers can be added by chaining the `.use` method.
export const api = new Elysia()
  .onError(({ code, error, set }) => {
    if (code === "VALIDATION") {
      set.headers["content-type"] = "application/json";
      return error.message;
    }
  })
  .use(helloController)
  .use(registrationsController)
  .use(sessionsController)
  .use(usersController)
  .use(invitationsController)
  .use(assignmentsController)
  .use(vehiclesController)
  .use(driversController)
  .use(routesController);
