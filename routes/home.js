import express from 'express';
import * as home from '../controllers/home.js';
import { maybeAuthed } from '../middleware/auth.js';

export const homeRouter = express.Router()

// Below are all the routes for the home
homeRouter.get('/', maybeAuthed, home.index);




