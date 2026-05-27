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

async function login(page, user) {
  await page.goto('/login');

  await expect(page.locator('input[name="email"]')).toBeVisible();
  await page.locator('input[name="email"]').fill(user.email);

  await expect(page.locator('input[name="password"]')).toBeVisible();
  await page.locator('input[name="password"]').fill(user.password);

  await page.locator('button[type="submit"], input[type="submit"]').click();

  await expect(page).toHaveURL(/\/profile/);
}

test.describe('Iteration 1 B2C Store E2E Flow', () => {
  test('student can browse products, add to cart, checkout, and view orders', async ({ page }) => {
    await login(page, seededUsers.student);

    await page.goto('/products');

    await expect(page.getByRole('heading', { name: /products/i })).toBeVisible();
    await expect(page.getByText(/Wireless Study Headphones/i)).toBeVisible();

    await page.goto('/products?search=notebook');

    await expect(page.getByText(/Premium Lecture Notebook/i)).toBeVisible();

    const notebookSection = page
      .locator('form, article, section, div')
      .filter({ hasText: /Premium Lecture Notebook/i })
      .first();

    const quantityInput = notebookSection.locator('input[name="quantity"]').first();

    if (await quantityInput.count()) {
      await quantityInput.fill('2');
    }

    await notebookSection
      .locator('button[type="submit"], input[type="submit"]')
      .filter({ hasText: /add to cart/i })
      .click()
      .catch(async () => {
        await notebookSection.getByRole('button', { name: /add to cart/i }).click();
      });

    await expect(page).toHaveURL(/\/cart/);
    await expect(page.getByText(/Premium Lecture Notebook/i)).toBeVisible();

    await page.getByRole('link', { name: /checkout/i }).click();

    await expect(page).toHaveURL(/\/checkout/);

    await page.locator('input[name="cardholderName"]').fill('Alex Ng');

    await page
      .locator('button[type="submit"], input[type="submit"]')
      .filter({ hasText: /pay|mock payment/i })
      .click()
      .catch(async () => {
        await page.getByRole('button', { name: /pay|mock payment/i }).click();
      });

      await expect(
        page.getByRole('heading', { name: /order confirmed/i }),
      ).toBeVisible();

    await page.getByRole('link', { name: /view orders/i }).click();

    await expect(page).toHaveURL(/\/orders/);
    await expect(page.getByRole('heading', { name: /my orders/i })).toBeVisible();
  });

  test('admin can log in and access the admin product dashboard', async ({ page }) => {
    await login(page, seededUsers.admin);

    await page.goto('/admin/products');

    await expect(
      page.getByRole('heading', { name: /admin dashboard|admin products/i }),
    ).toBeVisible();

    await expect(
      page.getByRole('heading', { name: /purchase records/i }),
    ).toBeVisible();
  });
});