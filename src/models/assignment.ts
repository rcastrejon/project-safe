import { Elysia, t } from "elysia";

export const assignModel = new Elysia({ name: "Model.Assignment" }).model({
  "assignment.create": t.Object({
    vehicleId: t.String(),
    driverId: t.String(),
  }),
  "assignment.get": t.Object({
    id: t.String(),
  }),
  "assignment.update": t.Object({
    vehicleId: t.String(),
    driverId: t.String(),
  }),
});
