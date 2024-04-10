import { Argon2id } from "oslo/password";
import { db } from "../src/db";
import { userTable } from "../src/db/schema";
import { newId } from "../src/utils/ids";

await db.insert(userTable).values({
  id: newId("user"),
  email: "admin@admin.com",
  hashedPassword: await new Argon2id().hash("password"),
});

console.log("Seed data created");
