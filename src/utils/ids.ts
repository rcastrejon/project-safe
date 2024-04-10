import { generateId } from "lucia";

const prefixes = {
  user: "user",
  driver: "driver",
  invitation: "inv",
  vehicle: "veh",
  assignment: "assign",
  test: "test", // <-- for tests only
} as const;

export function newId(prefix: keyof typeof prefixes): string {
  return [prefixes[prefix], generateId(16)].join("_");
}
