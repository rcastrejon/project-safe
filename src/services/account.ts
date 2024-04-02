import { DrizzleError, eq } from "drizzle-orm";
import { Argon2id } from "oslo/password";

import { db } from "../db";
import { userTable } from "../db/schema";
import { newId } from "../utils/ids";

export abstract class AccountService {
  static async createUser(email: string, password: string) {
    // The incoming email is already validated to be a valid email address, but
    // we still need to check if it's already in use
    const normalizedEmail = email.toLowerCase();
    const hashedPassword = await new Argon2id().hash(password);
    const userId = newId("user");

    try {
      const insertedUser = await db.transaction(async (tx) => {
        const existingUser = await tx.query.userTable.findFirst({
          where: eq(userTable.email, normalizedEmail),
          columns: {
            id: true,
          },
        });
        if (existingUser) return tx.rollback();
        const [insertedUser] = await tx
          .insert(userTable)
          .values({
            id: userId,
            email: normalizedEmail,
            hashedPassword,
          })
          .returning();
        if (!insertedUser) return tx.rollback();
        return insertedUser;
      });
      return { user: insertedUser };
    } catch (e) {
      if (e instanceof DrizzleError) {
        return { error: "Email already in use" } as const;
      }
      throw e; // don't handle unexpected errors
    }
  }

  static async getUserById(id: string) {
    return db.query.userTable.findFirst({
      where: eq(userTable.id, id),
      columns: {
        hashedPassword: false,
      },
    });
  }

  static async getAllUsers() {
    return db.query.userTable.findMany({
      columns: {
        hashedPassword: false,
      },
    });
  }

  static async deleteUserById(id: string) {
    const deletedUser = await db.transaction(async (tx) => {
      const user = await tx.query.userTable.findFirst({
        where: eq(userTable.id, id),
        columns: {
          id: true,
        },
      });
      if (!user) return undefined;
      await tx.delete(userTable).where(eq(userTable.id, id));
      return user;
    });
    return deletedUser;
  }
}
