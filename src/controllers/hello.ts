import { Elysia } from "elysia";

import { helloModel } from "../models/hello";
import { HelloService } from "../services/hello";

// The controller that will handle the requests to the /hello endpoint. It uses
// the `helloModel` model for validating the search query parameters and the
// `HelloService` service for the business logic.
//
// Controllers should be created using the `Elysia` class with the `prefix`
// option set to the desired endpoint path.
export const helloController = new Elysia({ prefix: "/hello" })
  .use(helloModel)
  .get("/", ({ query: { name } }) => HelloService.sayHello(name ?? "world"), {
    query: "hello.name",
  });
