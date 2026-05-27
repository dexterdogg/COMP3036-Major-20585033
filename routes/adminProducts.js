import { Router } from 'express';
import {
  createAdminProduct,
  deleteAdminProduct,
  editAdminProduct,
  listAdminProducts,
  updateAdminProduct
} from '../controllers/adminProducts.js';
import { ensureAdmin } from '../middleware/auth.js';

export const adminProductsRouter = Router();

adminProductsRouter.get('/', ensureAdmin, listAdminProducts);
adminProductsRouter.post('/', ensureAdmin, createAdminProduct);
adminProductsRouter.get('/:id/edit', ensureAdmin, editAdminProduct);
adminProductsRouter.post('/:id/update', ensureAdmin, updateAdminProduct);
adminProductsRouter.post('/:id/delete', ensureAdmin, deleteAdminProduct);