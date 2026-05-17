import { test, expect } from '@playwright/test';

test.describe('Iteration 1 B2C Store E2E Flow', () => {
  test('student can browse products, add to cart, checkout, and view orders', async ({ page }) => {
    await page.goto('/login');

    await page.getByLabel(/email/i).fill('test.student@example.edu');
    await page.getByLabel(/password/i).fill('Password!1');
    await page.getByRole('button', { name: /login|sign in/i }).click();

    await expect(page).toHaveURL(/\/profile/);

    await page.goto('/products');

    await expect(page.getByRole('heading', { name: /products/i })).toBeVisible();
    await expect(page.getByText(/Test Wireless Headphones/i)).toBeVisible();

    await page.getByLabel(/search/i).fill('notebook');
    await page.getByRole('button', { name: /apply filters|search/i }).click();

    await expect(page.getByText(/Test Lecture Notebook/i)).toBeVisible();

    const productCard = page.locator('.product-card').filter({
      hasText: 'Test Lecture Notebook'
    });

    await productCard.getByLabel(/quantity/i).fill('2');
    await productCard.getByRole('button', { name: /add to cart/i }).click();

    await expect(page).toHaveURL(/\/cart/);
    await expect(page.getByText(/Test Lecture Notebook/i)).toBeVisible();

    await page.getByRole('link', { name: /checkout/i }).click();

    await expect(page).toHaveURL(/\/checkout/);
    await page.getByLabel(/cardholder name/i).fill('Test Student');
    await page.getByRole('button', { name: /pay|mock payment/i }).click();

    await expect(page.getByText(/order confirmed/i)).toBeVisible();

    await page.getByRole('link', { name: /view orders/i }).click();

    await expect(page).toHaveURL(/\/orders/);
    await expect(page.getByRole('heading', { name: /my orders/i })).toBeVisible();
  });

  test('admin can log in and access the admin product dashboard', async ({ page }) => {
    await page.goto('/login');

    await page.getByLabel(/email/i).fill('test.admin@example.edu');
    await page.getByLabel(/password/i).fill('Password!1');
    await page.getByRole('button', { name: /login|sign in/i }).click();

    await expect(page).toHaveURL(/\/profile/);

    await page.goto('/admin/products');

    await expect(page.getByRole('heading', { name: /admin dashboard|admin products/i })).toBeVisible();
    await expect(page.getByText(/purchase records/i)).toBeVisible();
  });
});