import { treaty } from "@elysiajs/eden";
import { api as app } from "../../src/api";
import { describe, expect, it } from "bun:test";

const api = treaty(app);

describe("users controller", () => {
  let headers = {
    Authorization: "Bearer auth_session",
  };

  it("should get all users", async () => {
    const { data, status } = await api.users.index.get({ headers });
    expect(status).toBe(200);
    expect(data).toHaveProperty("items");
    expect(data?.items.length).toBe(2);
  });

  it("should get one user", async () => {
    const { data, status } = await api
      .users({
        id: "john",
      })
      .get({ headers });
    expect(status).toBe(200);
    expect(data?.id).toBe("john");
  });
});
