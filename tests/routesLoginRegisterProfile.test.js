import { after, suite, test } from "node:test";
import assert from "node:assert";
import request from "supertest";
import jwt from "jsonwebtoken";
import { app, runningServer } from "../app.js";
import sql from "../config/db.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

// Integration tests for authentication and profile routes
suite("Auth & Profile Flow (Integration)", () => {
    // Login routes
    suite("Login routes (/login)", () => {
        test("GET /login -> 200 renders page", async () => {
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
        test("POST /login valid -> sets cookie + redirects to /profile", async () => {
            const agent = request.agent(app);
            const res = await agent
                .post("/login")
                .type("form")
                .send({ email: "student1@example.edu", password: "Stud123" });

            assert.equal(res.status, 302);
            assert.match(res.headers.location, /\/profile$/);
            assert.ok((res.headers["set-cookie"] || []).join(";").includes("auth="));

            // Then /profile should be 200 using cookie
            const prof = await agent.get("/profile");
            assert.equal(prof.status, 200);
        });
    });

    // Register routes
    suite("Register routes (/register)", () => {
        test("GET /register -> 200 renders page", async () => {
            const res = await request(app).get("/register");
            assert.equal(res.status, 200);
        });

        // Missing email should return 400
        test("POST /register missing email -> 400", async () => {
            const res = await request(app)
                .post("/register")
                .type("form")
                .send({ firstName: "A", lastName: "B", password: "Password!1" });
            assert.equal(res.status, 400);
        });

        // Short password should return 400
        test("POST /register short password -> 400", async () => {
            const res = await request(app)
                .post("/register")
                .type("form")
                .send({
                    firstName: "A",
                    lastName: "B",
                    email: `short-${Date.now()}@example.edu`,
                    password: "short",
                });
            assert.equal(res.status, 400);
        });

        // Successful registration should set auth cookie and redirect to /profile
        test("POST /register success -> cookie + redirect + /profile 200", async () => {
            const agent = request.agent(app);
            const email = `u${Date.now()}@example.edu`;

            const reg = await agent
                .post("/register")
                .type("form")
                .send({
                    firstName: "Test",
                    lastName: "User",
                    email,
                    password: "Password!1",
                    role: "Student",
                });

            assert.equal(reg.status, 302);
            assert.match(reg.headers.location, /\/profile$/);
            assert.ok((reg.headers["set-cookie"] || []).join(";").includes("auth="));

            const prof = await agent.get("/profile");
            assert.equal(prof.status, 200);
        });

        // Duplicate email should return 409
        test("POST /register duplicate email -> 409", async () => {
            const email = `dupe-${Date.now()}@example.edu`;

            const first = await request(app)
                .post("/register")
                .type("form")
                .send({
                    firstName: "A",
                    lastName: "B",
                    email,
                    password: "Password!1",
                    role: "Student",
                });
            assert.equal(first.status, 302);

            const second = await request(app)
                .post("/register")
                .type("form")
                .send({
                    firstName: "A",
                    lastName: "B",
                    email,
                    password: "Password!1",
                });
            assert.equal(second.status, 409);
        });
    });

    // Profile route with auth middleware
    suite("Profile route (/profile) with middleware", () => {

        // Without cookie should redirect to /login
        test("GET /profile without cookie -> 302 /login", async () => {
            const res = await request(app).get("/profile");
            assert.equal(res.status, 302);
            assert.match(res.headers.location, /\/login$/);
        });

        // Invalid JWT should redirect to /login
        test("GET /profile with invalid JWT -> 302 /login", async () => {
            const res = await request(app)
                .get("/profile")
                .set("Cookie", ["auth=not.a.valid.jwt"]);
            assert.equal(res.status, 302);
            assert.match(res.headers.location, /\/login$/);
        });

        // Valid JWT for non-existent user should redirect to /login
        test("GET /profile with valid JWT for non-existent user -> 302 /login", async () => {
            const token = jwt.sign({ sub: -1, role: "Student" }, JWT_SECRET, {
                expiresIn: "10m",
            });
            const res = await request(app)
                .get("/profile")
                .set("Cookie", [`auth=${token}`]);
            assert.equal(res.status, 302);
            assert.match(res.headers.location, /\/login$/);
        });
    });

    // Home route
    suite("Home route (/)", () => {
        test("GET / (home) -> 200", async () => {
            const res = await request(app).get("/");
            assert.equal(res.status, 200);
        });
    });

    after(async () => {
        await sql.end(); // Close the database connection
        await runningServer.close();
    });
});
