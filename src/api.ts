import { Elysia } from "elysia";

import { helloController } from "./controllers/hello";
import { usersController } from "./controllers/users";
import { invitationTokenController } from "./controllers/invitationToken";

// The API instance that uses the controllers we have created so far. Every
// controller here will be mounted on the API instance.
//
// New controllers can be added by chaining the `.use` method.
export const api = new Elysia().use(helloController).use(usersController).use(invitationTokenController);
