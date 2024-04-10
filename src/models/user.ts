import { Elysia, t } from "elysia";

export const userModel = new Elysia({ name: "Model.User" }).model({
  "user.sign-up": t.Object({
    email: t.String({
      format: "email",
    }),
    password: t.String({
      minLength: 8,
      maxLength: 256,
    }),
    invitation: t.String(),
  }),
  "user.sign-in": t.Object({
    email: t.String(),
    password: t.String(),
  }),
  "user.get": t.Object({
    id: t.String(),
  }),
});
