import { Elysia, t } from "elysia";

export const invitationTokenModel = new Elysia({
  name: "Model.Invitation",
}).model({
  "invitation.get": t.Object({
    id: t.String(),
  }),
});
