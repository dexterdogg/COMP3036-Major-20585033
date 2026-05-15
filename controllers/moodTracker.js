/**
 * Renders the index page with the specified title.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the rendering is complete.
 */

import sql from "../config/db.js";

export async function main(req, res, next) {


    try {
            const entries = await sql`SELECT * FROM mood_board_entr WHERE user_id = ${req.user.id}`;
            
            res.render('moodTracker', { title: 'Mood Tracker' ,entries});
        } catch (err) {
            next(err);
        }
}

export async function postMood(req, res) {
    try {
        const { mood, notes } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).send("Unauthorized: userId is missing");
        }

        if (!mood) {
            return res.status(400).send("Mood is required");
        }

        // enters the selected mood and note alongside the user id
        const [entry] = await sql `
            INSERT INTO mood_board_entr (user_id, mood, notes)
            VALUES (${userId}, ${mood}, ${notes || null})
            RETURNING *;
        `;

        console.log("Mood saved to DB:", entry);

        res.redirect('/moodTracker');
    } catch (error) {
        console.error("Error saving mood:", error);
        res.status(500).send("Internal server error.");
    }
}
