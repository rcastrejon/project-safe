import { Elysia } from "elysia";

import { driverModel } from "../models/driver";
import { DriverService } from "../services/driverManagement";

export const driversController = new Elysia({ prefix: "/drivers" })
  .use(driverModel)
  .post(
    "/",
    async ({ body: { name, birthDate, curp, address, monthlySalary, licenseNumber, registrationDate }, error }) => {
      const { driver, error: err } = await DriverService.createDriver(
        name, birthDate, curp, address, monthlySalary, licenseNumber, registrationDate
      );
      if (err) return error(400, { error: err });
      return { driver };
    },
    {
      body: "driver.create", 
    },
  )
  .get("/", async () => {
    const drivers = await DriverService.getAllDrivers();
    return { items: drivers };
  })
  .get(
    "/:id",
    async ({ params: { id }, error }) => {
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
    async ({ params: { id }, error }) => {
      const deletedDriver = await DriverService.deleteDriverById(id);
      if (!deletedDriver) return error(404, { error: "Driver not found" });
      return { id: deletedDriver.id };
    },
    {
      params: "driver.get", 
    },
  );

