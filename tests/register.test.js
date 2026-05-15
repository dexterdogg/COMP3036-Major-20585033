import {after, suite, test} from "node:test";
import assert from "node:assert";
import { app, runningServer } from "../app.js";
import request from "supertest";
import sql from "../config/db.js";
import { text } from "node:stream/consumers";


// Tests for registration functionality
suite("register Functionality", () => {

    // Test GET /register renders registration page
    test("GET /register renders registration page", async () => {
        const res = await request(app).get("/register");
        assert.equal(res.statusCode, 200);
        assert.match(res.text, /Create Account/i);
    });


    // Test POST /register with missing fields
    test("POST /register fails with missing fields", async () => {
        const res = await request(app)
            .post("/register")
            .type("form")
            .send({ email: "", password: "" });

        assert.equal(res.statusCode, 400);
        assert.match(res.text, /required/i);
    });


    // Test POST /register with short password
    test("POST /register creates new account", async () => {
        const email = `testuser_${Date.now()}@example.edu`;
        const res = await request(app)
            .post("/register")
            .type("form")
            .send({
                firstName: "Test",
                lastName: "User",
                email,
                password: "StrongPass1!",
                role: "Student"
            })
            .redirects(0);

        assert.equal(res.statusCode, 302);
        assert.equal(res.headers.location, "/profile");
        assert.ok(res.headers["set-cookie"].join("").includes("auth="));
    });

    after(async () => {
        await sql.end(); // Close the database connection
        await runningServer.close();
    });
});