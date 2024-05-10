import { assignmentTable } from "../../src/db/schema";

type AssignmentTable = typeof assignmentTable.$inferInsert;

export const assignments: AssignmentTable[] = [
  {
    id: "gracie_jetta",
    driverId: "gracie",
    vehicleId: "jetta",
  },
];
