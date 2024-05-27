import { eq } from "drizzle-orm";
import { db } from "../db";
import { driverTable } from "../db/schema";
import { newId } from "../utils/ids";
import { log } from "../utils/log";

export class InvalidDriverError extends Error {
  constructor() {
    super("Invalid driver, data may be duplicated");
  }
}

export class DriverNotFoundError extends Error {
  constructor() {
    super("Driver not found");
  }
}

export abstract class DriverService {
  static async createDriver(params: {
    name: string;
    birthDate: string;
    curp: string;
    address: string;
    monthlySalary: number;
    licenseNumber: string;
  }) {
    log.debug({
      name: "createDriver",
      params,
    });
    const driverId = newId("driver");

    try {
      const [insertedDriver] = await db
        .insert(driverTable)
        .values({
          id: driverId,
          ...params,
        })
        .returning();
      return insertedDriver;
    } catch (e) {
      if ((e as { code?: string }).code === "23505") {
        throw new InvalidDriverError();
      }
      throw e; // Unexpected error
    }
  }

  static async getDriverById(id: string) {
    log.debug({
      name: "getDriverById",
      params: { id },
    });
    return await db.query.driverTable.findFirst({
      where: eq(driverTable.id, id),
    });
  }

  static async getAllDrivers() {
    return await db.query.driverTable.findMany();
  }

  static async updateDriverById(
    id: string,
    params: {
      name: string;
      birthDate: string;
      curp: string;
      address: string;
      monthlySalary: number;
      licenseNumber: string;
    },
  ) {
    log.debug({
      name: "updateDriverById",
      params: { id, ...params },
    });
    try {
      const [driver] = await db
        .update(driverTable)
        .set(params)
        .where(eq(driverTable.id, id))
        .returning();
      if (!driver) {
        throw new DriverNotFoundError();
      }
      return driver;
    } catch (e) {
      if ((e as { code?: string }).code === "23505") {
        throw new InvalidDriverError();
      }
      throw e; // Unexpected error
    }
  }

  static async deleteDriverById(id: string) {
    log.debug({
      name: "deleteDriverById",
      params: { id },
    });
    const [driver] = await db
      .delete(driverTable)
      .where(eq(driverTable.id, id))
      .returning({
        deletedId: driverTable.id,
      });
    if (!driver) {
      throw new DriverNotFoundError();
    }
    return driver.deletedId;
  }
}
