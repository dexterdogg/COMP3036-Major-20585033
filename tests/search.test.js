import { after, suite } from "node:test";
import { runningServer } from "../app.js";
import sql from "../config/db.js";

import { testFilterEvents } from "./search_tests/filter_events.js";
import { testGetEvents } from "./search_tests/getEvents.js";
import { testGetEventById } from "./search_tests/getEventById.js";
import { testGetEvent } from "./search_tests/getEvent.js";
import { testSearchPage } from "./search_tests/searchpage.js";
import { testGetParticipantCount } from "./search_tests/getParticipantCount.js";
import { testIsRegistered } from "./search_tests/isRegistered.js";
import { testAddParticipant } from "./search_tests/addParticipant.js";
import { testEventRegister } from "./search_tests/postRegister.js";


suite ("Event Search Functionality", async () => {

    await testFilterEvents();           //helper function
    await testGetEvents();              //Database model function
    await testGetEventById();           //Database model function
    await testGetEvent();               //Integration Route-FetchJSON function
    await testGetParticipantCount();    //Database model function
    await testIsRegistered();           //Database model function
    await testAddParticipant();         //Database model function
    await testEventRegister();          //Integration Route-POST register/:id function

    await testSearchPage();             //Testing 127.0.0.1/search page rendering and results



    after(async () => {
        await sql.end(); // Close the database connection
        await runningServer.close();
    });
});

//References:

//COMP3028 Module 7 - Testing: Ensuring Code Quality
//asserts - https://nodejs.org/api/assert.html#assertequalactual-expected-message
//ILIKE (case insensitive sql condition) - https://www.postgresql.org/docs/current/functions-matching.html#FUNCTIONS-LIKE
