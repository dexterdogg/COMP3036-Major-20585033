import sql from '../config/db.js';

// Get all event rows
export async function getEvents() {
    const events = await sql`SELECT * FROM events`;
    return events;
}

// Get an event row by its unique ID
export async function getEventById(id_from_param) {
    if (!id_from_param || isNaN(Number(id_from_param))) {
        return undefined;   // Invalid ID pass safety
    }
    const result = await sql`SELECT * FROM events WHERE id = ${id_from_param}`; //This returns an array of rows
    const event = result[0];
    return event;
}

// Get participant count for an event
export async function getParticipantCount(eventId) {
    if (!eventId || isNaN(Number(eventId))) {
        return 0;           // Invalid ID pass safety
    }
    const result = await sql`SELECT COUNT(*) AS count FROM event_users WHERE event_id = ${eventId}`;
    return result[0].count;
}

// Insert a participant for an event
export async function addParticipant(eventId, userId) {
    //Loosely handled -> error catching in controller
    await sql`INSERT INTO event_users (event_id, user_id) VALUES (${eventId}, ${userId})`;
}

export async function isRegistered(eventId, userId) {
    if (!eventId || !userId || isNaN(Number(eventId)) || isNaN(Number(userId))) {
        return false;
    }
    const result = await sql`SELECT * FROM event_users WHERE event_id = ${eventId} AND user_id = ${userId}`;

    if (result.length > 0)
        return true;
    return false;
}
//Get array of events
export async function getUserEventsByID(userId) {
    if (!userId || isNaN(Number(userId))) {
        return [];
    }

    const events = await sql`
        SELECT e.* FROM events e INNER JOIN event_users eu ON e.id = eu.event_id
        WHERE eu.user_id = ${userId}
    `;
    return events;
}
