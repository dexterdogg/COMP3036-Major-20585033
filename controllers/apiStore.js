import {
    createProduct,
    deleteProduct,
    getAllProductsForAdmin,
    getProductById,
    getProducts,
    updateProduct
  } from '../models/productModels.js';
  
  import {
    getAllPurchases,
    getPurchasesByUserId
  } from '../models/purchaseModels.js';
  
  function slugify(value) {
    return String(value)
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  
  function toProductData(body) {
    return {
      categoryId: Number(body.categoryId),
      name: String(body.name || '').trim(),
      slug: slugify(body.slug || body.name),
      description: String(body.description || '').trim(),
      priceCents: Math.round(Number(body.price || 0) * 100),
      imageUrl: String(body.imageUrl || '').trim(),
      stockQuantity: Number(body.stockQuantity || 0),
      isActive: body.isActive === true || body.isActive === 'true'
    };
  }
  
  export async function apiListProducts(req, res) {
    const products = await getProducts({
      search: String(req.query.search || ''),
      category: String(req.query.category || '')
    });
  
    return res.json({ products });
  }
  
  export async function apiShowProduct(req, res) {
    const product = await getProductById(req.params.id);
  
    if (!product || !product.is_active) {
      return res.status(404).json({ error: 'Product not found.' });
    }
  
    return res.json({ product });
  }
  
  export async function apiAdminListProducts(req, res) {
    const products = await getAllProductsForAdmin();
    return res.json({ products });
  }
  
  export async function apiAdminCreateProduct(req, res) {
    const product = await createProduct(toProductData(req.body));
    return res.status(201).json({ product });
  }
  
  export async function apiAdminUpdateProduct(req, res) {
    const product = await updateProduct(req.params.id, toProductData(req.body));
  
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }
  
    return res.json({ product });
  }
  
  export async function apiAdminDeleteProduct(req, res) {
    const product = await deleteProduct(req.params.id);
  
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }
  
    return res.json({ product });
  }
  
  export async function apiMyPurchases(req, res) {
    const purchases = await getPurchasesByUserId(req.user.id);
    return res.json({ purchases });
  }
  
  export async function apiAdminPurchases(req, res) {
    const purchases = await getAllPurchases();
    return res.json({ purchases });
  }