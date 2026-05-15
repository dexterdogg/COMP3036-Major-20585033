import { addParticipant } from "../../models/eventModels.js";
import sql from "../../config/db.js";

import { after, before, suite, test } from "node:test";
import assert from "node:assert";


export async function testAddParticipant() {

    suite("Unit Test: addParticipant", () => {

        //Use fake event and user
        const event_ID = 123456;
        const user_ID = 123456;
        before(async () => {
            await sql`INSERT INTO events (id, name, description, start_time, end_time, location, category) VALUES (${event_ID}, 'Dummy Event for isRegistered()', 'Testiiiiing', '2025-12-31 10:00:00', '2025-12-31 12:00:00', 'Test Location', 'social');`;
            await sql`INSERT INTO users (id, email, password_hash, role, first_name, last_name) VALUES (${user_ID}, 'Test@example.edu', crypt('Test', gen_salt('bf', 12)), 'Test', 'Test', 'Test');`;
        });


        test("addParticipant should register a user for an event", async () => {
            await addParticipant(user_ID, event_ID);
            const result = await sql`SELECT * FROM event_users WHERE event_id = ${event_ID} AND user_id = ${user_ID}`;
            assert.strictEqual(result.length, 1); // Should find one record
        });

        after(async () => {
            await sql`DELETE FROM events WHERE id = ${event_ID};`;
            await sql`DELETE FROM users WHERE id = ${user_ID};`;
            await sql`DELETE FROM event_users WHERE event_id = ${event_ID} AND user_id = ${user_ID};`;
        });
    });
}