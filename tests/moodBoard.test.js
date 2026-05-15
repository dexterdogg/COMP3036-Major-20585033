import {after, suite, test} from "node:test";
import assert from "node:assert";
import { app, runningServer } from "../app.js";
import request from "supertest";
import sql from "../config/db.js";
import { text } from "node:stream/consumers";

import jwt from "jsonwebtoken";

const JWT_SECRET = "dev-secret"; // or use process.env.JWT_SECRET if loaded
const testToken = jwt.sign({ sub: 12, role: "user" }, JWT_SECRET);

suite ("Mood Board Functionality", () => {
    suite ("Intergration - Mood Board", () => {
        // Testing for if the user tries to load the page without being logged in
        test("GET /moodTracker requires login", async () => {
            const res = await request(app).get('/moodTracker');
            assert.equal(res.status, 302);
        });

        // Testing for non authenticated POSTs
        test("POST /moodTracker returns 302 if not authenticated", async () => {
            const res = await request(app)
                .post('/moodTracker')
                .send('mood=sad&notes=Not logged in');
            assert.equal(res.status, 302);
        });

        // Tests a user sending a happy note while logged in
        test("POST /moodTracker saves mood with note", async () => {
            const res = await request(app)
                .post('/moodTracker')
                .set('Cookie', `auth=${testToken}`)
                .send('mood=happy&notes=Feeling great');
            assert.equal(res.status, 302);
        })

        test("POST /moodTracker returns 400 if mood is mission", async () => {
            const res = await request(app)
                .post('/moodTracker')
                .set('Cookie', `auth=${testToken}`)
                .send('notes=No mood');
            assert.equal(res.status, 400);
        });

        test("GET /moodTracker displays submitted mood entry", async () => {
            const mood = "angry";
            const notes = "Rough day";

            await request(app)
                .post('/moodTracker')
                .set('Cookie', `auth=${testToken}`)
                .type('form')
                .send({ mood, notes})
                .expect(302)

            const res = await request(app)
                .get('/moodTracker')
                .set('Cookie', `auth=${testToken}`)
                .expect(200);

            assert.match(res.text, new RegExp(`Mood:\\s*${mood}`, 'i'));
            assert.match(res.text, new RegExp(`Note:\\s*${notes}`, 'i'));
        });

    });


    after(async () => {
        await sql.end(); // Close the database connection
        await runningServer.close();
    });
});
