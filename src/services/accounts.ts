import { eq } from "drizzle-orm";
import type { User } from "lucia";
import { Argon2id } from "oslo/password";

import type { Session } from "lucia";
import { db } from "../db";
import { invitationTable, userTable } from "../db/schema";
import { lucia } from "../utils/auth";
import { newId } from "../utils/ids";
import { log } from "../utils/log";
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

export class UserNotFoundError extends Error {
  constructor() {
    super("User not found");
  }
}

export abstract class AccountsService {
  /*
   * User account
   */

  static async registerUser(params: {
    email: string;
    password: string;
    invitation: string;
  }) {
    log.debug({
      name: "registerUser",
      params,
    });
    // In order to register a user, we need to check if the invitation is valid
    // and if the email is not already in use.
    //
    // For the invitation, we delete it using the id and check if something
    // was deleted. If not, the invitation is invalid.
    //
    // For the email, we rely on the unique constraint of the email column.

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

      // biome-ignore lint/style/noNonNullAssertion: We know the user was inserted because of the try/catch block above.
      return insertedUser!;
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
    log.debug({
      name: "fetchUserByEmailPassword",
      params,
    });
    // We retrieve the user by email and validate the password using the hashed
    // password column. This function throws an error if the email is not found
    // or if the password is invalid.

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
    log.debug({
      name: "getUserById",
      params: { id },
    });
    return await db.query.userTable.findFirst({
      where: eq(userTable.id, id),
      columns: {
        hashedPassword: false,
      },
    });
  }

  static async getAllUsers() {
    log.debug({
      name: "getAllUsers",
    });
    return await db.query.userTable.findMany({
      columns: {
        hashedPassword: false,
      },
    });
  }

  static async deleteUser(userId: string) {
    log.debug({
      name: "deleteUser",
      params: { userId },
    });
    const [user] = await db
      .delete(userTable)
      .where(eq(userTable.id, userId))
      .returning({
        deletedId: userTable.id,
      });
    if (!user) {
      throw new UserNotFoundError();
    }
    return user.deletedId;
  }

  /*
   * Session
   */

  static async generateUserSession(user: User) {
    log.debug({
      name: "generateUserSession",
      params: { userId: user.id },
    });
    return await lucia.createSession(user.id, {});
  }

  static async deleteSession(session: Session) {
    log.debug({
      name: "deleteSession",
      params: { sessionId: session.id },
    });
    return await lucia.invalidateSession(session.id);
  }
}
