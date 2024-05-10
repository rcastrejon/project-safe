import { treaty } from "@elysiajs/eden";
import { api as app } from "../../src/api";
import { describe, expect, it } from "bun:test";

const api = treaty(app);

describe("invitations controller", () => {
  let headers = {
    Authorization: "Bearer auth_session",
  };

  it("should create new invitation", async () => {
    const { data, status } = await api.invitations.index.post(null, {
      headers,
    });
    expect(status).toBe(200);
    expect(data).toHaveProperty("invitation");
  });

  it("should get all invitations", async () => {
    const { data, status } = await api.invitations.index.get({
      headers,
    });
    expect(status).toBe(200);
    expect(data).toHaveProperty("items");
    expect(data?.items.length).toBe(1);
  });

  it("should get one invitation", async () => {
    const { data, status } = await api
      .invitations({
        id: "valid_invitation",
      })
      .get({
        headers,
      });
    expect(status).toBe(200);
    expect(data?.id).toBe("valid_invitation");
  });

  it("should delete one invitation", async () => {
    const { data, status } = await api
      .invitations({
        id: "valid_invitation",
      })
      .delete(null, {
        headers,
      });
    expect(status).toBe(200);
    expect(data).toHaveProperty("id");
  });
});
