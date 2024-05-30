import { and, eq, gt, ne } from "drizzle-orm";
import { db } from "../db";
import { assignmentTable, routeTable } from "../db/schema";
import { newId } from "../utils/ids";

export class InvalidRouteError extends Error {
  constructor() {
    super(
      "Invalid route, please check the fields are correct and that the vehicle is not already assigned to a route that date.",
    );
  }
}

export class CannotDeleteRouteError extends Error {
  constructor() {
    super("Route cannot be deleted, please check the date is in the future.");
  }
}

export abstract class RouteService {
  static async createRoute(params: {
    assignmentId: string;
    endLongitude: string | number;
    endLatitude: string | number;
    name: string;
    driveDate: string;
    comments?: string;
  }) {
    const assignmentIsValid = await RouteService.validateAssignment(
      params.assignmentId,
    );
    const routeIsValid = await RouteService.validateVehicleNotOverlapping(
      params.driveDate,
      params.assignmentId,
    );

    if (!assignmentIsValid || !routeIsValid) {
      throw new InvalidRouteError();
    }

    const routeId = newId("route");
    const [insertedRoute] = await db
      .insert(routeTable)
      .values({
        id: routeId,
        startLatitude: "20.9674", // Static coordinates for now
        startLongitude: "89.5926", // Static coordinates for now
        ...params,
        endLongitude: params.endLongitude.toString(),
        endLatitude: params.endLatitude.toString(),
      })
      .returning();

    return insertedRoute;
  }

  static async getAllRoutes() {
    return await db.query.routeTable.findMany({
      columns: {
        assignmentId: false,
      },
      with: {
        assignment: {
          columns: { vehicleId: true, driverId: true },
          with: { vehicle: true, driver: true },
        },
      },
    });
  }

  static async getRouteById(id: string) {
    const route = await db.query.routeTable.findFirst({
      where: eq(routeTable.id, id),
      with: {
        assignment: {
          columns: { id: true },
          with: {
            vehicle: true,
            driver: true,
          },
        },
      },
    });

    return route;
  }

  static async updateRouteById(
    id: string,
    params: {
      assignmentId: string;
      endLongitude: string | number;
      endLatitude: string | number;
      name: string;
      driveDate: string;
      comments: string | null;
      success: boolean | null;
      problemDescription: string | null;
    },
  ) {
    const fieldsAreValid = RouteService.validateRouteFields(
      params.success,
      params.problemDescription,
    );
    const assignmentIsValid = await RouteService.validateAssignment(
      params.assignmentId,
    );
    const routeIsValid = await RouteService.validateVehicleNotOverlapping(
      params.driveDate,
      params.assignmentId,
      id,
    );

    if (!fieldsAreValid || !assignmentIsValid || !routeIsValid) {
      throw new InvalidRouteError();
    }

    const [updatedRoute] = await db
      .update(routeTable)
      .set({
        ...params,
        endLongitude: params.endLongitude.toString(),
        endLatitude: params.endLatitude.toString(),
      })
      .where(eq(routeTable.id, id))
      .returning();

    return updatedRoute;
  }

  static async deleteRouteById(id: string) {
    const [deletedRoute] = await db
      .delete(routeTable)
      .where(
        and(
          eq(routeTable.id, id),
          gt(routeTable.driveDate, new Date().toISOString()),
        ),
      )
      .returning({
        deletedId: routeTable.id,
      });

    if (!deletedRoute) {
      throw new CannotDeleteRouteError();
    }

    return deletedRoute.deletedId;
  }

  /*
   * Private validation methods
   */

  private static validateRouteFields(
    success: boolean | null,
    problemDescription: string | null,
  ): boolean {
    // Either success or problemDescription must be provided, but not both
    // If both are null, the route is considered valid.
    if (success === null && problemDescription === null) {
      return true; // Both are null, so the route is valid
    }

    if (success !== null && problemDescription !== null) {
      if (success === false) return true; // Both are provided, but success is false, which is valid
      return false; // Both are provided, which is invalid
    }

    if (success === null && problemDescription !== null) {
      return false; // Only problemDescription is provided, which is invalid
    }

    return true; // Only success is provided, which is valid
  }

  private static async validateAssignment(assignmentId: string) {
    const activeAssignment = await db.query.assignmentTable.findFirst({
      where: and(
        eq(assignmentTable.id, assignmentId),
        eq(assignmentTable.isActive, true),
      ),
    });
    return activeAssignment !== undefined;
  }

  private static async validateVehicleNotOverlapping(
    driveDate: string,
    assignmentId: string,
    routeId?: string,
  ) {
    // Ensure that the vehicle from the assignment is available

    const assignment = await db.query.assignmentTable.findFirst({
      where: eq(assignmentTable.id, assignmentId),
    });

    if (assignment === undefined) return false;

    const routeSameVehicleDate = await db.query.routeTable.findMany({
      where: and(
        eq(routeTable.driveDate, driveDate),
        routeId ? ne(routeTable.id, routeId) : undefined,
      ),
      columns: {
        id: true,
      },
      with: {
        assignment: {
          columns: { id: true, vehicleId: true, isActive: true },
        },
      },
    });

    const short = routeSameVehicleDate.some((route) => {
      if (route.assignment.vehicleId === assignment.vehicleId) return true;
    });

    return short === false;
  }
}
