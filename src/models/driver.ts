import { Elysia, t } from "elysia";

export const driverModel = new Elysia({ name: "Model.Driver" }).model({
  "driver.create": t.Object({
    name: t.String(),
    birthDate: t.String({
      format: "date",
    }),
    curp: t.String({
      minLength: 18,
      maxLength: 18,
    }),
    address: t.String(),
    monthlySalary: t.Integer(),
    licenseNumber: t.String(),
  }),
  "driver.get": t.Object({
    id: t.String(),
  }),
});
