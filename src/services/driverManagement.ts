import { DrizzleError, eq } from "drizzle-orm";
import { db } from "../db";
import { driverTable } from "../db/schema";
import { newId } from "../utils/ids";

export abstract class DriverService {
  static async createDriver(name: string, birthDate: string, curp: string, address: string, monthlySalary: number, licenseNumber: string, registrationDate: string) {
    // Validar si el CURP ya está en uso
    const date_birthDate: Date = new Date(birthDate)
    const date_registrationDate: Date = new Date(registrationDate)
    const normalizedCurp = curp.toUpperCase();
    const driverId = newId("driver");

    try {
      const insertedDriver = await db.transaction(async (tx) => {
        const existingDriver = await tx.query.driverTable.findFirst({
          where: eq(driverTable.curp, normalizedCurp),
          columns: {
            id: true,
          },
        });
        if (existingDriver) return tx.rollback();
        const [insertedDriver] = await tx
          .insert(driverTable)
          .values({
            id: driverId,
            name,
            birthDate: date_birthDate,
            curp: normalizedCurp,
            address,
            monthlySalary,
            licenseNumber,
            registrationDate: date_registrationDate
          })
          .returning();
        if (!insertedDriver) return tx.rollback();
        return insertedDriver;
      });
      return { driver: insertedDriver };
    } catch (e) {
      if (e instanceof DrizzleError) {
        return { error: "CURP already in use" } as const;
      }
      throw e; 
    }
  }

  static async getDriverById(id: string) {
    return db.query.driverTable.findFirst({
      where: eq(driverTable.id, id),
    });
  }

  static async getAllDrivers() {
    return db.query.driverTable.findMany({
    });
  }

  static async deleteDriverById(id: string) {
    const deletedDriver = await db.transaction(async (tx) => {
      const driver = await tx.query.driverTable.findFirst({
        where: eq(driverTable.id, id),
        columns: {
          id: true,
        },
      });
      if (!driver) return undefined;
      await tx.delete(driverTable).where(eq(driverTable.id, id));
      return driver;
    });
    return deletedDriver;
  }
  
}
