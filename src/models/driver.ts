import { Elysia, t } from "elysia";

export const driverModel = new Elysia({ name: "Model.Driver" }).model({
  "driver.create": t.Object({
    name: t.String({
      maxLength: 256,
    }),
    birthDate: t.String({
      format: "date",
    }),
    curp: t.String({
      minLength: 18,
      maxLength: 18,
    }),
    address: t.String({
      maxLength: 256,
    }),
    monthlySalary: t.Number(),
    licenseNumber: t.String({
      maxLength: 256,
    }),
    registrationDate: t.String({
      format: "date",
    }),
  }),
  "driver.get": t.Object({
    id: t.String(),
  }),
});
