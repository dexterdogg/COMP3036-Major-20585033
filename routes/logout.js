import router from 'express';

// pulling functions from controller for login
import { showLogin, postLogin, postLogout } from "../controllers/login.js";

export const logoutRouter = router();
// route for logout (yet to be implemented)
logoutRouter.post("/", postLogout);
logoutRouter.get("/", postLogout);
