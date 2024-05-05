import { invitationTable } from "../../src/db/schema";

type InvitationInsert = typeof invitationTable.$inferInsert;

export const invitations: InvitationInsert[] = [
  {
    id: "valid_invitation",
    userId: "john",
  },
];
