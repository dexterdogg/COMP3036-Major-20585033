import { Router } from 'express';
import {
  apiAdminCreateProduct,
  apiAdminDeleteProduct,
  apiAdminListProducts,
  apiAdminPurchases,
  apiAdminUpdateProduct,
  apiListProducts,
  apiMyPurchases,
  apiShowProduct
} from '../controllers/apiStore.js';
import { ensureAdmin, ensureAuthed } from '../middleware/auth.js';

export const apiStoreRouter = Router();

apiStoreRouter.get('/products', apiListProducts);
apiStoreRouter.get('/products/:id', apiShowProduct);

apiStoreRouter.get('/me/purchases', ensureAuthed, apiMyPurchases);

apiStoreRouter.get('/admin/products', ensureAdmin, apiAdminListProducts);
apiStoreRouter.post('/admin/products', ensureAdmin, apiAdminCreateProduct);
apiStoreRouter.put('/admin/products/:id', ensureAdmin, apiAdminUpdateProduct);
apiStoreRouter.delete('/admin/products/:id', ensureAdmin, apiAdminDeleteProduct);
apiStoreRouter.get('/admin/purchases', ensureAdmin, apiAdminPurchases);