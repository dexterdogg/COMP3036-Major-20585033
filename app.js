import express from 'express';
import debug from 'debug';
import * as server from './config/server.js';
import { homeRouter } from './routes/home.js';
import { searchRouter } from './routes/search.js';
import { moodTrackerRouter } from './routes/moodTracker.js';
import { taskBoardRouter } from './routes/taskBoard.js';
import { loginRouter } from './routes/login.js';
import { profileRouter } from './routes/profile.js';
import { accountRouter } from './routes/account.js';
import { logoutRouter } from './routes/logout.js';


// Setup debug module to spit out all messages
// Do `npn start` to see the debug messages
export const codeTrace = debug('comp3028:server');

// Start the app
export const app = express();
server.setup(app)


// Register any middleware here
import { maybeAuthed, ensureAuthed } from "./middleware/auth.js";
app.use((req, res, next) => {
  res.locals.isAuthed = false;
  res.locals.me = null;
  next();
});
app.use(maybeAuthed);

// Register routers here
app.use('/', homeRouter);
app.use('/search', searchRouter);
app.use('/moodTracker', moodTrackerRouter);
app.use('/taskBoard', taskBoardRouter);
app.use('/login', loginRouter);
app.use('/profile', profileRouter);
app.use('/logout', logoutRouter);
app.use('/register', accountRouter);
// Not encouraged, but this is a simple example of how to register a route without a router.
app.get('/test', (req, res) => {
  res.send('Test');
});

// ####################################### No need to modify below this line #######################################
// Start the server
server.errorHandling(app);
export const runningServer = app.listen(server.port, () => {
  console.log(`Example app listening on port http://127.0.0.1:${server.port}`);
  debug('testing');
});

