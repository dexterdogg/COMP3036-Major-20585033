import { getEventById } from "../../models/eventModels.js";
import sql from "../../config/db.js";

import { suite, test } from "node:test";
import assert from "node:assert";


export async function testGetEventById(){
suite("Unit Test: getEventById()", () => {
        test("getEventById() retrieves correct event from database", async () => {
            //Insert a mock event to the actual DB
            const [mockEvent] = await sql`
                INSERT INTO events (name, description, start_time, end_time, location, category)
                VALUES ('Test Event', 'This is a test event', '2025-12-01 10:00:00', '2025-12-01 12:00:00', 'Test Location', 'test')
                RETURNING *;
            `;

            //Test if retrieved by getEventById() is the same as mock event
            const event = await getEventById(mockEvent.id);
            assert.equal(event.id, mockEvent.id);
            assert.equal(event.name, mockEvent.name);
            assert.equal(event.description, mockEvent.description);
            assert.equal(event.start_time.toISOString(), mockEvent.start_time.toISOString());
            assert.equal(event.end_time.toISOString(), mockEvent.end_time.toISOString());
            assert.equal(event.location, mockEvent.location);
            assert.equal(event.category, mockEvent.category);

            //Clean up - delete the mock event
            await sql`DELETE FROM events WHERE id = ${mockEvent.id}`;
        });

        //Negatives
        test("getEventById() returns null for non-existent ID passed", async () => {
            const event = await getEventById(99999); //Bad ID
            assert.equal(event, null);
        });
        test("getEventById() returns undefined for incorrect data type ID passed", async () => {
            const event = await getEventById("thisAintEvenAnID");
            assert.equal(event, undefined);
        });
        test("getEventById() returns undefined for null ID passed", async () => {
            const event = await getEventById(null);
            assert.equal(event, undefined);
        });
    });
}

