import { Elysia, t } from "elysia";

export const vehicleModel = new Elysia({ name: "Model.Vehicle" }).model({
  "vehicle.create": t.Object({
    make: t.String(),
    model: t.String(),
    vin: t.String(),
    licensePlate: t.String(),
    purchaseDate: t.String({
      format: "date",
    }),
    cost: t.Integer(),
  }),
  "vehicle.get": t.Object({
    id: t.String(),
  }),
});
