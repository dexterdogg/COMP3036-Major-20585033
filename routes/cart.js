import { Router } from 'express';
import {
  addItem,
  removeItem,
  showCart,
  updateItem
} from '../controllers/cart.js';
import { ensureAuthed } from '../middleware/auth.js';

export const cartRouter = Router();

cartRouter.get('/', ensureAuthed, showCart);
cartRouter.post('/items', ensureAuthed, addItem);
cartRouter.post('/items/:productId/update', ensureAuthed, updateItem);
cartRouter.post('/items/:productId/delete', ensureAuthed, removeItem);