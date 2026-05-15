import { filter_events } from "../../services/search_functions/filter.js";

import { suite, test } from "node:test";
import assert from "node:assert";

export async function testFilterEvents() {

    suite("Unit Test: filter_events()", async () => {

        test("No input & No category -> return all events", async () => {

            //Mock events - 3 total
            const events = [
                { name: 'Basketball Game', description: 'Sporting event', start_time: new Date('2025-11-01 18:00:00'), end_time: new Date('2025-11-01 20:00:00'), location: 'Sydney Olympic Park Basketball Arena', category: 'sport' },
                { name: 'MESH Study Group', description: 'Collaborative study session', start_time: new Date('2025-11-03 14:00:00'), end_time: new Date('2025-11-03 16:00:00'), location: 'Parramatta South WSU Library', category: 'study' },
                { name: 'Rock Concert', description: 'Live music event', start_time: new Date('2025-11-05 19:30:00'), end_time: new Date('2025-11-05 22:00:00'), location: 'Sydney Opera House', category: 'music' },
            ];

            //No input + No category
            const query = "";
            const categories = undefined;

            //Results should be equal to all events
            const results = await filter_events(events, query, categories);
            assert.equal(results.length, events.length);
        });
        test("Use input, & No category -> return input matches", async () => {
            //Mock events - 2 'basketball' events
            const events = [
                { name: 'Basketball Game', description: 'Sporting event', start_time: new Date('2025-11-01 18:00:00'), end_time: new Date('2025-11-01 20:00:00'), location: 'Sydney Olympic Park Basketball Arena', category: 'sport' },
                { name: 'Basketball Game 2', description: 'Collaborative study session', start_time: new Date('2025-11-03 14:00:00'), end_time: new Date('2025-11-03 16:00:00'), location: 'Parramatta South WSU Library', category: 'study' },
                { name: 'Rock Concert', description: 'Live music event', start_time: new Date('2025-11-05 19:30:00'), end_time: new Date('2025-11-05 22:00:00'), location: 'Sydney Opera House', category: 'music' },
            ];

            //Input: 'basket' + No category
            const query = "basket";
            const categories = undefined;

            //Results should be equal to 2 events
            const results = await filter_events(events, query, categories);
            assert.equal(results.length, 2);

            //Results should be an event with a 'basket' keyword
            for (const event of results) {
                assert.ok(event.name.toLowerCase().includes(query));
            }
        });

        test("No input & Use category -> return category matches", async () => {

            //Mock events - 1 'social' events
            const events = [
                { name: 'Basketball Game', description: 'Sporting event', start_time: new Date('2025-11-01 18:00:00'), end_time: new Date('2025-11-01 20:00:00'), location: 'Sydney Olympic Park Basketball Arena', category: 'sport' },
                { name: 'MESH Study Group', description: 'Collaborative study session', start_time: new Date('2025-11-03 14:00:00'), end_time: new Date('2025-11-03 16:00:00'), location: 'Parramatta South WSU Library', category: 'study' },
                { name: 'Rock Concert', description: 'Live music event', start_time: new Date('2025-11-05 19:30:00'), end_time: new Date('2025-11-05 22:00:00'), location: 'Sydney Opera House', category: 'social' },
            ];

            //No input + 'social' category
            const query = "";
            const categories = ['social'];

            //Results should be equal to 1 event
            const results = await filter_events(events, query, categories);
            assert.equal(results.length, 1);

            //Results should be an event with a 'social' category
            for (const event of results) {
                assert.ok(event.category.includes(categories));
            }
        });

        test("Use input & Use category -> return input + category matches", async () => {

            //Mock events - 1 'social' event with 'concert' keyword
            const events = [
                { name: 'Basketball Game', description: 'Sporting event', start_time: new Date('2025-11-01 18:00:00'), end_time: new Date('2025-11-01 20:00:00'), location: 'Sydney Olympic Park Basketball Arena', category: 'sport' },
                { name: 'MESH Study Group', description: 'Collaborative study session', start_time: new Date('2025-11-03 14:00:00'), end_time: new Date('2025-11-03 16:00:00'), location: 'Parramatta South WSU Library', category: 'study' },
                { name: 'Rock Concert', description: 'Live music event', start_time: new Date('2025-11-05 19:30:00'), end_time: new Date('2025-11-05 22:00:00'), location: 'Sydney Opera House', category: 'social' },
            ];

            //'concert' input + ''social' category
            const query = "concert";
            const categories = ['social'];

            //Results should be equal to 1 event
            const results = await filter_events(events, query, categories);
            assert.equal(results.length, 1);

            //Results should be an event with a 'social' category + 'concert' keyword
            for (const event of results) {
                assert.ok(event.category.includes(categories));
                assert.ok(event.name.toLowerCase().includes(query));
            }
        });

        //Negatives
        test("Invalid passed 'query' undefined - just returns all", async () => {
            const events = [
                { name: 'Basketball Game', description: 'Sporting event', start_time: new Date('2025-11-01 18:00:00'), end_time: new Date('2025-11-01 20:00:00'), location: 'Sydney Olympic Park Basketball Arena', category: 'sport' },
                { name: 'MESH Study Group', description: 'Collaborative study session', start_time: new Date('2025-11-03 14:00:00'), end_time: new Date('2025-11-03 16:00:00'), location: 'Parramatta South WSU Library', category: 'study' },
                { name: 'Rock Concert', description: 'Live music event', start_time: new Date('2025-11-05 19:30:00'), end_time: new Date('2025-11-05 22:00:00'), location: 'Sydney Opera House', category: 'social' },
            ];

            const query = undefined;
            const categories = undefined;

            const results = await filter_events(events, query, categories);
            assert.equal(results.length, events.length);
        });

        test("Invalid passed 'categories' undefined - just returns all", async () => {
            const events = [
                { name: 'Basketball Game', description: 'Sporting event', start_time: new Date('2025-11-01 18:00:00'), end_time: new Date('2025-11-01 20:00:00'), location: 'Sydney Olympic Park Basketball Arena', category: 'sport' },
                { name: 'MESH Study Group', description: 'Collaborative study session', start_time: new Date('2025-11-03 14:00:00'), end_time: new Date('2025-11-03 16:00:00'), location: 'Parramatta South WSU Library', category: 'study' },
                { name: 'Rock Concert', description: 'Live music event', start_time: new Date('2025-11-05 19:30:00'), end_time: new Date('2025-11-05 22:00:00'), location: 'Sydney Opera House', category: 'social' },
            ];

            const query = "";
            const categories = undefined;

            const results = await filter_events(events, query, categories);
            assert.equal(results.length, events.length);
        });

        test("Valid but unexpected passed 'query', too long + special characters - just returns nothing [] ", async () => {
            const events = [
                { name: 'Basketball Game', description: 'Sporting event', start_time: new Date('2025-11-01 18:00:00'), end_time: new Date('2025-11-01 20:00:00'), location: 'Sydney Olympic Park Basketball Arena', category: 'sport' },
                { name: 'MESH Study Group', description: 'Collaborative study session', start_time: new Date('2025-11-03 14:00:00'), end_time: new Date('2025-11-03 16:00:00'), location: 'Parramatta South WSU Library', category: 'study' },
                { name: 'Rock Concert', description: 'Live music event', start_time: new Date('2025-11-05 19:30:00'), end_time: new Date('2025-11-05 22:00:00'), location: 'Sydney Opera House', category: 'social' },
            ];

            //Special characters + very long string
            const query = "aaaaaaabcdefg123456789-==[';.,,aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
            const categories = undefined;

            const results = await filter_events(events, query, categories);
            assert.equal(results.length, 0);
        });

        test("Valid but unexpected passed 'categories', non-prepared category type - just returns nothing [] ", async () => {
            const events = [
                { name: 'Basketball Game', description: 'Sporting event', start_time: new Date('2025-11-01 18:00:00'), end_time: new Date('2025-11-01 20:00:00'), location: 'Sydney Olympic Park Basketball Arena', category: 'sport' },
                { name: 'MESH Study Group', description: 'Collaborative study session', start_time: new Date('2025-11-03 14:00:00'), end_time: new Date('2025-11-03 16:00:00'), location: 'Parramatta South WSU Library', category: 'study' },
                { name: 'Rock Concert', description: 'Live music event', start_time: new Date('2025-11-05 19:30:00'), end_time: new Date('2025-11-05 22:00:00'), location: 'Sydney Opera House', category: 'social' },
            ];

            const query = "";
            const categories = ["aaaaaaabcdefg123456789-==[';.,,aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"];
            //Special characters + very long string

            const results = await filter_events(events, query, categories);
            assert.equal(results.length, 0);
        });
    });
}