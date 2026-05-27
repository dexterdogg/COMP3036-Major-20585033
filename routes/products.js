import { Router } from 'express';
import { index, show } from '../controllers/products.js';

export const productsRouter = Router();

productsRouter.get('/', index);
productsRouter.get('/:slug', show);