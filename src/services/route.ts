import { and, eq, gt } from "drizzle-orm";
import { db } from "../db";
import { assignmentTable, routeTable } from "../db/schema";
import { newId } from "../utils/ids";

export class InvalidRouteError extends Error {
  constructor() {
    super(
      "Invalid route, please check the fields are correct and that the vehicle is not already assigned to a route.",
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
    startLatitude: string;
    startLongitude: string;
    endLongitude: string;
    endLatitude: string;
    name: string;
    driveDate: string;
    success: boolean | null;
    problemDescription: string | null;
    comments: string | null;
  }) {
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
    );

    if (!fieldsAreValid || !assignmentIsValid || !routeIsValid) {
      throw new InvalidRouteError();
    }

    const routeId = newId("route");
    const [insertedRoute] = await db
      .insert(routeTable)
      .values({
        id: routeId,
        ...params,
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
      startLatitude: string;
      startLongitude: string;
      endLongitude: string;
      endLatitude: string;
      name: string;
      driveDate: string;
      success: boolean | null;
      problemDescription: string | null;
      comments: string | null;
    },
  ) {
    const fieldsAreValid = RouteService.validateRouteFields(
      params.success,
      params.problemDescription,
    );
    const assignmentIsValid = await RouteService.validateAssignment(
      params.assignmentId,
    );

    const previousRoute = await db.query.routeTable.findFirst({
      where: eq(routeTable.id, id),
      with: {
        assignment: {
          columns: { id: true },
        },
      },
    });
    //if the assignment is the same, we don't need to check for overlapping
    const incomingAssignmentIsSame = previousRoute?.assignment.id === params.assignmentId;
    
    let routeIsValid = true;
    if(!incomingAssignmentIsSame) routeIsValid = await RouteService.validateVehicleNotOverlapping(params.driveDate, params.assignmentId);        
    
    if (!fieldsAreValid || !assignmentIsValid || !routeIsValid) {
      throw new InvalidRouteError();
    }
    
    const [updatedRoute] = await db
      .update(routeTable)
      .set(params)
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
  ) {
    // Either success or problemDescription must be provided
    const problemDescriptionIsEmpty = problemDescription === "" || problemDescription === null;
    const problemDescriptionIsNotEmpty = problemDescription !== "" && problemDescription !== null;

    if (success === null || success === true) return true;
    if (success === false && problemDescriptionIsNotEmpty) return true;
    return false;
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
  ) {
    // Ensure that the vehicle from the assignment is available

    const assignment = await db.query.assignmentTable.findFirst({
      where: eq(assignmentTable.id, assignmentId),
    });

    if (assignment === undefined) return false;

    const routeSameVehicleDate = await db.query.routeTable.findMany({
      where: eq(routeTable.driveDate, driveDate),
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
