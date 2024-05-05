import { treaty } from "@elysiajs/eden";
import { api as app } from "../../src/api";
import { describe, expect, it } from "bun:test";

const api = treaty(app);

describe("sessions controller", () => {
  it("should login created user", async () => {
    const { data, status } = await api["sign-in"].post({
      email: "john@doe.com",
      password: "password",
    });
    expect(status).toBe(200);
    expect(data).toHaveProperty("session");
  });

  it("should logout user", async () => {
    const { data } = await api["sign-in"].post({
      email: "john@doe.com",
      password: "password",
    });

    const { status } = await api.logout.post(null, {
      headers: {
        Authorization: `Bearer ${data?.session.id}`,
      },
    });
    expect(status).toBe(200);
  });
});
