import { Elysia, t } from "elysia";

export const invitationTokenModel = new Elysia({ name: "Model.InvitationToken" }).model({
    "invitationToken.create": t.Object({
        userId: t.String(),
    }),
    "invitationToken.get": t.Object({
        id: t.String(),
        userId: t.String(),
    }),
});
