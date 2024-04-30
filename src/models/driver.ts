import { Elysia, t } from "elysia";

export const driverModel = new Elysia({ name: "Model.Driver" }).model({
  "driver.create": t.Object({
    name: t.String(),
    birthDate: t.String({
      format: "date",
      error: "Birth date must be a valid date",
    }),
    curp: t.String({
      minLength: 18,
      maxLength: 18,
      error: "CURP must be 18 characters long",
    }),
    address: t.String(),
    monthlySalary: t.Numeric(),
    licenseNumber: t.String(),
  }),
  "driver.get": t.Object({
    id: t.String(),
  }),
});
