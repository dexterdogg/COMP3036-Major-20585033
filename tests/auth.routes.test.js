import test, { after, suite } from "node:test";
import assert from "node:assert";
import request from "supertest";
import { app, runningServer } from "../app.js";
import sql from "../config/db.js";


suite ("Login Functionality", () => {
  test("GET /login returns 200", async () => {
    const res = await request(app).get("/login");
    assert.equal(res.status, 200);
  });

  // Invalid login should return 401
  test("POST /login invalid -> 401", async () => {
    const res = await request(app)
      .post("/login")
      .type("form")
      .send({ email: "x@example.edu", password: "nope" });
    assert.equal(res.status, 401);
  });

  // Valid login should set auth cookie and redirect to /profile
  test("POST /login valid -> sets cookie + redirects", async () => {
    const res = await request(app)
      .post("/login")
      .type("form")
      .send({ email: "student1@example.edu", password: "Stud123" });
    assert.equal(res.status, 302);
    assert.ok((res.headers["set-cookie"] || []).join(";").includes("auth="));
  });

  // Accessing /profile with valid cookie should return 200
  test("GET /profile without cookie -> 302 /login", async () => {
    const res = await request(app).get("/profile");
    assert.equal(res.status, 302);
    assert.match(res.headers.location, /\/login$/);
  });

  after(async () => {
    await sql.end();
    await runningServer.close();
  });
});

