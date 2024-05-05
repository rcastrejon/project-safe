import { treaty } from "@elysiajs/eden";
import { api as app } from "../../src/api";
import { describe, expect, it } from "bun:test";

const api = treaty(app);

describe("vehicles controller", () => {
  let headers = {
    Authorization: "Bearer auth_session",
  };

  it("should get one vehicle", async () => {
    const { data, status } = await api
      .vehicles({
        id: "jetta",
      })
      .get({ headers });
    expect(status).toBe(200);
    expect(data).toHaveProperty("vehicle");
  });

  it("should get all vehicles", async () => {
    const { data, status } = await api.vehicles.index.get({ headers });
    expect(status).toBe(200);
    expect(data).toHaveProperty("items");
    expect(data?.items.length).toBe(1);
  });

  it("should delete one vehicle", async () => {
    const { status } = await api
      .vehicles({
        id: "jetta",
      })
      .delete(null, { headers });
    expect(status).toBe(200);

    const { data } = await api.vehicles.index.get({ headers });
    expect(data).toHaveProperty("items");
    expect(data?.items.length).toBe(0);
  });
});
