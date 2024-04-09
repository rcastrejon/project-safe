import { Elysia } from "elysia";

import { vehicleModel } from "../models/vehicle";
import { VehicleService } from "../services/vehicleOperation";

export const vehiclesController = new Elysia({ prefix: "/vehicles" })
  .use(vehicleModel)
  .post(
    "/",
    async ({ body: {
      brand,
      model,
      vin,
      licensePlate,
      purchaseDate,
      cost,
      registrationDate
    }, error }) => {

      const { vehicle, error: err } = await VehicleService.createVehicle(
        brand,
        model,
        vin,
        licensePlate,
        purchaseDate,
        cost,
        registrationDate
      );

      if (err) return error(400, { error: err });
      return { vehicle }
    },
    {
      body: "vehicle.create",
    },
  )
  .get(
    "/",
    async () => {
        const vehicles = await VehicleService.getAllVehicles();
        return {items: vehicles};
    }
  )
  .get(
    "/:id",
    async ({params: { id }, error}) => {
        const vehicle = await VehicleService.getVehicleById(id);
        if (!vehicle) return error(404, { error: "Vehicle not found" });
        return { vehicle };
    },
    {
        params: "vehicle.get",
    },
  )
  .delete(
    "/:id",
    async ({params: {id}, error}) => {
        const deletedVehicle = await VehicleService.deleteVehicleById(id);
        if (!deletedVehicle) return error(404, {error: "Vehicle cannot be deleted, not found"});
        return { id: deletedVehicle.id};
    },
    {
        params: "vehicle.get",
    }
  );
