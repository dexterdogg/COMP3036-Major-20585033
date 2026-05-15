import { Router } from "express";
import { ensureAuthed } from "../middleware/auth.js";
import { showProfile } from "../controllers/profile.js";

export const profileRouter = Router();
// GET /profile
//ensureAuthed middleware to protect route
profileRouter.get("/", ensureAuthed, showProfile);