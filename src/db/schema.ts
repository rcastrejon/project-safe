import { relations } from "drizzle-orm";
import {
  boolean,
  doublePrecision,
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const userTable = pgTable("user", {
  id: varchar("id", { length: 256 }).primaryKey(),
  email: varchar("email", { length: 256 }).notNull().unique(),
  hashedPassword: varchar("hashed_password").notNull(),
});

export const invitationTokenTable = pgTable("invitation_token", {
  id: varchar("id", { length: 256 }).primaryKey(),
  userId: varchar("user_id", { length: 256 })
    .notNull()
    .references(() => userTable.id),
});

// TODO: Add photo field
export const vehicleTable = pgTable("vehicle", {
  id: varchar("id", { length: 256 }).primaryKey(),
  make: varchar("make", { length: 256 }).notNull(),
  model: varchar("model", { length: 256 }).notNull(),
  vin: varchar("vin", { length: 256 }).notNull().unique(),
  cost: integer("cost").notNull(),
  licensePlate: varchar("license_plate", { length: 256 }).notNull().unique(),
  purchaseDate: timestamp("purchase_date").notNull(),
  registrationDate: timestamp("registration_date").notNull(),
});

export const driverTable = pgTable("driver", {
  id: varchar("id", { length: 256 }).primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  birthDate: timestamp("birth_date").notNull(),
  curp: varchar("curp", { length: 256 }).notNull().unique(),
  address: varchar("address", { length: 256 }).notNull(),
  monthlySalary: integer("monthly_salary").notNull(),
  licenseNumber: varchar("license_number", { length: 256 }).notNull().unique(),
  registrationDate: timestamp("registration_date").notNull(),
});

export const assignmentTable = pgTable("assignment", {
  id: varchar("id", { length: 256 }).primaryKey(),
  vehicleId: varchar("vehicle_id", { length: 256 })
    .notNull()
    .references(() => vehicleTable.id),
  driverId: varchar("driver_id", { length: 256 })
    .notNull()
    .references(() => driverTable.id),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  isActive: boolean("is_active").notNull().default(true),
});

export const routeTable = pgTable("route", {
  id: varchar("id", { length: 256 }).primaryKey(),
  assignmentId: varchar("assignment_id", { length: 256 })
    .notNull()
    .references(() => assignmentTable.id),
  startLongitude: doublePrecision("start_longitude").notNull(),
  startLatitude: doublePrecision("start_latitude").notNull(),
  endLongitude: doublePrecision("end_longitude").notNull(),
  endLatitude: doublePrecision("end_latitude").notNull(),
  name: varchar("name", { length: 256 }).notNull(),
  registrationDate: timestamp("registration_date").notNull(),
  driveDate: timestamp("drive_date").notNull(),
  success: boolean("success"),
  problemDescription: text("problem_description"),
  comments: text("comments"),
});

export const invitationTokenRelations = relations(
  invitationTokenTable,
  ({ one }) => {
    return {
      user: one(userTable, {
        fields: [invitationTokenTable.userId],
        references: [userTable.id],
      }),
    };
  },
);

export const assignmentRelations = relations(assignmentTable, ({ one }) => {
  return {
    vehicle: one(vehicleTable, {
      fields: [assignmentTable.vehicleId],
      references: [vehicleTable.id],
    }),
    driver: one(driverTable, {
      fields: [assignmentTable.driverId],
      references: [driverTable.id],
    }),
  };
});

export const routeRelations = relations(routeTable, ({ one }) => {
  return {
    assignment: one(assignmentTable, {
      fields: [routeTable.assignmentId],
      references: [assignmentTable.id],
    }),
  };
});
