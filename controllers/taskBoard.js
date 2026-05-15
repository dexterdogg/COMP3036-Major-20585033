/**
 * Renders the index page with the specified title.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the rendering is complete.
 */

import sql from '../config/db.js';

export async function main(req, res, next) {
    try {
        const tasks = await sql`SELECT * FROM tasks ORDER by task_id`;

        const [{ total }] = await sql`
            SELECT COALESCE(SUM(points), 0) AS total FROM tasks WHERE completed = true
        `

        res.render('taskBoard', { title: 'Task Board', tasks, totalPoints: total });
    } catch (err) {
        next(err);
    }
    
}


let tasks = [
    { id: 1, title: 'Do 10 push-ups', points: 10, completed: false },
    { id: 2, title: 'Read a chapter of a book', points: 20, completed: false },
    { id: 3, title: 'Meditate for 5 minutes', points: 15, completed: false }
];

let totalPoints = 0;

export function getTasks(req, res) {
    res.render('index', { tasks, totalPoints });
};

export async function completeTasks(req, res, next) {
    const taskId = parseInt(req.body.taskId);

    try {
        await sql`
            UPDATE tasks SET completed = true WHERE task_id =  ${taskId} AND completed = false
        `;
        res.redirect('/taskBoard');
    } catch (err) {
        next(err);
    }
};