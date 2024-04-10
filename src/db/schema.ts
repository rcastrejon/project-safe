import { relations } from "drizzle-orm";
import {
  boolean,
  date,
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const userTable = pgTable("user", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  hashedPassword: text("hashed_password").notNull(),
});

export const sessionTable = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export const invitationTable = pgTable("invitation", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
});

// TODO: Add photo field
export const vehicleTable = pgTable("vehicle", {
  id: text("id").primaryKey(),
  make: text("make").notNull(),
  model: text("model").notNull(),
  vin: text("vin").notNull().unique(),
  cost: integer("cost").notNull(),
  licensePlate: text("license_plate").notNull().unique(),
  purchaseDate: date("purchase_date").notNull(),
  registrationDate: timestamp("registration_date").notNull().defaultNow(),
});

export const driverTable = pgTable("driver", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  birthDate: date("birth_date").notNull(),
  curp: text("curp").notNull().unique(),
  address: text("address").notNull(),
  monthlySalary: integer("monthly_salary").notNull(),
  licenseNumber: text("license_number").notNull().unique(),
  registrationDate: timestamp("registration_date").notNull().defaultNow(),
});

export const assignmentTable = pgTable("assignment", {
  id: text("id").primaryKey(),
  vehicleId: text("vehicle_id")
    .notNull()
    .references(() => vehicleTable.id),
  driverId: text("driver_id")
    .notNull()
    .references(() => driverTable.id),
  isActive: boolean("is_active").notNull().default(true),
  registrationDate: timestamp("registration_date").notNull().defaultNow(),
});

export const routeTable = pgTable("route", {
  id: text("id").primaryKey(),
  assignmentId: text("assignment_id")
    .notNull()
    .references(() => assignmentTable.id),
  startLongitude: numeric("start_longitude", {
    precision: 14,
    scale: 11,
  }).notNull(),
  startLatitude: numeric("start_latitude", {
    precision: 14,
    scale: 11,
  }).notNull(),
  endLongitude: numeric("end_longitude", {
    precision: 14,
    scale: 11,
  }).notNull(),
  endLatitude: numeric("end_latitude", { precision: 14, scale: 11 }).notNull(),
  name: text("name").notNull(),
  driveDate: date("drive_date").notNull(),
  success: boolean("success"),
  problemDescription: text("problem_description"),
  comments: text("comments"),
  registrationDate: timestamp("registration_date").notNull().defaultNow(),
});

export const invitationRelations = relations(invitationTable, ({ one }) => {
  return {
    user: one(userTable, {
      fields: [invitationTable.userId],
      references: [userTable.id],
    }),
  };
});

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
