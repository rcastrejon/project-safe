import { Argon2id } from "oslo/password";
import { userTable } from "../../src/db/schema";

type UserInsert = typeof userTable.$inferInsert;

const argon = new Argon2id();

export const users: UserInsert[] = [
  {
    id: "john",
    email: "john@doe.com",
    hashedPassword: await argon.hash("password"),
  },
  {
    id: "jane",
    email: "jane@doe.com",
    hashedPassword: await argon.hash("password"),
  },
];
