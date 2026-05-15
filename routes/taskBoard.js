import express from 'express';
import * as taskBoard from '../controllers/taskBoard.js';

import { maybeAuthed } from "../middleware/auth.js";

export const taskBoardRouter = express.Router()

// Below are all the routes for the home
taskBoardRouter.get('/', maybeAuthed, taskBoard.main);
taskBoardRouter.post('/completeTask',maybeAuthed, taskBoard.completeTasks);





