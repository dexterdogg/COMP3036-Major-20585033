import sql from "../../config/db.js";

import { suite, test } from "node:test";
import assert from "node:assert";
import { app } from "../../app.js";
import request from "supertest";

export async function testSearchPage() {
    //Check integration between controller, routes and views
    suite("Integration Tests: controllers/search.js", () => {
        test("/search loads OK", async () => {
            const res = await request(app)
            .get('/search')
            .expect(200)
        });

        test("Shows ALL - no input + no category", async () => {
            const total = (await sql`SELECT * FROM events`).length;
            const res = await request(app)
            .get('/search/results?input_search=')
            .expect(200);
            assert.ok(res.text.includes(`${total} Results for: ''`));
        });

        test("Shows matching INPUT - have input + no category", async () => {
            const total = (await sql`SELECT * FROM events WHERE name ILIKE '%basket%'`).length;
            const res = await request(app)
            .get('/search/results?input_search=basket')
            .expect(200);
            assert.ok(res.text.includes(`${total} Results for: 'basket'`));
            assert.ok(res.text.includes("Basketball Game"));
        });
        
        test("Shows matching CATEGORY - no input + have category", async () => {
            const total = (await sql`SELECT * FROM events WHERE category = 'social'`).length;
            const res = await request(app)
            .get('/search/results?category=social')
            .expect(200);
            assert.ok(res.text.includes(`${total} Results for: ''`));
            assert.ok(res.text.includes("Category: social"));
        });

        test("Shows matching BOTH - have input + have category", async () => {
            const total = (await sql`SELECT * FROM events WHERE name ILIKE '%dinner%' AND category = 'social'`).length;
            const res = await request(app)
            .get('/search/results?input_search=dinner&category=social')
            .expect(200);
            assert.ok(res.text.includes(`${total} Results for: 'dinner'`));
            assert.ok(res.text.includes("Category: social"));
        });
    });
}