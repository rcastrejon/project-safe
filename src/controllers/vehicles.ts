import { Elysia } from "elysia";

import { vehicleModel } from "../models/vehicle";
import { authService } from "../services/auth";
import {
  FileUploadError,
  InvalidVehicleError,
  VehicleNotFoundError,
  VehicleService,
} from "../services/vehicle";

export const vehiclesController = new Elysia({ prefix: "/vehicles" })
  .use(authService)
  .use(vehicleModel)
  // POST /vehicles
  .post(
    "/",
    async ({ user, body, error }) => {
      if (!user) return error(401, { error: "Unauthorized" });

      try {
        const vehicle = await VehicleService.createVehicle(body);
        return { vehicle };
      } catch (e) {
        if (e instanceof InvalidVehicleError) {
          return error(400, { error: e.message });
        }
        if (e instanceof FileUploadError) {
          return error(500, { error: e.message });
        }
        throw e;
      }
    },
    {
      type: "multipart/form-data",
      body: "vehicle.create",
      transform({ body }) {
        body.vin = body.vin?.toUpperCase();
        body.licensePlate = body.licensePlate?.toLocaleUpperCase();
      },
    },
  )
  // GET /vehicles
  .get("/", async ({ user, error }) => {
    if (!user) return error(401, { error: "Unauthorized" });

    const vehicles = await VehicleService.getAllVehicles();
    return { items: vehicles };
  })
  // GET /vehicles/:id
  .get(
    "/:id",
    async ({ user, params: { id }, error }) => {
      if (!user) return error(401, { error: "Unauthorized" });

      const vehicle = await VehicleService.getVehicleById(id);
      if (!vehicle) return error(404, { error: "Vehicle not found" });
      return vehicle;
    },
    {
      params: "vehicle.get",
    },
  )
  .put(
    "/:id",
    async ({ user, params: { id }, body, error }) => {
      if (!user) return error(401, { error: "Unauthorized" });

      try {
        const vehicle = await VehicleService.updateVehicleById(id, body);
        return { vehicle };
      } catch (e) {
        if (e instanceof InvalidVehicleError) {
          return error(400, { error: e.message });
        }
        if (e instanceof VehicleNotFoundError) {
          return error(404, { error: e.message });
        }
        throw e;
      }
    },
    {
      body: "vehicle.update",
      params: "vehicle.get",
      transform({ body }) {
        body.vin = body.vin?.toUpperCase();
        body.licensePlate = body.licensePlate?.toLocaleUpperCase();
      },
    },
  )
  // DELETE /vehicles/:id
  .delete(
    "/:id",
    async ({ user, params: { id }, error }) => {
      if (!user) return error(401, { error: "Unauthorized" });

      try {
        const deletedId = await VehicleService.deleteVehicleById(id);
        return { id: deletedId };
      } catch (e) {
        if (e instanceof VehicleNotFoundError) {
          return error(404, { error: e.message });
        }
        throw e;
      }
    },
    {
      params: "vehicle.get",
    },
  );
