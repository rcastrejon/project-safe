import { and, eq, or } from "drizzle-orm";
import { db } from "../db";
import { assignmentTable, driverTable, vehicleTable } from "../db/schema";
import { newId } from "../utils/ids";

export class InvalidAssignmentError extends Error {
  constructor() {
    super(
      "Invalid assignment, make sure the driver and vehicle are valid and that an assignment is not already active",
    );
  }
}

export class AssignmentNotFoundError extends Error {
  constructor() {
    super("Assignment not found");
  }
}

export abstract class AssignmentService {
  static async createAssignment(params: {
    vehicleId: string;
    driverId: string;
  }) {
    // Create a new assignment, making sure that the vehicle and the driver
    // have not been assigned to another (active) assignment yet
    const [existValidation, availabilityValidation] = await Promise.all([
      validateExists(params.vehicleId, params.driverId),
      validateAssignmentAvailability(params.vehicleId, params.driverId),
    ]);

    if (!existValidation || !availabilityValidation) {
      throw new InvalidAssignmentError();
    }

    const assignmentId = newId("assignment");
    const [assignment] = await db
      .insert(assignmentTable)
      .values({
        id: assignmentId,
        vehicleId: params.vehicleId,
        driverId: params.driverId,
      })
      .returning();
    return assignment;
  }

  static async getAssignmentById(id: string) {
    return await db.query.assignmentTable.findFirst({
      where: eq(assignmentTable.id, id),
    });
  }

  static async getAllAssignments() {
    return await db.query.assignmentTable.findMany();
  }

  static async updateAssignment(params: {
    id: string;
    vehicleId: string;
    driverId: string;
  }) {
    const foundAssignment = await db.query.assignmentTable.findFirst({
      where: eq(assignmentTable.id, params.id),
    });
    if (!foundAssignment || !foundAssignment.isActive)
      throw new AssignmentNotFoundError();

    const [updateValidation, availabilityValidation] = await Promise.all([
      validateExists(params.vehicleId, params.driverId),
      validateAssignmentAvailability(params.vehicleId, params.driverId),
    ]);

    if (!updateValidation || !availabilityValidation) {
      throw new InvalidAssignmentError();
    }

    const [updatedAssignment] = await db
      .update(assignmentTable)
      .set({
        vehicleId: params.vehicleId,
        driverId: params.driverId,
      })
      .where(eq(assignmentTable.id, params.id))
      .returning();

    return updatedAssignment;
  }

  static async deleteAssignment(id: string) {
    const [deletedAssignment] = await db
      .update(assignmentTable)
      .set({
        isActive: false,
      })
      .where(eq(assignmentTable.id, id))
      .returning();

    if (!deletedAssignment) throw new AssignmentNotFoundError();

    return deletedAssignment;
  }
}

async function validateExists(vehicleId: string, driverId: string) {
  // Validate that the vehicle and the driver exist
  const existingVehicle = await db.query.vehicleTable.findFirst({
    where: eq(vehicleTable.id, vehicleId),
  });
  const existingDriver = await db.query.driverTable.findFirst({
    where: eq(driverTable.id, driverId),
  });
  return existingVehicle && existingDriver;
}

async function validateAssignmentAvailability(
  vehicleId: string,
  driverId: string,
) {
  // Validate that the assignment is not already active for the vehicle or the
  // driver
  const foundAssignment = await db.query.assignmentTable.findFirst({
    where: or(
      and(
        eq(assignmentTable.vehicleId, vehicleId),
        eq(assignmentTable.isActive, true),
      ),
      and(
        eq(assignmentTable.driverId, driverId),
        eq(assignmentTable.isActive, true),
      ),
    ),
  });
  return foundAssignment === undefined;
}
