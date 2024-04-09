import { DrizzleError, eq } from "drizzle-orm";
import { Argon2id } from "oslo/password";

import { db } from "../db";
import { invitationTokenTable } from "../db/schema";
import { newId } from "../utils/ids";

export abstract class InvitationTokenService {
    static async createInvitationToken(userId: string) {
        const tokenId = newId("invitationToken");

        try {
            const insertedToken = await db.transaction(async (tx) => {
                const [insertedToken] = await tx
                .insert(invitationTokenTable)
                .values({
                    id: tokenId,
                    userId,
                })
                .returning();
                if (!insertedToken) return tx.rollback();
                return insertedToken;
            });
            return { token: insertedToken };
        } catch (e) {
            throw e; // don't handle unexpected errors
        }
    }
    
    static async getInvitationTokenById(id: string) {
        return db.query.invitationTokenTable.findFirst({
        where: eq(invitationTokenTable.id, id),
        });
    }
    
    static async getInvitationTokenByUserId(userId: string) {
        return db.query.invitationTokenTable.findFirst({
        where: eq(invitationTokenTable.userId, userId),
        });
    }

    static async getAllInvitationTokens() {
        return db.query.invitationTokenTable.findMany();
    }

    static async deleteInvitationTokenById(id: string) {
        const deletedInvitationToken = await db.transaction(async (tx) => {
            const invitationToken = await tx.query.invitationTokenTable.findFirst({
              where: eq(invitationTokenTable.id, id),
              columns: {
                id: true,
              },
            });
            if (!invitationToken) return undefined;
            await tx.delete(invitationTokenTable).where(eq(invitationTokenTable.id, id));
            return invitationToken;
          });
          return deletedInvitationToken;
    }
}