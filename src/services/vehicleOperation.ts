import { DrizzleError, eq } from "drizzle-orm";

import { db } from "../db";
import { vehicleTable } from "../db/schema";
import { newId } from "../utils/ids";
import { replaceUrlPath } from "elysia/utils";

export abstract class VehicleService {
  static async createVehicle( vehicleData: {
    brand: string,
    model: string,
    vin: string,
    plate: string,
    purchaseDate: string,
    cost: number,
    photo: string,
    registrationDate: string
  }) {
    const vehicleId = newId("vehicle");
    const normalizedVin = vehicleData.vin.toUpperCase();

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

        const [insertedVehicle] = await tx
          .insert(vehicleTable)
          .values({
            id: vehicleId,
            make: vehicleData.brand,
            model: vehicleData.model,
            vin: normalizedVin,
            cost: vehicleData.cost,
            licensePlate: vehicleData.plate,
            purchaseDate: vehicleData.purchaseDate,
            registrationDate: vehicleData.registrationDate,
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
      where: eq(vehicleTable.id, id)
    })
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
