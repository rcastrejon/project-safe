import { driverTable } from "../../src/db/schema";

type DriverTable = typeof driverTable.$inferInsert;

export const drivers: DriverTable[] = [
  {
    id: "gracie",
    name: "Gracie Choi",
    birthDate: "1990-01-01",
    curp: "0123456789ABCDEFGH",
    address: "New Address",
    monthlySalary: 10000,
    licenseNumber: "GCHOI90",
  },
];
