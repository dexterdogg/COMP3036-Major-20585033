# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: store-flow.spec.js >> Iteration 1 B2C Store E2E Flow >> admin can log in and access the admin product dashboard
- Location: tests/e2e/store-flow.spec.js:65:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByLabel(/email/i)

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - navigation "Main navigation" [ref=e2]:
    - link "Campus Store" [ref=e3] [cursor=pointer]:
      - /url: /
    - generic [ref=e4]:
      - link "Products" [ref=e5] [cursor=pointer]:
        - /url: /products
      - link "Login" [ref=e6] [cursor=pointer]:
        - /url: /login
      - link "Register" [ref=e7] [cursor=pointer]:
        - /url: /register
  - heading "Welcome to CampusWell" [level=1] [ref=e8]
  - heading "Login" [level=3] [ref=e9]
  - generic [ref=e11]:
    - generic [ref=e12]: Email
    - textbox [ref=e13]
    - generic [ref=e14]: Password
    - textbox [ref=e15]
    - paragraph [ref=e16]:
      - text: New here?
      - link "Create an account" [ref=e17] [cursor=pointer]:
        - /url: /register
    - button "Log in" [ref=e18] [cursor=pointer]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | const seededUsers = {
  4  |   student: {
  5  |     email: 'student1@example.edu',
  6  |     password: 'Stud123',
  7  |   },
  8  |   admin: {
  9  |     email: 'admin1@example.edu',
  10 |     password: 'Admin123',
  11 |   },
  12 | };
  13 | 
  14 | async function login(page, user) {
  15 |   await page.goto('/login');
  16 | 
> 17 |   await page.getByLabel(/email/i).fill(user.email);
     |                                   ^ Error: locator.fill: Test timeout of 30000ms exceeded.
  18 |   await page.getByLabel(/password/i).fill(user.password);
  19 | 
  20 |   await page.getByRole('button', { name: /log in|login|sign in/i }).click();
  21 | 
  22 |   await expect(page).toHaveURL(/\/profile/);
  23 | }
  24 | 
  25 | test.describe('Iteration 1 B2C Store E2E Flow', () => {
  26 |   test('student can browse products, add to cart, checkout, and view orders', async ({ page }) => {
  27 |     await login(page, seededUsers.student);
  28 | 
  29 |     await page.goto('/products');
  30 | 
  31 |     await expect(page.getByRole('heading', { name: /products/i })).toBeVisible();
  32 | 
  33 |     await expect(page.getByText(/Wireless Study Headphones/i)).toBeVisible();
  34 | 
  35 |     await page.getByLabel(/search/i).fill('notebook');
  36 |     await page.getByRole('button', { name: /apply filters|search/i }).click();
  37 | 
  38 |     await expect(page.getByText(/Premium Lecture Notebook/i)).toBeVisible();
  39 | 
  40 |     const productCard = page
  41 |       .locator('.product-card')
  42 |       .filter({ hasText: 'Premium Lecture Notebook' });
  43 | 
  44 |     await productCard.getByLabel(/quantity/i).fill('2');
  45 |     await productCard.getByRole('button', { name: /add to cart/i }).click();
  46 | 
  47 |     await expect(page).toHaveURL(/\/cart/);
  48 |     await expect(page.getByText(/Premium Lecture Notebook/i)).toBeVisible();
  49 | 
  50 |     await page.getByRole('link', { name: /checkout/i }).click();
  51 | 
  52 |     await expect(page).toHaveURL(/\/checkout/);
  53 | 
  54 |     await page.getByLabel(/cardholder name/i).fill('Alex Ng');
  55 |     await page.getByRole('button', { name: /pay|mock payment/i }).click();
  56 | 
  57 |     await expect(page.getByText(/order confirmed/i)).toBeVisible();
  58 | 
  59 |     await page.getByRole('link', { name: /view orders/i }).click();
  60 | 
  61 |     await expect(page).toHaveURL(/\/orders/);
  62 |     await expect(page.getByRole('heading', { name: /my orders/i })).toBeVisible();
  63 |   });
  64 | 
  65 |   test('admin can log in and access the admin product dashboard', async ({ page }) => {
  66 |     await login(page, seededUsers.admin);
  67 | 
  68 |     await page.goto('/admin/products');
  69 | 
  70 |     await expect(
  71 |       page.getByRole('heading', { name: /admin dashboard|admin products/i }),
  72 |     ).toBeVisible();
  73 | 
  74 |     await expect(page.getByText(/purchase records/i)).toBeVisible();
  75 |   });
  76 | });
```