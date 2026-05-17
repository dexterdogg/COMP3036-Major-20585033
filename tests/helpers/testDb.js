import bcrypt from 'bcryptjs';
import sql from '../../config/db.js';

export const TEST_PASSWORD = 'Password!1';

export const TEST_USERS = {
  student: {
    email: 'test.student@example.edu',
    password: TEST_PASSWORD,
    role: 'Student',
    firstName: 'Test',
    lastName: 'Student'
  },
  admin: {
    email: 'test.admin@example.edu',
    password: TEST_PASSWORD,
    role: 'Admin',
    firstName: 'Test',
    lastName: 'Admin'
  }
};

export const TEST_PRODUCTS = {
  headphones: {
    name: 'Test Wireless Headphones',
    slug: 'test-wireless-headphones',
    description: 'Noise-reducing headphones created for automated tests.',
    priceCents: 7995,
    imageUrl: 'https://placehold.co/600x400?text=Test+Headphones',
    stockQuantity: 20,
    categorySlug: 'test-electronics'
  },
  notebook: {
    name: 'Test Lecture Notebook',
    slug: 'test-lecture-notebook',
    description: 'Notebook created for cart and checkout tests.',
    priceCents: 1295,
    imageUrl: 'https://placehold.co/600x400?text=Test+Notebook',
    stockQuantity: 50,
    categorySlug: 'test-study-supplies'
  },
  hoodie: {
    name: 'Test Campus Hoodie',
    slug: 'test-campus-hoodie',
    description: 'Hoodie created for admin and product tests.',
    priceCents: 5995,
    imageUrl: 'https://placehold.co/600x400?text=Test+Hoodie',
    stockQuantity: 15,
    categorySlug: 'test-clothing'
  }
};

async function upsertUser(user) {
  const passwordHash = await bcrypt.hash(user.password, 10);

  await sql`
    INSERT INTO users (
      email,
      password_hash,
      role,
      first_name,
      last_name
    )
    VALUES (
      ${user.email},
      ${passwordHash},
      ${user.role},
      ${user.firstName},
      ${user.lastName}
    )
    ON CONFLICT (email)
    DO UPDATE SET
      password_hash = EXCLUDED.password_hash,
      role = EXCLUDED.role,
      first_name = EXCLUDED.first_name,
      last_name = EXCLUDED.last_name;
  `;
}

async function upsertCategory(name, slug) {
  const rows = await sql`
    INSERT INTO product_categories (name, slug)
    VALUES (${name}, ${slug})
    ON CONFLICT (slug)
    DO UPDATE SET name = EXCLUDED.name
    RETURNING id;
  `;

  return rows[0].id;
}

async function upsertProduct(product) {
  const categoryRows = await sql`
    SELECT id
    FROM product_categories
    WHERE slug = ${product.categorySlug}
    LIMIT 1;
  `;

  const categoryId = categoryRows[0].id;

  await sql`
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
      ${categoryId},
      ${product.name},
      ${product.slug},
      ${product.description},
      ${product.priceCents},
      ${product.imageUrl},
      ${product.stockQuantity},
      true
    )
    ON CONFLICT (slug)
    DO UPDATE SET
      category_id = EXCLUDED.category_id,
      name = EXCLUDED.name,
      description = EXCLUDED.description,
      price_cents = EXCLUDED.price_cents,
      image_url = EXCLUDED.image_url,
      stock_quantity = EXCLUDED.stock_quantity,
      is_active = true,
      updated_at = NOW();
  `;
}

export async function resetStoreState() {
  const testUsers = [
    TEST_USERS.student.email,
    TEST_USERS.admin.email
  ];

  const userRows = await sql`
    SELECT id
    FROM users
    WHERE email IN ${sql(testUsers)};
  `;

  const userIds = userRows.map((user) => user.id);

  if (userIds.length > 0) {
    await sql`
      DELETE FROM purchase_items
      WHERE purchase_id IN (
        SELECT id
        FROM purchases
        WHERE user_id IN ${sql(userIds)}
      );
    `;

    await sql`
      DELETE FROM purchases
      WHERE user_id IN ${sql(userIds)};
    `;

    await sql`
      DELETE FROM cart_items
      WHERE cart_id IN (
        SELECT id
        FROM carts
        WHERE user_id IN ${sql(userIds)}
      );
    `;

    await sql`
      DELETE FROM carts
      WHERE user_id IN ${sql(userIds)};
    `;
  }

  await sql`
    DELETE FROM products
    WHERE slug LIKE 'test-%';
  `;

  await sql`
    DELETE FROM product_categories
    WHERE slug LIKE 'test-%';
  `;
}

export async function seedStoreTestData() {
  await upsertUser(TEST_USERS.student);
  await upsertUser(TEST_USERS.admin);

  await upsertCategory('Test Electronics', 'test-electronics');
  await upsertCategory('Test Study Supplies', 'test-study-supplies');
  await upsertCategory('Test Clothing', 'test-clothing');

  await upsertProduct(TEST_PRODUCTS.headphones);
  await upsertProduct(TEST_PRODUCTS.notebook);
  await upsertProduct(TEST_PRODUCTS.hoodie);
}

export async function getTestProduct(slug) {
  const rows = await sql`
    SELECT *
    FROM products
    WHERE slug = ${slug}
    LIMIT 1;
  `;

  return rows[0];
}

export async function closeDb() {
  await sql.end();
}