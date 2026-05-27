/* getActiveCartByUserId(userId)
createCart(userId)
getCartWithItems(userId)
addCartItem(userId, productId, quantity)
updateCartItem(userId, productId, quantity)
removeCartItem(userId, productId)
clearCart(userId) */

import sql from '../config/db.js';
import { getProductById } from './productModels.js';

export async function getOrCreateActiveCart(userId) {
  const existing = await sql`
    SELECT *
    FROM carts
    WHERE user_id = ${Number(userId)}
    AND status = 'active'
    ORDER BY created_at DESC
    LIMIT 1;
  `;

  if (existing[0]) {
    return existing[0];
  }

  const created = await sql`
    INSERT INTO carts (user_id, status)
    VALUES (${Number(userId)}, 'active')
    RETURNING *;
  `;

  return created[0];
}

export async function getCartWithItems(userId) {
  const cart = await getOrCreateActiveCart(userId);

  const items = await sql`
    SELECT
      ci.id AS cart_item_id,
      ci.quantity,
      p.id AS product_id,
      p.name,
      p.slug,
      p.price_cents,
      p.image_url,
      p.stock_quantity,
      c.name AS category_name,
      (ci.quantity * p.price_cents) AS line_total_cents
    FROM cart_items ci
    INNER JOIN products p ON p.id = ci.product_id
    LEFT JOIN product_categories c ON c.id = p.category_id
    WHERE ci.cart_id = ${cart.id}
    ORDER BY p.name ASC;
  `;

  const totalCents = items.reduce((total, item) => {
    return total + Number(item.line_total_cents);
  }, 0);

  return {
    cart,
    items,
    totalCents
  };
}

export async function addCartItem(userId, productId, quantity = 1) {
  const safeQuantity = Math.max(1, Number(quantity));
  const product = await getProductById(productId);

  if (!product || !product.is_active) {
    throw new Error('Product is not available.');
  }

  if (safeQuantity > product.stock_quantity) {
    throw new Error('Requested quantity exceeds available stock.');
  }

  const cart = await getOrCreateActiveCart(userId);

  const existing = await sql`
    SELECT *
    FROM cart_items
    WHERE cart_id = ${cart.id}
    AND product_id = ${Number(productId)}
    LIMIT 1;
  `;

  if (existing[0]) {
    const newQuantity = existing[0].quantity + safeQuantity;

    if (newQuantity > product.stock_quantity) {
      throw new Error('Cart quantity exceeds available stock.');
    }

    const rows = await sql`
      UPDATE cart_items
      SET quantity = ${newQuantity}
      WHERE id = ${existing[0].id}
      RETURNING *;
    `;

    return rows[0];
  }

  const rows = await sql`
    INSERT INTO cart_items (cart_id, product_id, quantity)
    VALUES (${cart.id}, ${Number(productId)}, ${safeQuantity})
    RETURNING *;
  `;

  return rows[0];
}

export async function updateCartItem(userId, productId, quantity) {
  const safeQuantity = Number(quantity);
  const cart = await getOrCreateActiveCart(userId);

  if (safeQuantity <= 0) {
    return removeCartItem(userId, productId);
  }

  const product = await getProductById(productId);

  if (!product || !product.is_active) {
    throw new Error('Product is not available.');
  }

  if (safeQuantity > product.stock_quantity) {
    throw new Error('Requested quantity exceeds available stock.');
  }

  const rows = await sql`
    UPDATE cart_items
    SET quantity = ${safeQuantity}
    WHERE cart_id = ${cart.id}
    AND product_id = ${Number(productId)}
    RETURNING *;
  `;

  return rows[0];
}

export async function removeCartItem(userId, productId) {
  const cart = await getOrCreateActiveCart(userId);

  await sql`
    DELETE FROM cart_items
    WHERE cart_id = ${cart.id}
    AND product_id = ${Number(productId)};
  `;

  return true;
}