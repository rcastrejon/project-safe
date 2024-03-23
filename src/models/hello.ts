import { Elysia, t } from "elysia";

// The model that will be used for validating the request. In this case, it
// is used to validate the query parameters of the request.
//
// Models should be created using the `Elysia` class with the `name` option
// set to the desired model name. The models should be created using the
// Elysia reference model for each module, for more info:
// https://elysiajs.com/validation/reference-model.html#reference-model
export const helloModel = new Elysia({ name: "Model.Hello" }).model({
  "hello.name": t.Object({
    name: t.Optional(t.String()),
  }),
});
