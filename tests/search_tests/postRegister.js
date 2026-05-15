import sql from "../../config/db.js";

import { after, before, beforeEach, suite, test } from "node:test";
import assert from "node:assert";
import { app } from "../../app.js";
import request from "supertest";
import { get } from "node:http";
import { addParticipant, getParticipantCount } from "../../models/eventModels.js";
import jwt from "jsonwebtoken";



export async function testEventRegister(){
    suite("Integration Test: Registration of a user (POST register/:id)", () => {

        const event_ID = 555666777;
        const user_ID = 444333222;
        //Generate JWT token for simulate logged in authentication
        const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
        const token = jwt.sign({ sub: user_ID, role: "student" }, JWT_SECRET);

        //Use fake event to participate in
        before(async () => {
            await sql`INSERT INTO events (id, name, description, start_time, end_time, location, category) VALUES (${event_ID}, 'Event 1', 'Description 1', '2025-12-31 10:00:00', '2025-12-31 12:00:00', 'Location 1', 'social');`;
            await sql`INSERT INTO users (id, email, password_hash, role, first_name, last_name) VALUES (${user_ID}, 'Test@example.edu', crypt('Test', gen_salt('bf', 12)), 'Test', 'Test', 'Test');`;

        });
        //BugFix: ensure each test starts with no participation record 
        beforeEach(async () => {
            await sql`DELETE FROM event_users WHERE event_id = ${event_ID};`;
        });

        test("Registration should succeed for valid user", async () => {
            const initialCount = parseInt(await getParticipantCount(event_ID));
            const response = await request(app)
                .post(`/search/register/${event_ID}`)
                .set("Cookie", `auth=${token}`)
                .send({ userId: user_ID })
                .expect(200);
                
            //Check response
            assert.strictEqual(response.body.status, "success");
            assert.strictEqual(response.body.message, "Successfully registered for the event!");

            //Check participant count increased by 1
            const finalCount = parseInt(await getParticipantCount(event_ID));
            assert.strictEqual(finalCount, initialCount + 1);
        });

        //Negatives
        
        test("Registration should fail for already registered user", async () => {
            // First, register the user
            await addParticipant(event_ID, user_ID);
            const initialCount = parseInt(await getParticipantCount(event_ID));

            // Attempt to register again
            const response = await request(app)
                .post(`/search/register/${event_ID}`)
                .set("Cookie", `auth=${token}`)
                .send({ userId: user_ID })
                .expect(200);
                
            //Check respose messages
            assert.strictEqual(response.body.status, "exists");
            assert.strictEqual(response.body.message, "Already registered for this event.");

            //Check participant count remains the same
            const finalCount = parseInt(await getParticipantCount(event_ID));
            assert.strictEqual(finalCount, initialCount);
        });

        test("Registration should fail for unauthenticated user", async () => {
            const response = await request(app)
                .post(`/search/register/${event_ID}`)
                .send({ userId: user_ID })
                .expect(302); // Expect redirect to /login

            assert.equal(response.status, 302);
            assert.match(response.headers.location, /\/login$/);
        });


        //Clean up fake event and users
        after(async () => {
            await sql`DELETE FROM events WHERE id = ${event_ID};`;
            await sql`DELETE FROM event_users WHERE event_id = ${event_ID};`;
            await sql`DELETE FROM users WHERE id = ${user_ID};`;
        });
    });
}