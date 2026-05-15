
import router from 'express';

// pulling functions from controller for login
import { showLogin, postLogin, postLogout } from "../controllers/login.js";

export const loginRouter = router();

// get and post routes for login page
loginRouter.get("/", showLogin);
loginRouter.post("/", postLogin);
// route for logout (yet to be implemented)
loginRouter.post("/logout", postLogout);
loginRouter.get("/logout", postLogout);

