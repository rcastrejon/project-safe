import { Elysia } from "elysia";

import { assignModel } from "../models/assign";
import { AssignService } from "../services/assign";

export const assignController = new Elysia({ prefix: "/assign" })
  .use(assignModel)
  .post(
    "/",
    async ({
      body: { vehicleId, driverId, startDate, endDate, isActive },
      error,
    }) => {
      const result = await AssignService.createAssign(
        vehicleId,
        driverId,
        startDate,
        endDate,
        isActive,
      );
      const assign = "assign" in result ? result.assign : null;
      const err = "error" in result ? result.error : null;
      if (err) return error(400, { error: err });
      if (!assign) return error(404, { error: "Assign not found" });
      return { assign };
    },
    {
      body: "assign.create",
    },
  )
  .get("/", async () => {
    const assigns = await AssignService.getAllAssigns();
    return { assigns };
  })
  .get(
    "/:id",
    async ({ params: { id }, error }) => {
      const assign = await AssignService.getAssignById(id);
      if (!assign) return error(404, { error: "Assign not found" });
      return { assign };
    },
    {
      params: "assign.get",
    },
  )
  .put(
    "/:id",
    async ({
      params: { id },
      body: { vehicleId, driverId, startDate, endDate, isActive },
      error,
    }) => {
      const result = await AssignService.updateAssign(
        id,
        vehicleId,
        driverId,
        startDate,
        endDate,
        isActive,
      );
      const assign = "assign" in result ? result.assign : null;
      const err = "error" in result ? result.error : null;
      if (err) return error(400, { error: err });
      if (!assign) return error(404, { error: "Assign not found" });
      return { assign };
    },
    {
      body: "assign.create",
      params: "assign.get",
    },
  );
