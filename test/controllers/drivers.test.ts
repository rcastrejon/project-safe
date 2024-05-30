import { treaty } from "@elysiajs/eden";
import { api as app } from "../../src/api";
import { describe, expect, it } from "bun:test";

const api = treaty(app);

describe("drivers controller", () => {
  let headers = {
    Authorization: "Bearer auth_session",
  };
  const newUser = {
    name: "New Nancy",
    birthDate: "1990-01-01",
    curp: "CURP12345678901234",
    address: "New Address",
    monthlySalary: 10000,
    licenseNumber: "LICENSE123456",
  };

  it("create new driver", async () => {
    const { data, status } = await api.drivers.index.post(newUser, {
      headers,
    });
    expect(status).toBe(200);
    expect(data).toHaveProperty("driver");
  });

  it("should get one driver", async () => {
    const { data, status } = await api
      .drivers({
        id: "gracie",
      })
      .get({ headers });
    expect(status).toBe(200);
    expect(data?.name).toBe("Gracie Choi");
  });

  it("should get all drivers", async () => {
    const { data, status } = await api.drivers.index.get({ headers });
    expect(status).toBe(200);
    expect(data?.items.length).toBe(1);
  });

  // it("should delete driver", async () => {
  //   const { status } = await api
  //     .drivers({
  //       id: "gracie",
  //     })
  //     .delete(null, { headers });
  //   expect(status).toBe(200);

  //   const { data } = await api.drivers.index.get({ headers });
  //   expect(data?.items.length).toBe(0);
  // });

  it("should update driver", async () => {
    const { status } = await api
      .drivers({
        id: "gracie",
      })
      .put(newUser, { headers });
    expect(status).toBe(200);

    const { data } = await api
      .drivers({
        id: "gracie",
      })
      .get({ headers });
    expect(data?.name).toBe("New Nancy");
  });
});
