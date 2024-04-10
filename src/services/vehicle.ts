import { eq } from "drizzle-orm";

import { db } from "../db";
import { vehicleTable } from "../db/schema";
import { newId } from "../utils/ids";
import type { MaybeQueryError } from "../utils/query-helpers";

export class InvalidVehicleError extends Error {
  constructor() {
    super("Invalid vehicle, data may be duplicated");
  }
}

export class VehicleNotFoundError extends Error {
  constructor() {
    super("Vehicle not found");
  }
}

export abstract class VehicleService {
  static async createVehicle(params: {
    make: string;
    model: string;
    vin: string;
    licensePlate: string;
    purchaseDate: string;
    cost: number;
  }) {
    const vehicleId = newId("vehicle");

    try {
      const [insertedVehicle] = await db
        .insert(vehicleTable)
        .values({
          id: vehicleId,
          ...params,
        })
        .returning();
      return insertedVehicle;
    } catch (e) {
      if ((e as MaybeQueryError).code === "23505") {
        throw new InvalidVehicleError();
      }
      throw e;
    }
  }

  static async getVehicleById(id: string) {
    return await db.query.vehicleTable.findFirst({
      where: eq(vehicleTable.id, id),
    });
  }

  static async getAllVehicles() {
    return await db.query.vehicleTable.findMany();
  }

  static async updateVehicleById(
    id: string,
    params: {
      make: string;
      model: string;
      vin: string;
      licensePlate: string;
      purchaseDate: string;
      cost: number;
    },
  ) {
    try {
      const [vehicle] = await db
        .update(vehicleTable)
        .set(params)
        .where(eq(vehicleTable.id, id))
        .returning();
      if (!vehicle) {
        throw new VehicleNotFoundError();
      }
      return vehicle;
    } catch (e) {
      if ((e as MaybeQueryError).code === "23505") {
        throw new InvalidVehicleError();
      }
      throw e;
    }
  }

  static async deleteVehicleById(id: string) {
    const [vehicle] = await db
      .delete(vehicleTable)
      .where(eq(vehicleTable.id, id))
      .returning({
        deletedId: vehicleTable.id,
      });
    if (!vehicle) {
      throw new VehicleNotFoundError();
    }
    return vehicle.deletedId;
  }
}
