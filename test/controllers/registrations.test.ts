import { treaty } from "@elysiajs/eden";
import { api as app } from "../../src/api";
import { describe, expect, it } from "bun:test";

const api = treaty(app);

describe("registrations controller", () => {
  const newUser = {
    email: "new@nancy.com",
    password: "secure_password",
    invitation: "valid_invitation",
  };

  it("should register a new user", async () => {
    const { data, status } = await api["sign-up"].post({
      email: newUser.email,
      password: newUser.password,
      invitation: newUser.invitation,
    });
    expect(status).toBe(200);
    expect(data).toHaveProperty("session");
  });
});
