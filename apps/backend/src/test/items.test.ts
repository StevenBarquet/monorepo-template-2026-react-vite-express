import request from "supertest";
import { describe, expect, it } from "vitest";

import { app } from "../app/express-app";

describe("POST /api/v1/items", () => {
  it("returns 400 when name is missing from body", async () => {
    const res = await request(app)
      .post("/api/v1/items")
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("name is required");
  });

  it("returns the created item when name is provided", async () => {
    const res = await request(app)
      .post("/api/v1/items")
      .send({ name: "Test item" });

    expect(res.status).toBe(201);
    expect(res.body.item.name).toBe("Test item");
    expect(res.body.item.id).toBeDefined();
    expect(res.body.existing).toHaveLength(2);
  });
});
