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

import { productsRouter } from './routes/products.js';
import { cartRouter } from './routes/cart.js';
import { checkoutRouter } from './routes/checkout.js';
import { ordersRouter } from './routes/orders.js';
import { adminProductsRouter } from './routes/adminProducts.js';
import { apiStoreRouter } from './routes/apiStore.js';

import { maybeAuthed } from './middleware/auth.js';

export const codeTrace = debug('comp3036:server');
export const app = express();

server.setup(app);

app.use((req, res, next) => {
  res.locals.isAuthed = false;
  res.locals.me = null;
  next();
});

app.use(maybeAuthed);

app.use('/', homeRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/register', accountRouter);
app.use('/profile', profileRouter);

app.use('/products', productsRouter);
app.use('/cart', cartRouter);
app.use('/checkout', checkoutRouter);
app.use('/orders', ordersRouter);
app.use('/admin/products', adminProductsRouter);
app.use('/api', apiStoreRouter);

app.use('/search', searchRouter);
app.use('/moodTracker', moodTrackerRouter);
app.use('/taskBoard', taskBoardRouter);

app.get('/test', (req, res) => {
  res.send('Test');
});

server.errorHandling(app);

export const runningServer =
  process.env.NODE_ENV === 'test'
    ? { close: async () => {} }
    : app.listen(server.port, () => {
        console.log(`University Store running at http://127.0.0.1:${server.port}`);
        codeTrace('server started');
      });