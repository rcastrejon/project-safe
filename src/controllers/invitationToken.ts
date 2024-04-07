import { Elysia } from "elysia";
import { invitationTokenModel } from "../models/invitationToken";
import { InvitationTokenService } from "../services/invitationToken";

export const invitationTokenController = new Elysia({ prefix: "/invitationToken" })
  .use(invitationTokenModel)
  .get("/", async () => {
    const tokens = await InvitationTokenService.getAllInvitationTokens();
    return { tokens };
  })
  .get(
    "/:id",
    async ({ params: { id }, error }) => {
      const token = await InvitationTokenService.getInvitationTokenById(id);
      if (!token) return error(404, { error: "Token not found" });
      return { token };
    }
  )
  .get(
    "/user/:userId",
    async ({ params: { userId }, error }) => {
      const token = await InvitationTokenService.getInvitationTokenByUserId(userId);
      if (!token) return error(404, { error: "Token not found" });
      return { token };
    }
  )
  .post(
    "/",
    async ({ body: { userId } }) => {
      try {
        const { token } = await InvitationTokenService.createInvitationToken(userId);
        return { token };
      }
      catch (e) {
        return { error: e };
      }
    },
    {
      body: "invitationToken.create",
    },
  );