import { getParticipantCount } from "../../models/eventModels.js";
import sql from "../../config/db.js";

import { suite, test } from "node:test";
import assert from "node:assert";

export async function testGetParticipantCount(){
    suite("Unit Test: getParticipantCount()", async () => {

        const eventID = "40";
        //Update an existing event with mock data before running the test
        await sql`INSERT INTO event_users (event_id, user_id) VALUES (${eventID}, 1), (${eventID}, 2), (${eventID}, 3);`

        test("getParticipantCount() retrieves exact total count from database", async () => {
            const count = await getParticipantCount(eventID);
            const retrieved = await sql`SELECT COUNT(*) FROM event_users WHERE event_id = ${eventID};`;
            assert.equal(count, retrieved[0].count);
        });

        //Clean up mock data after test is done
        await sql`DELETE FROM event_users WHERE event_id = ${eventID} and user_id = 1;`;
        await sql`DELETE FROM event_users WHERE event_id = ${eventID} and user_id = 2;`;
        await sql`DELETE FROM event_users WHERE event_id = ${eventID} and user_id = 3;`;


        //Negatives
        test("getParticipantCount() returns 0 for null ID passed", async () => {
            const count = await getParticipantCount(null);
            assert.equal(count, 0);
        });

        test("getParticipantCount() returns 0 for special characters ID's passed", async () => {
            const count = await getParticipantCount("randomraondoansd-=][';.,");
            assert.equal(count, 0);
        });

        test("getParticipantCount() returns 0 for undefined data type ID", async () => {
            const count = await getParticipantCount(undefined);
            assert.equal(count, 0);
        });
    });
}