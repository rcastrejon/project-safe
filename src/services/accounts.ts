import { eq } from "drizzle-orm";
import type { User } from "lucia";
import { Argon2id } from "oslo/password";

import { db } from "../db";
import { invitationTable, userTable } from "../db/schema";
import { lucia } from "../utils/auth";
import { newId } from "../utils/ids";
import type { MaybeQueryError } from "../utils/query-helpers";

export class InvalidInvitationError extends Error {
  constructor() {
    super("Invalid invitation");
  }
}

export class InvalidEmailPasswordError extends Error {
  constructor() {
    super("Invalid email or password");
  }
}

export class EmailInUseError extends Error {
  constructor() {
    super("Email already in use");
  }
}

export abstract class AccountsService {
  // User account

  static async registerUser(params: {
    email: string;
    password: string;
    invitation: string;
  }) {
    const hashedPassword = await new Argon2id().hash(params.password);
    const userId = newId("user");

    const [deletedId] = await db
      .delete(invitationTable)
      .where(eq(invitationTable.id, params.invitation))
      .returning({
        deletedId: invitationTable.id,
      });
    if (!deletedId) throw new InvalidInvitationError();

    try {
      const [insertedUser] = await db
        .insert(userTable)
        .values({
          id: userId,
          email: params.email,
          hashedPassword,
        })
        .returning({
          id: userTable.id,
          email: userTable.email,
        });

      if (!insertedUser) {
        throw new Error();
      }

      return insertedUser;
    } catch (e) {
      // The following error code is returned when the email is already in use
      if ((e as MaybeQueryError).code === "23505") {
        throw new EmailInUseError();
      }
      throw e;
    }
  }

  static async fetchUserByEmailPassword(params: {
    email: string;
    password: string;
  }) {
    const user = await db.query.userTable.findFirst({
      where: eq(userTable.email, params.email),
    });
    const argon = new Argon2id();
    if (!user) {
      // Hash the password to prevent timing attacks
      await argon.hash(params.password);
      throw new InvalidEmailPasswordError();
    }
    const validPassword = await argon.verify(
      user.hashedPassword,
      params.password,
    );
    if (!validPassword) {
      throw new InvalidEmailPasswordError();
    }
    return user;
  }

  static async getUserById(id: string) {
    return await db.query.userTable.findFirst({
      where: eq(userTable.id, id),
      columns: {
        hashedPassword: false,
      },
    });
  }

  static async getAllUsers() {
    return await db.query.userTable.findMany({
      columns: {
        hashedPassword: false,
      },
    });
  }

  // Session

  static async generateUserSession(user: User) {
    return await lucia.createSession(user.id, {});
  }
}
