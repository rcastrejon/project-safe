import { DrizzleError, eq } from "drizzle-orm";

import { db } from "../db";
import { vehicleTable } from "../db/schema";
import { newId } from "../utils/ids";

export abstract class VehicleService {
  static async createVehicle(
    _brand: string,
    model: string,
    vin: string,
    licensePlate: string,
    purchaseDate: string,
    cost: number,
    registrationDate: string,
  ) {
    const normalizedVin = vin.toUpperCase();
    const normalizedPurchaseDate: Date = new Date(purchaseDate);
    const normalizedRegistrationDate: Date = new Date(registrationDate);

    try {
      const insertedVehicle = await db.transaction(async (tx) => {
        // Check for existing vehicle with the same VIN (unique identifier)
        const existingVehicle = await tx.query.vehicleTable.findFirst({
          where: eq(vehicleTable.vin, normalizedVin),
          columns: {
            id: true,
          },
        });

        if (existingVehicle) return tx.rollback();

        const vehicleId = newId("vehicle");
        const [insertedVehicle] = await tx
          .insert(vehicleTable)
          .values({
            id: vehicleId,
            make: _brand,
            model,
            vin: normalizedVin,
            cost,
            licensePlate,
            purchaseDate: normalizedPurchaseDate,
            registrationDate: normalizedRegistrationDate,
          })
          .returning();

        if (!insertedVehicle) return tx.rollback();
        return insertedVehicle;
      });

      return { vehicle: insertedVehicle };
    } catch (error) {
      if (error instanceof DrizzleError) {
        return { error: "Vehicle already exits" } as const;
      }
      throw error;
    }
  }

  static async getVehicleById(id: string) {
    return db.query.vehicleTable.findFirst({
      where: eq(vehicleTable.id, id),
    });
  }

  static async getAllVehicles() {
    return db.query.vehicleTable.findMany();
  }

  static async deleteVehicleById(id: string) {
    const deletedVehicle = await db.transaction(async (tx) => {
      const vehicle = await tx.query.vehicleTable.findFirst({
        where: eq(vehicleTable.id, id),
        columns: {
          id: true,
        },
      });

      if (!vehicle) return undefined;

      await tx.delete(vehicleTable).where(eq(vehicleTable.id, id));

      return vehicle;
    });

    return deletedVehicle;
  }
}
