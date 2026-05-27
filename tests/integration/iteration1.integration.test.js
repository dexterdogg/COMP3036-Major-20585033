import { after, before, beforeEach, suite, test } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';

import { app, runningServer } from '../../app.js';
import sql from '../../config/db.js';

import {
  closeDb,
  getTestProduct,
  resetStoreState,
  seedStoreTestData,
  TEST_USERS
} from '../helpers/testDb.js';

import {
  loginAsAdmin,
  loginAsStudent
} from '../helpers/auth.js';

suite('Iteration 1 B2C Store Integration Tests', () => {
  before(async () => {
    await resetStoreState();
    await seedStoreTestData();
  });

  beforeEach(async () => {
    await resetStoreState();
    await seedStoreTestData();
  });

  suite('Existing authentication and account behaviour', () => {
    test('GET /login renders login page', async () => {
      const res = await request(app).get('/login');

      assert.equal(res.status, 200);
      assert.match(res.text, /login/i);
    });

    test('POST /login rejects invalid credentials', async () => {
      const res = await request(app)
        .post('/login')
        .type('form')
        .send({
          email: 'wrong@example.edu',
          password: 'wrong-password'
        });

      assert.equal(res.status, 401);
      assert.match(res.text, /invalid/i);
    });

    test('registration cannot create admin users', async () => {
      const res = await request(app)
        .post('/register')
        .type('form')
        .send({
          firstName: 'Malicious',
          lastName: 'User',
          email: 'malicious@example.edu',
          password: 'Password123',
          role: 'Admin',
        });
    
      assert.equal(res.status, 302);
    
      const rows = await sql`
        SELECT role FROM users WHERE email = 'malicious@example.edu' LIMIT 1;
      `;
    
      assert.equal(rows[0].role, 'Student');
    });

    test('POST /login accepts valid student credentials and sets auth cookie', async () => {
      const res = await request(app)
        .post('/login')
        .type('form')
        .send({
          email: TEST_USERS.student.email,
          password: TEST_USERS.student.password
        });

      const cookies = res.headers['set-cookie'] || [];

      assert.equal(res.status, 302);
      assert.match(res.headers.location, /\/profile$/);
      assert.ok(cookies.join(';').includes('auth='));
    });

    test('GET /profile redirects unauthenticated users to login', async () => {
      const res = await request(app).get('/profile');

      assert.equal(res.status, 302);
      assert.match(res.headers.location, /\/login$/);
    });

    test('GET /profile loads for authenticated users', async () => {
      const agent = await loginAsStudent(app);
      const res = await agent.get('/profile');

      assert.equal(res.status, 200);
      assert.match(res.text, /account|profile/i);
    });
  });

  suite('Product catalogue', () => {
    test('GET /products returns the product catalogue page', async () => {
      const res = await request(app).get('/products');

      assert.equal(res.status, 200);
      assert.match(res.text, /Products/i);
      assert.match(res.text, /Test Wireless Headphones/i);
      assert.match(res.text, /Test Lecture Notebook/i);
    });

    test('GET /products supports searching by product name', async () => {
      const res = await request(app).get('/products?search=headphones');

      assert.equal(res.status, 200);
      assert.match(res.text, /Test Wireless Headphones/i);
      assert.doesNotMatch(res.text, /Test Lecture Notebook/i);
    });

    test('GET /products supports category filtering', async () => {
      const res = await request(app).get('/products?category=test-electronics');

      assert.equal(res.status, 200);
      assert.match(res.text, /Test Wireless Headphones/i);
      assert.doesNotMatch(res.text, /Test Campus Hoodie/i);
    });

    test('GET /products/:slug returns a product detail page', async () => {
      const res = await request(app).get('/products/test-wireless-headphones');

      assert.equal(res.status, 200);
      assert.match(res.text, /Test Wireless Headphones/i);
      assert.match(res.text, /Noise-reducing headphones/i);
    });

    test('GET /products/:slug returns 404 for missing product', async () => {
      const res = await request(app).get('/products/not-a-real-product');

      assert.equal(res.status, 404);
    });
  });

  suite('Public product API', () => {
    test('GET /api/products returns JSON products', async () => {
      const res = await request(app)
        .get('/api/products')
        .expect('Content-Type', /json/);

      assert.equal(res.status, 200);
      assert.ok(Array.isArray(res.body.products));
      assert.ok(
        res.body.products.some((product) => {
          return product.slug === 'test-wireless-headphones';
        })
      );
    });

    test('GET /api/products supports search query', async () => {
      const res = await request(app)
        .get('/api/products?search=headphones')
        .expect('Content-Type', /json/);

      assert.equal(res.status, 200);
      assert.ok(
        res.body.products.every((product) => {
          return product.name.toLowerCase().includes('headphones');
        })
      );
    });

    test('GET /api/products/:id returns one product', async () => {
      const product = await getTestProduct('test-wireless-headphones');

      const res = await request(app)
        .get(`/api/products/${product.id}`)
        .expect('Content-Type', /json/);

      assert.equal(res.status, 200);
      assert.equal(res.body.product.id, product.id);
      assert.equal(res.body.product.slug, 'test-wireless-headphones');
    });

    test('GET /api/products/:id returns 404 for missing product', async () => {
      const res = await request(app)
        .get('/api/products/999999')
        .expect('Content-Type', /json/);

      assert.equal(res.status, 404);
    });
  });

  suite('Shopping cart', () => {
    test('GET /cart redirects unauthenticated users', async () => {
      const res = await request(app).get('/cart');

      assert.equal(res.status, 302);
      assert.match(res.headers.location, /\/login$/);
    });

    test('authenticated user can view an empty cart', async () => {
      const agent = await loginAsStudent(app);
      const res = await agent.get('/cart');

      assert.equal(res.status, 200);
      assert.match(res.text, /cart/i);
    });

    test('authenticated user can add product to cart', async () => {
      const agent = await loginAsStudent(app);
      const product = await getTestProduct('test-lecture-notebook');

      const addRes = await agent
        .post('/cart/items')
        .type('form')
        .send({
          productId: product.id,
          quantity: 2
        });

      assert.equal(addRes.status, 302);
      assert.match(addRes.headers.location, /\/cart$/);

      const cartRes = await agent.get('/cart');

      assert.equal(cartRes.status, 200);
      assert.match(cartRes.text, /Test Lecture Notebook/i);
    });

    test('authenticated user can update cart quantity', async () => {
      const agent = await loginAsStudent(app);
      const product = await getTestProduct('test-lecture-notebook');

      await agent
        .post('/cart/items')
        .type('form')
        .send({
          productId: product.id,
          quantity: 1
        });

      const updateRes = await agent
        .post(`/cart/items/${product.id}/update`)
        .type('form')
        .send({
          quantity: 3
        });

      assert.equal(updateRes.status, 302);

      const rows = await sql`
        SELECT ci.quantity
        FROM cart_items ci
        INNER JOIN carts c ON c.id = ci.cart_id
        INNER JOIN users u ON u.id = c.user_id
        WHERE u.email = ${TEST_USERS.student.email}
        AND ci.product_id = ${product.id}
        AND c.status = 'active'
        LIMIT 1;
      `;

      assert.equal(rows[0].quantity, 3);
    });

    test('authenticated user can remove cart item', async () => {
      const agent = await loginAsStudent(app);
      const product = await getTestProduct('test-lecture-notebook');

      await agent
        .post('/cart/items')
        .type('form')
        .send({
          productId: product.id,
          quantity: 1
        });

      const deleteRes = await agent
        .post(`/cart/items/${product.id}/delete`)
        .type('form')
        .send();

      assert.equal(deleteRes.status, 302);

      const rows = await sql`
        SELECT ci.id
        FROM cart_items ci
        INNER JOIN carts c ON c.id = ci.cart_id
        INNER JOIN users u ON u.id = c.user_id
        WHERE u.email = ${TEST_USERS.student.email}
        AND ci.product_id = ${product.id}
        AND c.status = 'active';
      `;

      assert.equal(rows.length, 0);
    });

    test('cart rejects quantities above stock', async () => {
      const agent = await loginAsStudent(app);
      const product = await getTestProduct('test-lecture-notebook');

      const res = await agent
        .post('/cart/items')
        .type('form')
        .send({
          productId: product.id,
          quantity: 999
        });

      assert.equal(res.status, 302);
      assert.match(res.headers.location, /\/products/);
    });
  });

  suite('Checkout and purchase records', () => {
    test('GET /checkout redirects unauthenticated users', async () => {
      const res = await request(app).get('/checkout');

      assert.equal(res.status, 302);
      assert.match(res.headers.location, /\/login$/);
    });

    test('GET /checkout redirects authenticated user with empty cart back to cart', async () => {
      const agent = await loginAsStudent(app);
      const res = await agent.get('/checkout');

      assert.equal(res.status, 302);
      assert.match(res.headers.location, /\/cart/);
    });

    test('authenticated user can complete mock checkout', async () => {
      const agent = await loginAsStudent(app);
      const product = await getTestProduct('test-lecture-notebook');

      await agent
        .post('/cart/items')
        .type('form')
        .send({
          productId: product.id,
          quantity: 2
        });

      const checkoutRes = await agent
        .post('/checkout')
        .type('form')
        .send({
          cardholderName: 'Test Student'
        });

      assert.equal(checkoutRes.status, 200);
      assert.match(checkoutRes.text, /Order Confirmed|Order/i);

      const purchases = await sql`
        SELECT p.*
        FROM purchases p
        INNER JOIN users u ON u.id = p.user_id
        WHERE u.email = ${TEST_USERS.student.email}
        ORDER BY p.created_at DESC;
      `;

      assert.equal(purchases.length, 1);
      assert.equal(Number(purchases[0].total_cents), product.price_cents * 2);

      const purchaseItems = await sql`
        SELECT *
        FROM purchase_items
        WHERE purchase_id = ${purchases[0].id};
      `;

      assert.equal(purchaseItems.length, 1);
      assert.equal(Number(purchaseItems[0].quantity), 2);
      assert.equal(Number(purchaseItems[0].line_total_cents), product.price_cents * 2);
    });

    test('checkout reduces product stock', async () => {
      const agent = await loginAsStudent(app);
      const beforeProduct = await getTestProduct('test-lecture-notebook');

      await agent
        .post('/cart/items')
        .type('form')
        .send({
          productId: beforeProduct.id,
          quantity: 4
        });

      await agent
        .post('/checkout')
        .type('form')
        .send({
          cardholderName: 'Test Student'
        });

      const afterProduct = await getTestProduct('test-lecture-notebook');

      assert.equal(
        Number(afterProduct.stock_quantity),
        Number(beforeProduct.stock_quantity) - 4
      );
    });

    test('GET /orders displays purchase history for logged in user', async () => {
      const agent = await loginAsStudent(app);
      const product = await getTestProduct('test-lecture-notebook');

      await agent
        .post('/cart/items')
        .type('form')
        .send({
          productId: product.id,
          quantity: 1
        });

      await agent
        .post('/checkout')
        .type('form')
        .send({
          cardholderName: 'Test Student'
        });

      const ordersRes = await agent.get('/orders');

      assert.equal(ordersRes.status, 200);
      assert.match(ordersRes.text, /orders/i);
      assert.match(ordersRes.text, /#|Order/i);
    });

    test('GET /api/me/purchases returns logged-in user purchases', async () => {
      const agent = await loginAsStudent(app);
      const product = await getTestProduct('test-lecture-notebook');

      await agent
        .post('/cart/items')
        .type('form')
        .send({
          productId: product.id,
          quantity: 1
        });

      await agent
        .post('/checkout')
        .type('form')
        .send({
          cardholderName: 'Test Student'
        });

      const res = await agent
        .get('/api/me/purchases')
        .expect('Content-Type', /json/);

      assert.equal(res.status, 200);
      assert.ok(Array.isArray(res.body.purchases));
      assert.ok(res.body.purchases.length >= 1);
    });
  });

  suite('Admin product management', () => {
    test('normal user cannot access admin product dashboard', async () => {
      const agent = await loginAsStudent(app);

      const res = await agent.get('/admin/products');

      assert.equal(res.status, 403);
    });

    test('admin can access admin product dashboard', async () => {
      const agent = await loginAsAdmin(app);

      const res = await agent.get('/admin/products');

      assert.equal(res.status, 200);
      assert.match(res.text, /Admin|Products/i);
    });

    test('admin can create a product through dashboard form', async () => {
      const agent = await loginAsAdmin(app);

      const category = await sql`
        SELECT id
        FROM product_categories
        WHERE slug = 'test-electronics'
        LIMIT 1;
      `;

      const res = await agent
        .post('/admin/products')
        .type('form')
        .send({
          name: 'Test Admin Created Product',
          slug: 'test-admin-created-product',
          categoryId: category[0].id,
          description: 'Created by an automated integration test.',
          price: '34.95',
          imageUrl: 'https://placehold.co/600x400?text=Admin+Product',
          stockQuantity: 12,
          isActive: 'on'
        });

      assert.equal(res.status, 302);

      const product = await getTestProduct('test-admin-created-product');

      assert.equal(product.name, 'Test Admin Created Product');
      assert.equal(Number(product.price_cents), 3495);
    });

    test('admin can update a product through dashboard form', async () => {
      const agent = await loginAsAdmin(app);
      const product = await getTestProduct('test-campus-hoodie');

      const category = await sql`
        SELECT id
        FROM product_categories
        WHERE slug = 'test-clothing'
        LIMIT 1;
      `;

      const res = await agent
        .post(`/admin/products/${product.id}/update`)
        .type('form')
        .send({
          name: 'Test Updated Campus Hoodie',
          slug: 'test-campus-hoodie',
          categoryId: category[0].id,
          description: 'Updated by an automated integration test.',
          price: '64.95',
          imageUrl: 'https://placehold.co/600x400?text=Updated+Hoodie',
          stockQuantity: 9,
          isActive: 'on'
        });

      assert.equal(res.status, 302);

      const updatedProduct = await getTestProduct('test-campus-hoodie');

      assert.equal(updatedProduct.name, 'Test Updated Campus Hoodie');
      assert.equal(Number(updatedProduct.price_cents), 6495);
      assert.equal(Number(updatedProduct.stock_quantity), 9);
    });

    test('admin can deactivate a product', async () => {
      const agent = await loginAsAdmin(app);
      const product = await getTestProduct('test-campus-hoodie');

      const res = await agent
        .post(`/admin/products/${product.id}/delete`)
        .type('form')
        .send();

      assert.equal(res.status, 302);

      const rows = await sql`
        SELECT is_active
        FROM products
        WHERE id = ${product.id}
        LIMIT 1;
      `;

      assert.equal(rows[0].is_active, false);
    });

    test('admin product API rejects unauthenticated users', async () => {
      const res = await request(app)
        .get('/api/admin/products');

      assert.equal(res.status, 302);
      assert.match(res.headers.location, /\/login$/);
    });

    test('admin can list products through API', async () => {
      const agent = await loginAsAdmin(app);

      const res = await agent
        .get('/api/admin/products')
        .expect('Content-Type', /json/);

      assert.equal(res.status, 200);
      assert.ok(Array.isArray(res.body.products));
    });

    test('admin can create product through API', async () => {
      const agent = await loginAsAdmin(app);

      const category = await sql`
        SELECT id
        FROM product_categories
        WHERE slug = 'test-electronics'
        LIMIT 1;
      `;

      const res = await agent
        .post('/api/admin/products')
        .send({
          categoryId: category[0].id,
          name: 'Test API Product',
          slug: 'test-api-product',
          description: 'Created using admin product API.',
          price: 44.95,
          imageUrl: 'https://placehold.co/600x400?text=API+Product',
          stockQuantity: 11,
          isActive: true
        })
        .expect('Content-Type', /json/);

      assert.equal(res.status, 201);
      assert.equal(res.body.product.name, 'Test API Product');
      assert.equal(Number(res.body.product.price_cents), 4495);
    });

    test('admin can retrieve purchase records through API', async () => {
      const student = await loginAsStudent(app);
      const product = await getTestProduct('test-lecture-notebook');

      await student
        .post('/cart/items')
        .type('form')
        .send({
          productId: product.id,
          quantity: 1
        });

      await student
        .post('/checkout')
        .type('form')
        .send({
          cardholderName: 'Test Student'
        });

      const admin = await loginAsAdmin(app);

      const res = await admin
        .get('/api/admin/purchases')
        .expect('Content-Type', /json/);

      assert.equal(res.status, 200);
      assert.ok(Array.isArray(res.body.purchases));
      assert.ok(res.body.purchases.length >= 1);
    });
  });

  after(async () => {
    await resetStoreState();
    await closeDb();
    await runningServer.close();
  });
});