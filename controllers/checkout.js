import { getCartWithItems } from '../models/cartModels.js';
import { checkoutCart } from '../models/purchaseModels.js';

function formatMoney(cents) {
  return `$${(Number(cents) / 100).toFixed(2)}`;
}

export async function showCheckout(req, res) {
  try {
    const cart = await getCartWithItems(req.user.id);

    if (cart.items.length === 0) {
      return res.redirect('/cart?error=Your cart is empty.');
    }

    return res.render('checkout', {
      title: 'Checkout',
      cart,
      error: null,
      formatMoney
    });
  } catch (err) {
    console.error('showCheckout error:', err);

    return res.status(500).render('error', {
      title: 'Error',
      message: 'Could not load checkout.',
      error: {
        status: 500,
        message: 'Could not load checkout.',
        stack: ''
      }
    });
  }
}

export async function completeCheckout(req, res) {
  try {
    const cardholderName = String(req.body.cardholderName || '').trim();

    if (!cardholderName) {
      const cart = await getCartWithItems(req.user.id);

      return res.status(400).render('checkout', {
        title: 'Checkout',
        cart,
        error: 'Cardholder name is required for the mock payment.',
        formatMoney
      });
    }

    const result = await checkoutCart(req.user.id);

    return res.render('orderSuccess', {
      title: 'Order Confirmed',
      purchase: result.purchase,
      items: result.items,
      formatMoney
    });
  } catch (err) {
    console.error('completeCheckout error:', err);

    const cart = await getCartWithItems(req.user.id);

    return res.status(400).render('checkout', {
      title: 'Checkout',
      cart,
      error: err.message,
      formatMoney
    });
  }
}