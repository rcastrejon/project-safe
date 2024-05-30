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
  // POST /drivers
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
        throw e;
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
  // GET /drivers
  .get("/", async ({ user, error }) => {
    if (!user) return error(401, { error: "Unauthorized" });

    const drivers = await DriverService.getAllDrivers();
    return { items: drivers };
  })
  // GET /drivers/:id
  .get(
    "/:id",
    async ({ user, params: { id }, error }) => {
      if (!user) return error(401, { error: "Unauthorized" });

      const driver = await DriverService.getDriverById(id);
      if (!driver) return error(404, { error: "Driver not found" });
      return driver;
    },
    {
      params: "driver.get",
    },
  )
  // PUT /drivers/:id
  .put(
    "/:id",
    async ({ user, params: { id }, body, error }) => {
      if (!user) return error(401, { error: "Unauthorized" });

      try {
        const driver = await DriverService.updateDriverById(id, body);
        return { driver };
      } catch (e) {
        if (e instanceof InvalidDriverError) {
          return error(400, { error: e.message });
        }
        if (e instanceof DriverNotFoundError) {
          return error(404, { error: e.message });
        }
        throw e;
      }
    },
    {
      body: "driver.create",
      params: "driver.get",
      transform({ body }) {
        body.curp = body.curp?.toUpperCase();
        body.licenseNumber = body.licenseNumber?.toUpperCase();
      },
    },
  )
  // DELETE /drivers/:id
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
        throw e;
      }
    },
    {
      params: "driver.get",
    },
  );
