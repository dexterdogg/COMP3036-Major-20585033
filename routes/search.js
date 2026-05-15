import express from 'express';
import * as search from '../controllers/search.js';
import { ensureAuthed } from "../middleware/auth.js";
import { maybeAuthed } from "../middleware/auth.js";

export const searchRouter = express.Router()

// Below are all the routes for the home
searchRouter.get('/', maybeAuthed, search.main);
searchRouter.get('/results', maybeAuthed, search.showResults);
searchRouter.get("/:id", maybeAuthed, search.getEvent);
searchRouter.post("/register/:id", ensureAuthed, search.register);


