import {
    getCategories,
    getProductBySlug,
    getProducts
  } from '../models/productModels.js';
  
  function formatMoney(cents) {
    return `$${(Number(cents) / 100).toFixed(2)}`;
  }
  
  export async function index(req, res) {
    try {
      const search = String(req.query.search || '');
      const category = String(req.query.category || '');
  
      const products = await getProducts({ search, category });
      const categories = await getCategories();
  
      return res.render('products', {
        title: 'Products',
        products,
        categories,
        filters: {
          search,
          category
        },
        error: req.query.error || null,
        formatMoney
      });
    } catch (err) {
      console.error('products index error:', err);
  
      return res.status(500).render('error', {
        title: 'Error',
        message: 'Could not load products.',
        error: {
          status: 500,
          message: 'Could not load products.',
          stack: ''
        }
      });
    }
  }
  
  export async function show(req, res) {
    try {
      const product = await getProductBySlug(req.params.slug);
  
      if (!product) {
        return res.status(404).render('error', {
          title: 'Not Found',
          message: 'Product not found.',
          error: {
            status: 404,
            message: 'Product not found.',
            stack: ''
          }
        });
      }
  
      return res.render('productDetail', {
        title: product.name,
        product,
        formatMoney
      });
    } catch (err) {
      console.error('product detail error:', err);
  
      return res.status(500).render('error', {
        title: 'Error',
        message: 'Could not load product.',
        error: {
          status: 500,
          message: 'Could not load product.',
          stack: ''
        }
      });
    }
  }