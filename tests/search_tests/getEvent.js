import sql from "../../config/db.js";

import { suite, test } from "node:test";
import assert from "node:assert";
import { app } from "../../app.js";
import request from "supertest";


export async function testGetEvent() {
    suite("Unit Test: getEvent(), a JSON fetch", () => {
        test("getEvent() retrieves correct event from database", async () => {
            //Insert a mock event to the actual DB
            const [mockEvent] = await sql`
                INSERT INTO events (name, description, start_time, end_time, location, category)
                VALUES ('Test Event', 'This is a test event', '2025-12-01 10:00:00', '2025-12-01 12:00:00', 'Test Location', 'test')
                RETURNING *;
            `;

            //Fetch the event via the route
            const res = await request(app)
                .get(`/search/${mockEvent.id}`)
                .expect(200);
            
            //Check if returned JSON matches mock event
            assert.equal(res.body.id, mockEvent.id);
            assert.equal(res.body.name, mockEvent.name);
            assert.equal(res.body.description, mockEvent.description);
            //Ignoring Date because the JSON parses the timestamp into a readable date format + validity increase is illegible
            assert.equal(res.body.location, mockEvent.location);
            assert.equal(res.body.category, mockEvent.category);

            //Clean up - delete the mock event
            await sql`DELETE FROM events WHERE id = ${mockEvent.id}`;
        });

        //Negatives
        test("getEvent() returns 404 for non-existent ID passed", async () => {
            const res = await request(app)
                .get('/search/99999') //Bad ID
                .expect(404);
            assert.equal(res.body.error, "Event not found");
        });
        test("getEvent() returns 404 for incorrect data type ID passed", async () => {
            const res = await request(app)
                .get('/search/ThisAintEvenAnID') //Bad ID
                .expect(404);
            assert.equal(res.body.error, "Event not found");
        });
    });
}