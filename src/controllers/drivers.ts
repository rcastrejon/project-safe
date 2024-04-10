import { Elysia } from "elysia";

import { driverModel } from "../models/driver";
import { authService } from "../services/auth";
import {
  DriverNotFoundError,
  DriverService,
  InvalidDriverError,
} from "../services/driver";

export const driversController = new Elysia({ prefix: "/drivers" })
  .use(authService)
  .use(driverModel)
  .post(
    "/",
    async ({ user, body, error }) => {
      if (!user) return error(401, { error: "Unauthorized" });

      try {
        const driver = await DriverService.createDriver(body);
        return { driver };
      } catch (e) {
        if (e instanceof InvalidDriverError) {
          return error(400, { error: e.message });
        }
      }
    },
    {
      body: "driver.create",
      transform({ body }) {
        body.curp = body.curp?.toUpperCase();
        body.licenseNumber = body.licenseNumber?.toUpperCase();
      },
    },
  )
  .get("/", async ({ user, error }) => {
    if (!user) return error(401, { error: "Unauthorized" });

    const drivers = await DriverService.getAllDrivers();
    return { items: drivers };
  })
  .get(
    "/:id",
    async ({ user, params: { id }, error }) => {
      if (!user) return error(401, { error: "Unauthorized" });

      const driver = await DriverService.getDriverById(id);
      if (!driver) return error(404, { error: "Driver not found" });
      return { driver };
    },
    {
      params: "driver.get",
    },
  )
  .delete(
    "/:id",
    async ({ user, params: { id }, error }) => {
      if (!user) return error(401, { error: "Unauthorized" });

      try {
        const deletedId = await DriverService.deleteDriverById(id);
        return { id: deletedId };
      } catch (e) {
        if (e instanceof DriverNotFoundError) {
          return error(404, { error: "Driver not found" });
        }
      }
    },
    {
      params: "driver.get",
    },
  );
