import { getUserEventsByID } from "../../models/eventModels.js";
import sql from "../../config/db.js";
import { after, before, suite, test } from "node:test";
import assert from "node:assert";

export async function testGetUserEvents() {
    suite("Unit Test: getUserEventsByID()", () => {
        const userID = 111999222;
        const eventIDs = [101, 102, 103];

        before(async () => {
            // Clean slate in case of previous test failures
            await sql`DELETE FROM event_users WHERE user_id = ${userID}`;
            await sql`DELETE FROM events WHERE id = ANY(${eventIDs})`;
            await sql`DELETE FROM users WHERE id = ${userID}`;

            // Insert dummy user
            await sql`
        INSERT INTO users (id, email, password_hash, role, first_name, last_name)
        VALUES (
          ${userID},
          'TESTING@example.edu',
          crypt('Stud123', gen_salt('bf', 12)),
          'Student',
          'Alex',
          'Ng'
        );
      `;

            // Insert dummy events
            for (const eventID of eventIDs) {
                await sql`
          INSERT INTO events (id, name, description, start_time, end_time, location, category)
          VALUES (
            ${eventID},
            ${'Event ' + eventID},
            ${'Description for event ' + eventID},
            NOW(),
            NOW() + INTERVAL '2 hours',
            ${'Location ' + eventID},
            'Category'
          );
        `;
            }

            // Register user to all events
            for (const eventID of eventIDs) {
                await sql`INSERT INTO event_users (user_id, event_id) VALUES (${userID}, ${eventID})`;
            }
        });

        test("Retrieves all events registered by the same userID", async () => {
            const events = await getUserEventsByID(userID);

            // Check count matches
            assert.strictEqual(events.length, eventIDs.length, "Event count mismatch");

            // Extract IDs
            const returnedIDs = events.map(e => e.id);

            // Verify every expected event is in the result
            for (const id of eventIDs) {
                assert.ok(returnedIDs.includes(id), `Missing event ${id}`);
            }
        });

        after(async () => {
            // Clean up dummy data
            await sql`DELETE FROM event_users WHERE user_id = ${userID}`;
            await sql`DELETE FROM events WHERE id = ANY(${eventIDs})`;
            await sql`DELETE FROM users WHERE id = ${userID}`;
        });
    });
}
