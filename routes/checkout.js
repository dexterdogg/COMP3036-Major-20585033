import { Router } from 'express';
import {
  completeCheckout,
  showCheckout
} from '../controllers/checkout.js';
import { ensureAuthed } from '../middleware/auth.js';

export const checkoutRouter = Router();

checkoutRouter.get('/', ensureAuthed, showCheckout);
checkoutRouter.post('/', ensureAuthed, completeCheckout);