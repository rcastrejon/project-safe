import { Elysia, t } from "elysia";

export const userModel = new Elysia({ name: "Model.User" }).model({
  "user.create": t.Object({
    email: t.String({
      format: "email",
    }),
    password: t.String({
      minLength: 8,
      maxLength: 256,
    }),
  }),
  "user.get": t.Object({
    id: t.String(),
  }),
});
