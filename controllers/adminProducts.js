import {
    createProduct,
    deleteProduct,
    getAllProductsForAdmin,
    getCategories,
    getProductById,
    updateProduct
  } from '../models/productModels.js';
  
  import { getAllPurchases } from '../models/purchaseModels.js';
  
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
      isActive: body.isActive === 'on' || body.isActive === 'true'
    };
  }
  
  function formatMoney(cents) {
    return `$${(Number(cents) / 100).toFixed(2)}`;
  }
  
  export async function listAdminProducts(req, res) {
    const products = await getAllProductsForAdmin();
    const categories = await getCategories();
    const purchases = await getAllPurchases();
  
    return res.render('adminProducts', {
      title: 'Admin Products',
      products,
      categories,
      purchases,
      editingProduct: null,
      error: null,
      formatMoney
    });
  }
  
  export async function createAdminProduct(req, res) {
    try {
      const data = toProductData(req.body);
  
      if (!data.name || !data.slug || data.priceCents < 0) {
        throw new Error('Product name, slug, and valid price are required.');
      }
  
      await createProduct(data);
      return res.redirect('/admin/products');
    } catch (err) {
      const products = await getAllProductsForAdmin();
      const categories = await getCategories();
      const purchases = await getAllPurchases();
  
      return res.status(400).render('adminProducts', {
        title: 'Admin Products',
        products,
        categories,
        purchases,
        editingProduct: null,
        error: err.message,
        formatMoney
      });
    }
  }
  
  export async function editAdminProduct(req, res) {
    const products = await getAllProductsForAdmin();
    const categories = await getCategories();
    const purchases = await getAllPurchases();
    const editingProduct = await getProductById(req.params.id);
  
    return res.render('adminProducts', {
      title: 'Admin Products',
      products,
      categories,
      purchases,
      editingProduct,
      error: null,
      formatMoney
    });
  }
  
  export async function updateAdminProduct(req, res) {
    try {
      const data = toProductData(req.body);
      await updateProduct(req.params.id, data);
  
      return res.redirect('/admin/products');
    } catch (err) {
      return res.redirect(`/admin/products/${req.params.id}/edit`);
    }
  }
  
  export async function deleteAdminProduct(req, res) {
    await deleteProduct(req.params.id);
    return res.redirect('/admin/products');
  }