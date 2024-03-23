import { Elysia, t } from "elysia";

import { helloModel } from "../models/hello";
import { HelloService } from "../services/hello";

export const helloController = new Elysia({ prefix: "/hello" })
  .use(helloModel)
  .get("/", ({ query: { name } }) => HelloService.sayHello(name ?? "world"), {
    query: "hello.name",
  });
