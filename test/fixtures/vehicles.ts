import { vehicleTable } from "../../src/db/schema";

type VehicleTable = typeof vehicleTable.$inferInsert;

export const vehicles: VehicleTable[] = [
  {
    id: "jetta",
    make: "VW",
    model: "Jetta",
    vin: "3VW2K7AJ4EM388374",
    licensePlate: "ABC123",
    purchaseDate: "2021-01-01",
    cost: 20000,
    photoUrl: "example.com",
  },
];
