import { Elysia } from "elysia";

import { assignModel } from "../models/assignment";
import {
  AssignmentNotFoundError,
  AssignmentService,
  InvalidAssignmentError,
} from "../services/assignment";
import { authService } from "../services/auth";

export const assignmentsController = new Elysia({ prefix: "/assignments" })
  .use(authService)
  .use(assignModel)
  .post(
    "/",
    async ({ user, body, error }) => {
      if (!user) return error(401, { error: "Unauthorized" });

      try {
        const assignment = await AssignmentService.createAssignment(body);
        return { assignment };
      } catch (e) {
        if (e instanceof InvalidAssignmentError) {
          return error(400, { error: e.message });
        }
        throw e;
      }
    },
    {
      body: "assignment.create",
    },
  )
  .get("/", async ({ user, error }) => {
    if (!user) return error(401, { error: "Unauthorized" });

    const assignments = await AssignmentService.getAllAssignments();
    return { items: assignments };
  })
  .get(
    "/:id",
    async ({ user, params: { id }, error }) => {
      if (!user) return error(401, { error: "Unauthorized" });

      const assignment = await AssignmentService.getAssignmentById(id);
      if (!assignment) return error(404, { error: "Assignment not found" });
      return assignment;
    },
    {
      params: "assignment.get",
    },
  )
  .put(
    "/:id",
    async ({ user, params: { id }, body, error }) => {
      if (!user) return error(401, { error: "Unauthorized" });

      try {
        const assignment = await AssignmentService.updateAssignment({
          id,
          ...body,
        });
        return { assignment };
      } catch (e) {
        if (e instanceof InvalidAssignmentError) {
          return error(400, { error: e.message });
        }
        if (e instanceof AssignmentNotFoundError) {
          return error(404, { error: e.message });
        }
      }
    },
    {
      body: "assignment.create",
      params: "assignment.get",
    },
  )
  .delete(
    "/:id",
    async ({ user, params: { id }, error }) => {
      if (!user) return error(401, { error: "Unauthorized" });

      try {
        const assignment = await AssignmentService.deleteAssignment(id);
        return { assignment };
      } catch (e) {
        if (e instanceof AssignmentNotFoundError) {
          return error(404, { error: e.message });
        }
      }
    },
    {
      params: "assignment.get",
    },
  );
