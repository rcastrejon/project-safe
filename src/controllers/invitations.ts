import { Elysia } from "elysia";

import { invitationTokenModel } from "../models/invitation";
import { authService } from "../services/auth";
import {
  InvitationNotFoundError,
  InvitationService,
} from "../services/invitation";

export const invitationsController = new Elysia({
  prefix: "/invitations",
})
  .use(authService)
  .use(invitationTokenModel)
  // POST /invitations
  .post("/", async ({ user, error }) => {
    if (!user) return error(401, { error: "Unauthorized" });

    const invitation = await InvitationService.createInvitation(user);
    return { invitation };
  })
  // GET /invitations
  .get("/", async ({ user, error }) => {
    if (!user) return error(401, { error: "Unauthorized" });

    const invitations = await InvitationService.getAllInvitations();
    return { items: invitations };
  })
  // GET /invitations/:id
  .get(
    "/:id",
    async ({ user, params: { id }, error }) => {
      if (!user) return error(401, { error: "Unauthorized" });

      const invitation = await InvitationService.getInvitationTokenById(id);
      if (!invitation) return error(404, { error: "Invitation not found" });
      return invitation;
    },
    {
      params: "invitation.get",
    },
  )
  // DELETE /invitations/:id
  .delete(
    "/:id",
    async ({ user, params: { id }, error }) => {
      if (!user) return error(401, { error: "Unauthorized" });

      try {
        const deletedId = await InvitationService.deleteInvitationById(id);
        return { id: deletedId };
      } catch (e) {
        if (e instanceof InvitationNotFoundError) {
          return error(404, { error: "Invitation not found" });
        }
      }
    },
    {
      params: "invitation.get",
    },
  );
