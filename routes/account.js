import { Router } from "express";
import { showRegister, postRegister } from "../controllers/account.js";

import { maybeAuthed } from "../middleware/auth.js";

// Router for account-related routes
export const accountRouter = Router();

accountRouter.get("/",maybeAuthed, showRegister);
accountRouter.post("/",maybeAuthed, postRegister);

