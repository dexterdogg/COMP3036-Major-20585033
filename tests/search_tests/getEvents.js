import { getEvents } from "../../models/eventModels.js";
import sql from "../../config/db.js";

import { suite, test } from "node:test";
import assert from "node:assert";

export async function testGetEvents(){
    suite("Unit Test: getEvents()", async () => {
        //Insert mock data into events table before running the test

        await sql`INSERT INTO events (id, name, description, start_time, end_time, location, category) VALUES (127837, 'Test Event 2', 'This is a test event for unit testing purposes.', '2025-10-15 10:00:00', '2025-10-15 12:00:00', 'Test Location', 'social');`
        
        test("getEvents() retrieves exact total count from database", async () => {
            const events = await getEvents();
            const retrieved = await sql`SELECT * FROM events`;
            assert.equal(events.length, retrieved.length);
        });

        //Clean up mock data after test is done
        await sql`DELETE FROM events WHERE id = 127837;`;
    });
}
