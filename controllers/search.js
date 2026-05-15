import { getEvents, getEventById, addParticipant, isRegistered } from "../models/eventModels.js";
import { filter_events } from "../services/search_functions/filter.js";
import { Event } from "../services/search_functions/Event.js";
/**
 * Renders the index page with the specified title.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the rendering is complete.
 */
export async function main(req, res, next) {
    //Show all events on first landing on search page
    const events = await getEvents();
    const results = await filter_events(events, undefined, undefined);
    const count = results.length;
    res.render('search', { title: 'Search page', results, query: "", categories: undefined, count: count });
}

//function to show all results from entered search input
export async function showResults(req, res, next) {

    //method=GET gives us variables from form that we can query
    const query = req.query.input_search;
    const categories = req.query.category;

    //categories can be {undefined, "a string", an array}
    const categorySelected = !!categories;
    const queryExists = !!query;

    //find all events matching query
    const events = await getEvents();
    const results = await filter_events(events, query, categories);
    const count = results.length;
    //render all with results and query
    res.render('search', { title: 'Search page', results, query, categories, count: count });
}

export async function getEvent(req, res, next) {
    const id = req.params.id;
    let event = null;

    event = await getEventById(id);
    if (!event) {
        return res.status(404).json({ error: "Event not found", id });
    }
    //Parse into readable format
    const eventObj = new Event(event.id, event.name, event.description, event.start_time, event.end_time, event.location, event.category);

    return res.json({
        message: "Checker retrieved event - JSON",
        id: eventObj.id,
        name: eventObj.name,
        description: eventObj.description,
        date: eventObj.date,
        schedule: eventObj.schedule,
        location: eventObj.location,
        category: eventObj.category
    });
}

export async function register(req, res, next) {
  const eventID = req.params.id;
  const userId = req.user?.id;


  try {
    if (await isRegistered(eventID, userId)) {
      console.log("User already registered for this event");
      return res.json({ status: "exists", message: "Already registered for this event." });
    }

    await addParticipant(eventID, userId);
    console.log("Successfully registered");

    return res.json({ status: "success", message: "Successfully registered for the event!" });
  } catch (error) {
    console.error("Error adding participant:", error);
    return res.status(500).json({ status: "error", message: "Failed to register due to server error." });
  }
}