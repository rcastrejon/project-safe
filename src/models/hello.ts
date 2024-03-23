import { Elysia, t } from "elysia";

export const helloModel = new Elysia({ name: "Model.Hello" }).model({
  "hello.name": t.Object({
    name: t.Optional(t.String()),
  }),
});
