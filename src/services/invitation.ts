import { eq } from "drizzle-orm";

import type { User } from "lucia";
import { db } from "../db";
import { invitationTable } from "../db/schema";
import { newId } from "../utils/ids";
import { log } from "../utils/log";

export class InvitationNotFoundError extends Error {
  constructor() {
    super("Invitation not found");
  }
}

export abstract class InvitationService {
  static async createInvitation(user: User) {
    log.debug({
      name: "createInvitation",
      params: {
        user,
      },
    });
    const tokenId = newId("invitation");
    const [invitation] = await db
      .insert(invitationTable)
      .values({
        id: tokenId,
        userId: user.id,
      })
      .returning();
    return invitation;
  }

  static async getInvitationTokenById(id: string) {
    log.debug({
      name: "getInvitationTokenById",
      params: {
        id,
      },
    });
    return await db.query.invitationTable.findFirst({
      where: eq(invitationTable.id, id),
    });
  }

  static async getAllInvitations() {
    log.debug({
      name: "getAllInvitations",
    });
    return await db.query.invitationTable.findMany({
      with: {
        user: true,
      },
    });
  }

  static async deleteInvitationById(id: string) {
    log.debug({
      name: "deleteInvitationById",
      params: {
        id,
      },
    });
    const [invitation] = await db
      .delete(invitationTable)
      .where(eq(invitationTable.id, id))
      .returning({
        deletedId: invitationTable.id,
      });
    if (!invitation) {
      throw new InvitationNotFoundError();
    }
    return invitation.deletedId;
  }
}
