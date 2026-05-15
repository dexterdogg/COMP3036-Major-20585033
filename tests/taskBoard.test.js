import {after, suite, test} from "node:test";
import assert from "node:assert";
import { app, runningServer } from "../app.js";
import request from "supertest";
import sql from "../config/db.js";
import { text } from "node:stream/consumers";


suite ("Task Board Functionality", () => {
    suite ("Intergration - Task Board", () => {
        test("GET /taskBoard loads task list with total points", async () => {
            const [task] = await sql `
                INSERT INTO tasks (name, points, completed)
                VALUES ('Intergration task', 10, true)
                RETURNING *;
            `;
            
            const total = await sql`
                SELECT COALESCE(SUM(points), 0) AS total FROM tasks WHERE completed = true
            `;

            await request(app)
                .get('/taskBoard')
                .expect(200)
                .expect((res) => {
                    assert.ok(res.text.includes('Intergration task'));
                    assert.ok(res.text.includes(`Total Points: ${total[0].total}`));
                });
            
            await sql `DELETE FROM tasks WHERE task_id = ${task.task_id}`;
        });

        test("POST /taskBoard/completeTask marks task as completed", async () => {
            const [task] = await sql `
                INSERT INTO tasks (name, points, completed)
                VALUES ('Incomplete task', 10, false)
                RETURNING *;
            `;

            await request(app)
                .post('/taskBoard/completeTask')
                .send(`taskId=${task.task_id}`)
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .expect(302)
            
            const [updated] = await sql`
                SELECT * FROM tasks WHERE task_id = ${task.task_id}
            `;

            assert.equal(updated.completed, true);

            await sql `DELETE FROM tasks WHERE task_id = ${task.task_id}`;
        });

    });


    after(async () => {
        await sql.end(); // Close the database connection
        await runningServer.close();
    });
});
