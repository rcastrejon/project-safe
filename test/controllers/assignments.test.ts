import { treaty } from "@elysiajs/eden";
import { api as app } from "../../src/api";
import { describe, expect, it } from "bun:test";

const api = treaty(app);

describe("assignments controller", () => {
  let headers = {
    Authorization: "Bearer auth_session",
  };

  it("should get one assignment", async () => {
    const { data, status } = await api
      .assignments({
        id: "gracie_jetta",
      })
      .get({ headers });
    expect(status).toBe(200);
    expect(data?.id).toBe("gracie_jetta");
  });

  it("should get all assignments", async () => {
    const { data, status } = await api.assignments.index.get({ headers });
    expect(status).toBe(200);
    expect(data).toHaveProperty("items");
    expect(data?.items.length).toBe(1);
  });

  it("should delete one assignment", async () => {
    const { status } = await api
      .assignments({
        id: "gracie_jetta",
      })
      .delete(null, { headers });
    expect(status).toBe(200);

    const { data } = await api.assignments.index.get({ headers });
    expect(data).toHaveProperty("items");
    expect(data?.items.length).toBe(0);
  });
});
