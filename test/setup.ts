import { sql } from "drizzle-orm";
import { db } from "../src/db";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { beforeAll, beforeEach } from "bun:test";
import { users } from "./fixtures/users";
import {
  driverTable,
  invitationTable,
  sessionTable,
  userTable,
  vehicleTable,
} from "../src/db/schema";
import { invitations } from "./fixtures/invitations";
import { sessions } from "./fixtures/sessions";
import { drivers } from "./fixtures/drivers";
import { vehicles } from "./fixtures/vehicles";

beforeAll(async () => {
  await migrate(db, {
    migrationsFolder: "drizzle",
  });
});

beforeEach(async () => {
  await db.execute(
    sql`TRUNCATE TABLE "user", "invitation", "session", "driver", "vehicle" CASCADE;`,
  );

  for (const u of users) {
    await db.insert(userTable).values(u);
  }
  for (const i of invitations) {
    await db.insert(invitationTable).values(i);
  }
  for (const s of sessions) {
    await db.insert(sessionTable).values(s);
  }
  for (const d of drivers) {
    await db.insert(driverTable).values(d);
  }
  for (const v of vehicles) {
    await db.insert(vehicleTable).values(v);
  }
});
