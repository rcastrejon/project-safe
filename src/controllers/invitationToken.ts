import { Elysia } from "elysia";
import { invitationTokenModel } from "../models/invitationToken";
import { InvitationTokenService } from "../services/invitationToken";

export const invitationTokenController = new Elysia({ prefix: "/invitationToken" })
  .use(invitationTokenModel)
  .get("/", async () => {
    const tokens = await InvitationTokenService.getAllInvitationTokens();
    return { items: tokens };
  })