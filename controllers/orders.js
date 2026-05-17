import {
    getPurchaseItemsByPurchaseId,
    getPurchasesByUserId
  } from '../models/purchaseModels.js';
  
  function formatMoney(cents) {
    return `$${(Number(cents) / 100).toFixed(2)}`;
  }
  
  export async function listOrders(req, res) {
    try {
      const purchases = await getPurchasesByUserId(req.user.id);
  
      return res.render('orders', {
        title: 'My Orders',
        purchases,
        formatMoney
      });
    } catch (err) {
      console.error('listOrders error:', err);
  
      return res.status(500).render('error', {
        title: 'Error',
        message: 'Could not load orders.',
        error: {
          status: 500,
          message: 'Could not load orders.',
          stack: ''
        }
      });
    }
  }
  
  export async function showOrder(req, res) {
    try {
      const purchases = await getPurchasesByUserId(req.user.id);
      const purchase = purchases.find((item) => item.id === Number(req.params.id));
  
      if (!purchase) {
        return res.status(404).render('error', {
          title: 'Not Found',
          message: 'Order not found.',
          error: {
            status: 404,
            message: 'Order not found.',
            stack: ''
          }
        });
      }
  
      const items = await getPurchaseItemsByPurchaseId(req.params.id);
  
      return res.render('orderDetail', {
        title: `Order #${purchase.id}`,
        purchase,
        items,
        formatMoney
      });
    } catch (err) {
      console.error('showOrder error:', err);
  
      return res.status(500).render('error', {
        title: 'Error',
        message: 'Could not load order.',
        error: {
          status: 500,
          message: 'Could not load order.',
          stack: ''
        }
      });
    }
  }