import express from 'express';
import * as moodTracker from '../controllers/moodTracker.js';
import { ensureAuthed } from "../middleware/auth.js";

export const moodTrackerRouter = express.Router()

// Below are all the routes for the home
moodTrackerRouter.get('/',ensureAuthed, moodTracker.main);
moodTrackerRouter.post('/', ensureAuthed, moodTracker.postMood);






