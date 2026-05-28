import { test, expect } from '@playwright/test';

const seededUsers = {
  student: {
    email: 'student1@example.edu',
    password: 'Stud123',
  },
  admin: {
    email: 'admin1@example.edu',
    password: 'Admin123',
  },
};

function uniqueSuffix() {
  return `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function login(page, user) {
  await page.context().clearCookies();

  await page.goto('/login');

  await expect(page.locator('input[name="email"]')).toBeVisible();
  await page.locator('input[name="email"]').fill(user.email);

  await expect(page.locator('input[name="password"]')).toBeVisible();
  await page.locator('input[name="password"]').fill(user.password);

  await page.getByRole('button', { name: /log in/i }).click();

  await expect(page).toHaveURL(/\/profile$/);
  await expect(page.getByRole('heading', { name: /my account/i })).toBeVisible();
}

async function registerStudent(page) {
  const suffix = uniqueSuffix();
  const email = `e2e.student.${suffix}@example.edu`;

  await page.goto('/register');

  await expect(page.getByRole('heading', { name: /register/i })).toBeVisible();

  await page.locator('input[name="firstName"]').fill('E2E');
  await page.locator('input[name="lastName"]').fill('Student');
  await page.locator('input[name="email"]').fill(email);
  await page.locator('input[name="password"]').fill('Password123');

  await page.getByRole('button', { name: /create account/i }).click();

  await expect(page).toHaveURL(/\/profile$/);
  await expect(page.getByText(email)).toBeVisible();
  await expect(page.locator('.status-pill').filter({ hasText: /^Student$/ })).toBeVisible();

  return email;
}

async function emptyCart(page) {
  await page.goto('/cart');

  for (let attempt = 0; attempt < 10; attempt += 1) {
    const removeButtons = page.getByRole('button', { name: /remove/i });

    if ((await removeButtons.count()) === 0) {
      break;
    }

    await removeButtons.first().click();
    await page.waitForLoadState('domcontentloaded');
  }

  await expect(page.getByRole('heading', { name: /your cart/i })).toBeVisible();
}

async function getContainerByText(page, text) {
  const pattern = new RegExp(escapeRegExp(text), 'i');

  const tableRow = page.locator('tr').filter({ hasText: pattern }).first();

  if ((await tableRow.count()) > 0) {
    return tableRow;
  }

  return page
    .locator('form, article, section, div')
    .filter({ hasText: pattern })
    .first();
}

async function addProductToCart(page, productName, quantity = '1') {
  await page.goto(`/products?search=${encodeURIComponent(productName)}`);

  await expect(page.getByText(new RegExp(escapeRegExp(productName), 'i'))).toBeVisible();

  const productContainer = await getContainerByText(page, productName);
  const quantityInput = productContainer.locator('input[name="quantity"]').first();

  if ((await quantityInput.count()) > 0) {
    await quantityInput.fill(quantity);
  }

  const addButton = productContainer.getByRole('button', { name: /add to cart/i }).first();

  await addButton.click();

  await expect(page).toHaveURL(/\/cart/);
  await expect(page.getByText(new RegExp(escapeRegExp(productName), 'i'))).toBeVisible();
}

async function fillAdminProductForm(page, product) {
  await page.locator('input[name="name"]').fill(product.name);
  await page.locator('input[name="slug"]').fill(product.slug);

  const categorySelect = page.locator('select[name="categoryId"]');

  if ((await categorySelect.count()) > 0) {
    await categorySelect.selectOption({ label: product.categoryLabel }).catch(async () => {
      await categorySelect.selectOption({ index: 1 });
    });
  }

  await page.locator('textarea[name="description"]').fill(product.description);
  await page.locator('input[name="price"]').fill(product.price);
  await page.locator('input[name="imageUrl"]').fill(product.imageUrl);
  await page.locator('input[name="stockQuantity"]').fill(product.stockQuantity);

  const activeCheckbox = page.locator('input[name="isActive"]');

  if ((await activeCheckbox.count()) > 0 && !(await activeCheckbox.isChecked())) {
    await activeCheckbox.check();
  }
}

test.describe('Iteration 2 B2C Store E2E Coverage', () => {
  test('guest and account flow protects private pages and creates student accounts', async ({ page }) => {
    await page.goto('/products');

    await expect(page.getByRole('heading', { name: /products/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /login to buy/i }).first()).toBeVisible();

    for (const protectedPath of ['/cart', '/checkout', '/orders']) {
      await page.goto(protectedPath);
      await expect(page).toHaveURL(/\/login/);
    }

    await registerStudent(page);

    await expect(page.getByRole('link', { name: /admin/i })).toHaveCount(0);
  });

  test('guest can browse products, search, filter by category, and open product details', async ({
    page,
  }) => {
    await page.goto('/products');

    await expect(page.getByRole('heading', { name: /products/i })).toBeVisible();
    await expect(page.getByText(/Wireless Study Headphones/i)).toBeVisible();
    await expect(page.getByText(/Premium Lecture Notebook/i)).toBeVisible();

    await page.goto('/products?search=notebook');

    await expect(page.getByText(/Premium Lecture Notebook/i)).toBeVisible();
    await expect(page.getByText(/Wireless Study Headphones/i)).toHaveCount(0);

    await page.goto('/products?category=electronics');

    await expect(page.getByText(/Wireless Study Headphones/i)).toBeVisible();
    await expect(page.getByText(/USB-C Laptop Hub/i)).toBeVisible();
    await expect(page.getByText(/Premium Lecture Notebook/i)).toHaveCount(0);

    await page.goto('/products/wireless-study-headphones');

    await expect(
      page.getByRole('heading', { name: /wireless study headphones/i }),
    ).toBeVisible();

    await expect(page.getByText(/Bluetooth headphones/i)).toBeVisible();
    await expect(page.getByText(/available/i)).toBeVisible();
  });

  test('student can add products, update quantities, and remove cart items', async ({ page }) => {
    await login(page, seededUsers.student);
    await emptyCart(page);

    await addProductToCart(page, 'Premium Lecture Notebook', '1');

    const cartItem = await getContainerByText(page, 'Premium Lecture Notebook');

    await cartItem.locator('input[name="quantity"]').fill('3');
    await cartItem.getByRole('button', { name: /update/i }).click();

    await page.waitForLoadState('domcontentloaded');

    const updatedCartItem = await getContainerByText(page, 'Premium Lecture Notebook');

    await expect(updatedCartItem.locator('input[name="quantity"]').first()).toHaveValue('3');

    await updatedCartItem.getByRole('button', { name: /remove/i }).click();

    await page.waitForLoadState('domcontentloaded');

    await expect(page.getByText(/your cart is empty/i)).toBeVisible();
  });

  test('student can complete checkout, view order history, open order detail, and use purchase API', async ({
    page,
  }) => {
    await login(page, seededUsers.student);
    await emptyCart(page);

    await addProductToCart(page, 'Premium Lecture Notebook', '2');

    await page.getByRole('link', { name: /checkout/i }).click();

    await expect(page).toHaveURL(/\/checkout/);
    await expect(page.getByRole('heading', { name: /checkout/i })).toBeVisible();
    await expect(page.getByText(/order summary/i)).toBeVisible();

    const cardholderNameInput = page.locator('input[name="cardholderName"]');

    await expect(cardholderNameInput).toBeVisible();

    expect(
      await cardholderNameInput.evaluate((input) => input.required),
    ).toBe(true);

    expect(
      await cardholderNameInput.evaluate((input) => input.checkValidity()),
    ).toBe(false);

    await page.getByRole('button', { name: /pay/i }).click();

    await expect(page).toHaveURL(/\/checkout/);

    await cardholderNameInput.fill('E2E Student');
    await page.getByRole('button', { name: /pay/i }).click();

    await expect(page.getByRole('heading', { name: /order confirmed/i })).toBeVisible();
    await expect(page.getByText(/mock payment was accepted/i)).toBeVisible();

    const purchasesResponse = await page.context().request.get('/api/me/purchases');

    expect(purchasesResponse.status()).toBe(200);

    const purchasesPayload = await purchasesResponse.json();

    expect(Array.isArray(purchasesPayload.purchases)).toBe(true);
    expect(purchasesPayload.purchases.length).toBeGreaterThan(0);

    await page.getByRole('link', { name: /view orders/i }).click();

    await expect(page).toHaveURL(/\/orders/);
    await expect(page.getByRole('heading', { name: /my orders/i })).toBeVisible();

    const firstOrderLink = page.locator('a[href^="/orders/"]').first();

    await expect(firstOrderLink).toBeVisible();

    await firstOrderLink.click();

    await expect(page).toHaveURL(/\/orders\/\d+/);
    await expect(page.getByRole('heading', { name: /order #/i })).toBeVisible();
    await expect(page.getByText(/Premium Lecture Notebook/i)).toBeVisible();
    await expect(page.getByText(/order total/i)).toBeVisible();
  });

  test('admin UI can create, edit, deactivate products, and hide inactive products publicly', async ({
    page,
  }) => {
    const suffix = uniqueSuffix();

    const product = {
      name: `E2E Admin Product ${suffix}`,
      slug: `e2e-admin-product-${suffix}`,
      categoryLabel: 'Electronics',
      description: 'Created by a Playwright E2E test.',
      price: '19.95',
      imageUrl: 'https://placehold.co/600x400?text=E2E+Product',
      stockQuantity: '15',
    };

    const updatedProduct = {
      ...product,
      name: `E2E Updated Product ${suffix}`,
      description: 'Updated by a Playwright E2E test.',
      price: '24.95',
      stockQuantity: '8',
    };

    await login(page, seededUsers.student);

    const forbiddenResponse = await page.goto('/admin/products');

    expect(forbiddenResponse.status()).toBe(403);

    await expect(
      page.getByRole('heading', { name: /you do not have permission/i }),
    ).toBeVisible();

    await expect(page.getByText(/status code:\s*403/i)).toBeVisible();

    await login(page, seededUsers.admin);

    await page.goto('/admin/products');

    await expect(
      page.getByRole('heading', { name: /admin dashboard|admin products/i }),
    ).toBeVisible();

    await expect(page.getByRole('heading', { name: /purchase records/i })).toBeVisible();

    await fillAdminProductForm(page, product);

    await page.getByRole('button', { name: /create product/i }).click();

    await expect(page).toHaveURL(/\/admin\/products/);
    await expect(page.getByText(product.name)).toBeVisible();

    const createdProductRow = await getContainerByText(page, product.name);

    await createdProductRow.getByRole('link', { name: /edit/i }).click();

    await expect(page.getByRole('heading', { name: /edit product/i })).toBeVisible();

    await fillAdminProductForm(page, updatedProduct);

    await page.getByRole('button', { name: /save product/i }).click();

    await expect(page).toHaveURL(/\/admin\/products/);
    await expect(page.getByText(updatedProduct.name)).toBeVisible();

    const updatedProductRow = await getContainerByText(page, updatedProduct.name);

    await updatedProductRow.getByRole('button', { name: /deactivate/i }).click();

    await page.waitForLoadState('domcontentloaded');

    const deactivatedProductRow = await getContainerByText(page, updatedProduct.name);

    await expect(deactivatedProductRow.getByText(/no/i)).toBeVisible();

    await page.goto(`/products?search=${encodeURIComponent(updatedProduct.name)}`);

    await expect(page.getByText(updatedProduct.name)).toHaveCount(0);
    await expect(page.getByText(/no products matched/i)).toBeVisible();
  });

  test('store API supports product catalogue and admin product management', async ({
    page,
    request,
  }) => {
    const publicProductsResponse = await request.get('/api/products');

    expect(publicProductsResponse.status()).toBe(200);

    const publicProductsPayload = await publicProductsResponse.json();

    expect(Array.isArray(publicProductsPayload.products)).toBe(true);
    expect(publicProductsPayload.products.length).toBeGreaterThan(0);

    const notebookSearchResponse = await request.get('/api/products?search=notebook');

    expect(notebookSearchResponse.status()).toBe(200);

    const notebookSearchPayload = await notebookSearchResponse.json();

    expect(
      notebookSearchPayload.products.some((product) => {
        return /notebook/i.test(product.name);
      }),
    ).toBe(true);

    const firstPublicProduct = publicProductsPayload.products[0];
    const singleProductResponse = await request.get(`/api/products/${firstPublicProduct.id}`);

    expect(singleProductResponse.status()).toBe(200);

    const guestAdminResponse = await request.get('/api/admin/products', {
      maxRedirects: 0,
    });

    expect(guestAdminResponse.status()).toBe(302);
    expect(guestAdminResponse.headers().location).toMatch(/\/login/);

    await login(page, seededUsers.admin);

    const adminProductsResponse = await page.context().request.get('/api/admin/products');

    expect(adminProductsResponse.status()).toBe(200);

    const adminProductsPayload = await adminProductsResponse.json();

    const categoryId =
      adminProductsPayload.products.find((product) => product.category_id)?.category_id ||
      adminProductsPayload.products[0].category_id;

    const suffix = uniqueSuffix();

    const createResponse = await page.context().request.post('/api/admin/products', {
      data: {
        categoryId,
        name: `E2E API Product ${suffix}`,
        slug: `e2e-api-product-${suffix}`,
        description: 'Created through the admin API by Playwright.',
        price: 31.95,
        imageUrl: 'https://placehold.co/600x400?text=E2E+API+Product',
        stockQuantity: 13,
        isActive: true,
      },
    });

    expect(createResponse.status()).toBe(201);

    const createPayload = await createResponse.json();
    const createdProduct = createPayload.product;

    expect(createdProduct.name).toBe(`E2E API Product ${suffix}`);
    expect(Number(createdProduct.price_cents)).toBe(3195);

    const updateResponse = await page.context().request.put(
      `/api/admin/products/${createdProduct.id}`,
      {
        data: {
          categoryId,
          name: `E2E API Product Updated ${suffix}`,
          slug: `e2e-api-product-${suffix}`,
          description: 'Updated through the admin API by Playwright.',
          price: 35.5,
          imageUrl: 'https://placehold.co/600x400?text=Updated+API+Product',
          stockQuantity: 7,
          isActive: true,
        },
      },
    );

    expect(updateResponse.status()).toBe(200);

    const updatePayload = await updateResponse.json();

    expect(updatePayload.product.name).toBe(`E2E API Product Updated ${suffix}`);
    expect(Number(updatePayload.product.price_cents)).toBe(3550);
    expect(Number(updatePayload.product.stock_quantity)).toBe(7);

    const deleteResponse = await page.context().request.delete(
      `/api/admin/products/${createdProduct.id}`,
    );

    expect(deleteResponse.status()).toBe(200);

    const deletePayload = await deleteResponse.json();

    expect(deletePayload.product.is_active).toBe(false);

    const adminPurchasesResponse = await page.context().request.get('/api/admin/purchases');

    expect(adminPurchasesResponse.status()).toBe(200);

    const adminPurchasesPayload = await adminPurchasesResponse.json();

    expect(Array.isArray(adminPurchasesPayload.purchases)).toBe(true);
  });
});