/* getProducts({ search, category })
getProductById(id)
getProductBySlug(slug)
createProduct(data)
updateProduct(id, data)
deleteProduct(id) */

import sql from '../config/db.js';

export async function getCategories() {
  return sql`
    SELECT id, name, slug
    FROM product_categories
    ORDER BY name ASC;
  `;
}

export async function getProducts({ search = '', category = '' } = {}) {
  const trimmedSearch = search.trim();
  const trimmedCategory = category.trim();

  if (trimmedSearch && trimmedCategory) {
    return sql`
      SELECT
        p.*,
        c.name AS category_name,
        c.slug AS category_slug
      FROM products p
      LEFT JOIN product_categories c ON c.id = p.category_id
      WHERE p.is_active = true
      AND c.slug = ${trimmedCategory}
      AND p.name ILIKE ${`%${trimmedSearch}%`}
      ORDER BY p.name ASC;
    `;
  }

  if (trimmedSearch) {
    return sql`
      SELECT
        p.*,
        c.name AS category_name,
        c.slug AS category_slug
      FROM products p
      LEFT JOIN product_categories c ON c.id = p.category_id
      WHERE p.is_active = true
      AND p.name ILIKE ${`%${trimmedSearch}%`}
      ORDER BY p.name ASC;
    `;
  }

  if (trimmedCategory) {
    return sql`
      SELECT
        p.*,
        c.name AS category_name,
        c.slug AS category_slug
      FROM products p
      LEFT JOIN product_categories c ON c.id = p.category_id
      WHERE p.is_active = true
      AND c.slug = ${trimmedCategory}
      ORDER BY p.name ASC;
    `;
  }

  return sql`
    SELECT
      p.*,
      c.name AS category_name,
      c.slug AS category_slug
    FROM products p
    LEFT JOIN product_categories c ON c.id = p.category_id
    WHERE p.is_active = true
    ORDER BY p.name ASC;
  `;
}

export async function getAllProductsForAdmin() {
  return sql`
    SELECT
      p.*,
      c.name AS category_name,
      c.slug AS category_slug
    FROM products p
    LEFT JOIN product_categories c ON c.id = p.category_id
    ORDER BY p.created_at DESC;
  `;
}

export async function getProductById(id) {
  const rows = await sql`
    SELECT
      p.*,
      c.name AS category_name,
      c.slug AS category_slug
    FROM products p
    LEFT JOIN product_categories c ON c.id = p.category_id
    WHERE p.id = ${Number(id)}
    LIMIT 1;
  `;

  return rows[0];
}

export async function getProductBySlug(slug) {
  const rows = await sql`
    SELECT
      p.*,
      c.name AS category_name,
      c.slug AS category_slug
    FROM products p
    LEFT JOIN product_categories c ON c.id = p.category_id
    WHERE p.slug = ${slug}
    AND p.is_active = true
    LIMIT 1;
  `;

  return rows[0];
}

export async function createProduct(data) {
  const rows = await sql`
    INSERT INTO products (
      category_id,
      name,
      slug,
      description,
      price_cents,
      image_url,
      stock_quantity,
      is_active
    )
    VALUES (
      ${data.categoryId},
      ${data.name},
      ${data.slug},
      ${data.description},
      ${data.priceCents},
      ${data.imageUrl},
      ${data.stockQuantity},
      ${data.isActive}
    )
    RETURNING *;
  `;

  return rows[0];
}

export async function updateProduct(id, data) {
  const rows = await sql`
    UPDATE products
    SET
      category_id = ${data.categoryId},
      name = ${data.name},
      slug = ${data.slug},
      description = ${data.description},
      price_cents = ${data.priceCents},
      image_url = ${data.imageUrl},
      stock_quantity = ${data.stockQuantity},
      is_active = ${data.isActive},
      updated_at = NOW()
    WHERE id = ${Number(id)}
    RETURNING *;
  `;

  return rows[0];
}

export async function deleteProduct(id) {
  const rows = await sql`
    UPDATE products
    SET is_active = false, updated_at = NOW()
    WHERE id = ${Number(id)}
    RETURNING *;
  `;

  return rows[0];
}