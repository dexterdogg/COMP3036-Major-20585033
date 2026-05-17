/* checkoutCart(userId)
/* checkoutCart(userId) should:
Read active cart.
Check stock.
Calculate totals server-side.
Insert purchase.
Insert purchase items.
Reduce product stock.
Mark cart as checked out. 
getPurchasesByUserId(userId)
getAllPurchases() */

import sql from '../config/db.js';

export async function checkoutCart(userId) {
  return sql.begin(async (tx) => {
    const carts = await tx`
      SELECT *
      FROM carts
      WHERE user_id = ${Number(userId)}
      AND status = 'active'
      ORDER BY created_at DESC
      LIMIT 1
      FOR UPDATE;
    `;

    const cart = carts[0];

    if (!cart) {
      throw new Error('Cart is empty.');
    }

    const items = await tx`
      SELECT
        ci.product_id,
        ci.quantity,
        p.name,
        p.price_cents,
        p.stock_quantity
      FROM cart_items ci
      INNER JOIN products p ON p.id = ci.product_id
      WHERE ci.cart_id = ${cart.id}
      FOR UPDATE;
    `;

    if (items.length === 0) {
      throw new Error('Cart is empty.');
    }

    for (const item of items) {
      if (item.quantity > item.stock_quantity) {
        throw new Error(`${item.name} does not have enough stock.`);
      }
    }

    const totalCents = items.reduce((total, item) => {
      return total + Number(item.price_cents) * Number(item.quantity);
    }, 0);

    const purchases = await tx`
      INSERT INTO purchases (user_id, total_cents, status, payment_reference)
      VALUES (
        ${Number(userId)},
        ${totalCents},
        'paid',
        ${`MOCK-${Date.now()}`}
      )
      RETURNING *;
    `;

    const purchase = purchases[0];

    for (const item of items) {
      const lineTotal = Number(item.price_cents) * Number(item.quantity);

      await tx`
        INSERT INTO purchase_items (
          purchase_id,
          product_id,
          product_name,
          unit_price_cents,
          quantity,
          line_total_cents
        )
        VALUES (
          ${purchase.id},
          ${item.product_id},
          ${item.name},
          ${item.price_cents},
          ${item.quantity},
          ${lineTotal}
        );
      `;

      await tx`
        UPDATE products
        SET stock_quantity = stock_quantity - ${item.quantity},
            updated_at = NOW()
        WHERE id = ${item.product_id};
      `;
    }

    await tx`
      UPDATE carts
      SET status = 'checked_out',
          updated_at = NOW()
      WHERE id = ${cart.id};
    `;

    return {
      purchase,
      items,
      totalCents
    };
  });
}

export async function getPurchasesByUserId(userId) {
  return sql`
    SELECT
      p.id,
      p.total_cents,
      p.status,
      p.payment_reference,
      p.created_at,
      COUNT(pi.id) AS item_count
    FROM purchases p
    LEFT JOIN purchase_items pi ON pi.purchase_id = p.id
    WHERE p.user_id = ${Number(userId)}
    GROUP BY p.id
    ORDER BY p.created_at DESC;
  `;
}

export async function getPurchaseItemsByPurchaseId(purchaseId) {
  return sql`
    SELECT *
    FROM purchase_items
    WHERE purchase_id = ${Number(purchaseId)}
    ORDER BY id ASC;
  `;
}

export async function getAllPurchases() {
  return sql`
    SELECT
      p.id,
      p.user_id,
      u.email,
      p.total_cents,
      p.status,
      p.payment_reference,
      p.created_at,
      COUNT(pi.id) AS item_count
    FROM purchases p
    INNER JOIN users u ON u.id = p.user_id
    LEFT JOIN purchase_items pi ON pi.purchase_id = p.id
    GROUP BY p.id, u.email
    ORDER BY p.created_at DESC;
  `;
}