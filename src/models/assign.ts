import { Elysia, t } from "elysia";

export const assignModel = new Elysia({ name: "Model.Assign" }).model({
  "assign.create": t.Object({
    vehicleId: t.String({
      maxLength: 256,
    }),
    driverId: t.String({
      maxLength: 256,
    }),
    startDate: t.String({
      format: "date",
    }),
    endDate: t.String({
      format: "date",
    }),
    isActive: t.Boolean(),
  }),
  "assign.get": t.Object({
    id: t.String(),
  }),
});
