import { DrizzleError, and, eq } from "drizzle-orm";
import { db } from "../db";
import { assignmentTable, driverTable, vehicleTable } from "../db/schema";
import { newId } from "../utils/ids";

export abstract class AssignService {
  static async createAssign(
    vehicleId: string,
    driverId: string,
    startDate: string,
    endDate: string,
    isActive: boolean
  ) {
    const assignId = newId("assign");
    const [existValidation, assignValidation] = await Promise.all([
      validateExist(vehicleId, driverId),
      validateAssign(vehicleId, driverId),
    ]);

    if (existValidation) return existValidation;
    if (assignValidation) return assignValidation;

    try {
      const insertedAssign = await db.transaction(async (tx) => {
        const insertedAssign = await tx
          .insert(assignmentTable)
          .values({
            id: assignId,
            vehicleId,
            driverId,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            isActive,
          })
          .returning();

        if (!insertedAssign) return tx.rollback();
        return insertedAssign;
      });

      return { assign: insertedAssign };
    } catch (e) {
      if (e instanceof DrizzleError) {
        return { error: "Driver or vehicle already assigned" } as const;
      }
      throw e;
    }
  }

  static async getAssignById(id: string) {
    return db.query.assignmentTable.findFirst({
      where: eq(assignmentTable.id, id),
    });
  }

  static async getAllAssigns() {
    return db.query.assignmentTable.findMany({});
  }

  static async updateAssign(
    id: string,
    vehicleId: string,
    driverId: string,
    startDate: string,
    endDate: string,
    isActive: boolean
  ) {
    const date_startDate: Date = new Date(startDate);
    const date_endDate: Date = new Date(endDate);
    //Validar si el vehiculo y el conductor existen
    const error = await validateExist(vehicleId, driverId);

    if (error) return error;

    try {
      const updatedAssign = await db.transaction(async (tx) => {
        const [updatedAssign] = await tx
          .update(assignmentTable)
          .set({
            vehicleId,
            driverId,
            startDate: date_startDate,
            endDate: date_endDate,
            isActive,
          })
          .where(eq(assignmentTable.id, id))
          .returning();
        if (!updatedAssign) return tx.rollback();
        return updatedAssign;
      });
      return { assign: updatedAssign };
    } catch (e) {
      if (e instanceof DrizzleError) {
        return { error: "Assign not found" } as const;
      }
      throw e;
    }
  }
}

async function validateExist(vehicleId: string, driverId: string) {
  // Validar que el vehículo y el conductor existan
  try {
    const [existingVehicle, existingDriver] = await db.transaction(
      async (tx) => {
        const existingVehicle = await tx.query.vehicleTable.findFirst({
          where: eq(vehicleTable.id, vehicleId),
          columns: {
            id: true,
          },
        });
        const existingDriver = await tx.query.driverTable.findFirst({
          where: eq(driverTable.id, driverId),
          columns: {
            id: true,
          },
        });
        if (!existingVehicle || !existingDriver) return tx.rollback();
        return [existingVehicle, existingDriver];
      }
    );
  } catch (e) {
    if (e instanceof DrizzleError) {
      return { error: "Vehicle or driver not found" } as const;
    }
    throw e;
  }

  return null;
}

async function validateAssign(vehicleId: string, driverId: string) {
  // Validar que el conductor no esté asignado a otra asignación y que la asignación sea activa
  const existingAssign = await db
    .select()
    .from(assignmentTable)
    .where(
      and(
        eq(assignmentTable.driverId, driverId),
        eq(assignmentTable.isActive, true)
      )
    )
    .execute();
  if (existingAssign.length > 0)
    return { error: "Driver already assigned" } as const;

  // Validar que el vehículo no esté asignado a otra asignación
  const existingAssign2 = await db
    .select()
    .from(assignmentTable)
    .where(
      and(
        eq(assignmentTable.vehicleId, vehicleId),
        eq(assignmentTable.isActive, true)
      )
    )
    .execute();
  if (existingAssign2.length > 0)
    return { error: "Vehicle already assigned" } as const;

  return null;
}
