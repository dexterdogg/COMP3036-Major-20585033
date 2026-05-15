import { isRegistered, addParticipant } from "../../models/eventModels.js";
import sql from "../../config/db.js";

import { after, before, suite, test } from "node:test";
import assert from "node:assert";

export async function testIsRegistered() {
    suite("Unit Test: isRegistered", () => {

        //Use fake event and user
        const event_ID = 9999888;
        const user_ID = 9998888;

        before(async () => {
        await sql`INSERT INTO events (id, name, description, start_time, end_time, location, category) VALUES (${event_ID}, 'Dummy Event for isRegistered()', 'Testiiiiing', '2025-12-31 10:00:00', '2025-12-31 12:00:00', 'Test Location', 'social');`;
        await sql`INSERT INTO users (id, email, password_hash, role, first_name, last_name) VALUES (${user_ID}, 'Test@example.edu', crypt('Test', gen_salt('bf', 12)), 'Test', 'Test', 'Test');`;
        });

        test("Return true for unregistered user", async () => {
            
            //Insert a dummy participation record in the database
            await sql`INSERT INTO event_users (event_id, user_id) VALUES (${event_ID}, ${user_ID})`;
            
            const result = await isRegistered(event_ID, user_ID);
            assert.strictEqual(result, true);

            // Clean up the test data
            await sql`DELETE FROM event_users WHERE event_id = ${event_ID} AND user_id = ${user_ID}`;
        });

        //Negatives
        test("Return false for unregistered user", async () => {
            //No participation record inserted
            const result = await isRegistered(event_ID, user_ID);
            assert.strictEqual(result, false);
        });

        test("Return false for invalid inputs", async () => {
            const result = await isRegistered("heeheee", user_ID);
            assert.strictEqual(result, false);
            const result2 = await isRegistered(event_ID, "hahaha");
            assert.strictEqual(result2, false);
        });

        test("Return false for undefined inputs", async () => {
            const result = await isRegistered(undefined, user_ID);
            assert.strictEqual(result, false);
            const result2 = await isRegistered(event_ID, undefined);
            assert.strictEqual(result2, false);
        });
        
        //Clean up dummy data
        after(async () => {
        await sql`DELETE FROM events WHERE id = ${event_ID}`;
        await sql`DELETE FROM users WHERE id = ${user_ID}`;
        await sql`DELETE FROM event_users WHERE event_id = ${event_ID} AND user_id = ${user_ID}`;
        });
    });

}