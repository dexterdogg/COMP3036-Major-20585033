import { Router } from 'express';
import { listOrders, showOrder } from '../controllers/orders.js';
import { ensureAuthed } from '../middleware/auth.js';

export const ordersRouter = Router();

ordersRouter.get('/', ensureAuthed, listOrders);
ordersRouter.get('/:id', ensureAuthed, showOrder);