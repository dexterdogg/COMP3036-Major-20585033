import {
    addCartItem,
    getCartWithItems,
    removeCartItem,
    updateCartItem
  } from '../models/cartModels.js';
  
  function formatMoney(cents) {
    return `$${(Number(cents) / 100).toFixed(2)}`;
  }
  
  export async function showCart(req, res) {
    try {
      const cart = await getCartWithItems(req.user.id);
  
      return res.render('cart', {
        title: 'Cart',
        cart,
        error: req.query.error || null,
        formatMoney
      });
    } catch (err) {
      console.error('showCart error:', err);
  
      return res.status(500).render('error', {
        title: 'Error',
        message: 'Could not load cart.',
        error: {
          status: 500,
          message: 'Could not load cart.',
          stack: ''
        }
      });
    }
  }
  
  export async function addItem(req, res) {
    try {
      await addCartItem(req.user.id, req.body.productId, req.body.quantity || 1);
      return res.redirect('/cart');
    } catch (err) {
      return res.redirect(`/products?error=${encodeURIComponent(err.message)}`);
    }
  }
  
  export async function updateItem(req, res) {
    try {
      await updateCartItem(req.user.id, req.params.productId, req.body.quantity);
      return res.redirect('/cart');
    } catch (err) {
      return res.redirect(`/cart?error=${encodeURIComponent(err.message)}`);
    }
  }
  
  export async function removeItem(req, res) {
    try {
      await removeCartItem(req.user.id, req.params.productId);
      return res.redirect('/cart');
    } catch (err) {
      return res.redirect(`/cart?error=${encodeURIComponent(err.message)}`);
    }
  }