# Campus Store API Documentation

## Overview

Campus Store exposes customer-facing and administrator API endpoints for the B2C store application.

The API supports:

- browsing products
- filtering products by search text and category
- retrieving individual product details
- retrieving a logged-in user's purchase history
- administrator product management
- administrator purchase record viewing

The API is implemented with Express routes under the `/api` path.

---

## Authentication

The application uses a JSON Web Token stored in an HttpOnly cookie named `auth`.

Authentication is created when a user logs in through the web login form.

### Access levels

| Access level | Description |
|---|---|
| Public | No login required |
| Authenticated user | Any logged-in user |
| Admin | Logged-in user with the `Admin` role |

### Important note about API authentication

The current implementation uses the same authentication middleware as the web routes. This means unauthenticated API requests may redirect to `/login` instead of returning a JSON `401` response.

For a production API, the recommended improvement would be to add API-specific middleware that returns JSON error responses such as:

```json
{
  "error": "Authentication required."
}
```

---

## Base URL

Local development:

```http
http://127.0.0.1:3000/api
```

---

# Public Product Endpoints

## GET /api/products

Returns all active products.

### Authentication

Not required.

### Query parameters

| Name | Type | Required | Description |
|---|---|---:|---|
| search | string | No | Filters products by product name |
| category | string | No | Filters products by category slug |

### Example request

```http
GET /api/products
```

### Example request with filters

```http
GET /api/products?search=headphones&category=electronics
```

### Example success response

```json
{
  "products": [
    {
      "id": 1,
      "category_id": 1,
      "name": "Wireless Study Headphones",
      "slug": "wireless-study-headphones",
      "description": "Noise-reducing wireless headphones for study.",
      "price_cents": 8995,
      "image_url": "/images/headphones.jpg",
      "stock_quantity": 15,
      "is_active": true,
      "created_at": "2026-05-17T00:00:00.000Z",
      "updated_at": "2026-05-17T00:00:00.000Z",
      "category_name": "Electronics",
      "category_slug": "electronics"
    }
  ]
}
```

### Error responses

| Status | Meaning |
|---|---|
| 500 | Server error |

---

## GET /api/products/:id

Returns a single active product by database ID.

### Authentication

Not required.

### Path parameters

| Name | Type | Required | Description |
|---|---|---:|---|
| id | number | Yes | Database ID of the product |

### Example request

```http
GET /api/products/1
```

### Example success response

```json
{
  "product": {
    "id": 1,
    "category_id": 1,
    "name": "Wireless Study Headphones",
    "slug": "wireless-study-headphones",
    "description": "Noise-reducing wireless headphones for study.",
    "price_cents": 8995,
    "image_url": "/images/headphones.jpg",
    "stock_quantity": 15,
    "is_active": true,
    "created_at": "2026-05-17T00:00:00.000Z",
    "updated_at": "2026-05-17T00:00:00.000Z",
    "category_name": "Electronics",
    "category_slug": "electronics"
  }
}
```

### Error responses

| Status | Example response | Meaning |
|---|---|---|
| 404 | `{ "error": "Product not found." }` | Product does not exist or is inactive |
| 500 | `{ "error": "Server error." }` | Unexpected server error |

---

# Authenticated Customer Endpoints

## GET /api/me/purchases

Returns the purchase history for the currently logged-in user.

### Authentication

Required. Any logged-in user can access their own purchase history.

### Example request

```http
GET /api/me/purchases
Cookie: auth=<jwt>
```

### Example success response

```json
{
  "purchases": [
    {
      "id": 10,
      "total_cents": 12990,
      "status": "paid",
      "payment_reference": "MOCK-1760000000000",
      "created_at": "2026-05-17T00:00:00.000Z",
      "item_count": "2"
    }
  ]
}
```

### Error responses

| Status | Meaning |
|---|---|
| 302 | Not logged in; redirected to `/login` by current middleware |
| 500 | Server error |

---

# Admin Product Endpoints

## GET /api/admin/products

Returns all products for administrator management, including inactive products.

### Authentication

Admin only.

### Example request

```http
GET /api/admin/products
Cookie: auth=<admin-jwt>
```

### Example success response

```json
{
  "products": [
    {
      "id": 1,
      "category_id": 1,
      "name": "Wireless Study Headphones",
      "slug": "wireless-study-headphones",
      "description": "Noise-reducing wireless headphones for study.",
      "price_cents": 8995,
      "image_url": "/images/headphones.jpg",
      "stock_quantity": 15,
      "is_active": true,
      "created_at": "2026-05-17T00:00:00.000Z",
      "updated_at": "2026-05-17T00:00:00.000Z",
      "category_name": "Electronics",
      "category_slug": "electronics"
    }
  ]
}
```

### Error responses

| Status | Meaning |
|---|---|
| 302 | Not logged in; redirected to `/login` by current middleware |
| 403 | Logged in but not an admin |
| 500 | Server error |

---

## POST /api/admin/products

Creates a new product.

### Authentication

Admin only.

### Request body

| Field | Type | Required | Description |
|---|---|---:|---|
| categoryId | number | Yes | Product category ID |
| name | string | Yes | Product name |
| slug | string | No | URL-safe slug. If omitted, generated from name |
| description | string | No | Product description |
| price | number | Yes | Product price in dollars |
| imageUrl | string | No | Product image path or URL |
| stockQuantity | number | Yes | Available stock |
| isActive | boolean/string | No | Whether the product is visible to customers |

### Example request

```http
POST /api/admin/products
Content-Type: application/json
Cookie: auth=<admin-jwt>
```

```json
{
  "categoryId": 1,
  "name": "USB-C Study Hub",
  "slug": "usb-c-study-hub",
  "description": "Portable USB-C hub for students.",
  "price": 49.95,
  "imageUrl": "/images/usb-c-hub.jpg",
  "stockQuantity": 20,
  "isActive": true
}
```

### Example success response

```json
{
  "product": {
    "id": 8,
    "category_id": 1,
    "name": "USB-C Study Hub",
    "slug": "usb-c-study-hub",
    "description": "Portable USB-C hub for students.",
    "price_cents": 4995,
    "image_url": "/images/usb-c-hub.jpg",
    "stock_quantity": 20,
    "is_active": true,
    "created_at": "2026-05-17T00:00:00.000Z",
    "updated_at": "2026-05-17T00:00:00.000Z"
  }
}
```

### Error responses

| Status | Meaning |
|---|---|
| 302 | Not logged in; redirected to `/login` by current middleware |
| 403 | Logged in but not an admin |
| 500 | Server error or invalid database insert |

### Validation notes

The current implementation converts the submitted `price` value into `price_cents` server-side. A recommended production improvement is to add stronger validation for category ID, duplicate slugs, negative stock values, and invalid image URLs.

---

## PUT /api/admin/products/:id

Updates an existing product.

### Authentication

Admin only.

### Path parameters

| Name | Type | Required | Description |
|---|---|---:|---|
| id | number | Yes | Product ID to update |

### Request body

Uses the same body structure as `POST /api/admin/products`.

### Example request

```http
PUT /api/admin/products/8
Content-Type: application/json
Cookie: auth=<admin-jwt>
```

```json
{
  "categoryId": 1,
  "name": "USB-C Study Hub Updated",
  "slug": "usb-c-study-hub-updated",
  "description": "Updated product description.",
  "price": 59.95,
  "imageUrl": "/images/usb-c-hub.jpg",
  "stockQuantity": 25,
  "isActive": true
}
```

### Example success response

```json
{
  "product": {
    "id": 8,
    "category_id": 1,
    "name": "USB-C Study Hub Updated",
    "slug": "usb-c-study-hub-updated",
    "description": "Updated product description.",
    "price_cents": 5995,
    "image_url": "/images/usb-c-hub.jpg",
    "stock_quantity": 25,
    "is_active": true,
    "created_at": "2026-05-17T00:00:00.000Z",
    "updated_at": "2026-05-17T00:10:00.000Z"
  }
}
```

### Error responses

| Status | Example response | Meaning |
|---|---|---|
| 302 | HTML redirect | Not logged in |
| 403 | HTML error page | Logged in but not admin |
| 404 | `{ "error": "Product not found." }` | Product ID does not exist |
| 500 | `{ "error": "Server error." }` | Unexpected server error |

---

## DELETE /api/admin/products/:id

Soft-deletes a product by setting `is_active` to `false`.

The product row remains in the database for historical purchase records, but it is hidden from the public product catalogue.

### Authentication

Admin only.

### Path parameters

| Name | Type | Required | Description |
|---|---|---:|---|
| id | number | Yes | Product ID to deactivate |

### Example request

```http
DELETE /api/admin/products/8
Cookie: auth=<admin-jwt>
```

### Example success response

```json
{
  "product": {
    "id": 8,
    "category_id": 1,
    "name": "USB-C Study Hub Updated",
    "slug": "usb-c-study-hub-updated",
    "description": "Updated product description.",
    "price_cents": 5995,
    "image_url": "/images/usb-c-hub.jpg",
    "stock_quantity": 25,
    "is_active": false,
    "created_at": "2026-05-17T00:00:00.000Z",
    "updated_at": "2026-05-17T00:20:00.000Z"
  }
}
```

### Error responses

| Status | Example response | Meaning |
|---|---|---|
| 302 | HTML redirect | Not logged in |
| 403 | HTML error page | Logged in but not admin |
| 404 | `{ "error": "Product not found." }` | Product ID does not exist |
| 500 | `{ "error": "Server error." }` | Unexpected server error |

---

# Admin Purchase Endpoints

## GET /api/admin/purchases

Returns all purchase records for administrator review.

### Authentication

Admin only.

### Example request

```http
GET /api/admin/purchases
Cookie: auth=<admin-jwt>
```

### Example success response

```json
{
  "purchases": [
    {
      "id": 10,
      "user_id": 3,
      "email": "student1@example.edu",
      "total_cents": 12990,
      "status": "paid",
      "payment_reference": "MOCK-1760000000000",
      "created_at": "2026-05-17T00:00:00.000Z",
      "item_count": "2"
    }
  ]
}
```

### Error responses

| Status | Meaning |
|---|---|
| 302 | Not logged in; redirected to `/login` by current middleware |
| 403 | Logged in but not an admin |
| 500 | Server error |

---

# Data Format Notes

## Money

Product prices and purchase totals are stored as integer cents in the database.

Example:

```json
{
  "price_cents": 4995
}
```

This represents:

```txt
$49.95
```

The admin create/update API accepts `price` as a dollar value and converts it to `price_cents` server-side.

---

## Product deletion

Products are not permanently removed from the database. Deleting a product through the admin API sets:

```json
{
  "is_active": false
}
```

This keeps old purchase records valid because historical purchases may still reference the product.

---

## Payment

Payment is mocked for assessment purposes.

When a checkout is completed through the web interface, the system creates a purchase with:

```json
{
  "status": "paid",
  "payment_reference": "MOCK-..."
}
```

No real payment gateway is used.

---

# Security Notes and Limitations

## Implemented security controls

- Passwords are hashed before storage.
- Authenticated sessions use JWTs stored in HttpOnly cookies.
- Public product browsing does not require login.
- Purchase history requires login.
- Admin product and purchase API endpoints require the `Admin` role.
- Checkout totals are calculated server-side from database product prices.

## Current limitations

- API authentication middleware currently redirects unauthenticated users to `/login` instead of returning JSON `401` responses.
- CSRF tokens are not yet implemented for cookie-authenticated POST/PUT/DELETE routes.
- Product validation is functional for the prototype but should be stricter in production.
- Payment is mocked and does not connect to a real payment provider.
- API rate limiting is not implemented.
- Error responses are intentionally simple for the university prototype.

---

# Endpoint Summary

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| GET | `/api/products` | Public | List active products |
| GET | `/api/products/:id` | Public | Show one active product |
| GET | `/api/me/purchases` | Logged-in user | Show current user's purchase history |
| GET | `/api/admin/products` | Admin | List all products |
| POST | `/api/admin/products` | Admin | Create product |
| PUT | `/api/admin/products/:id` | Admin | Update product |
| DELETE | `/api/admin/products/:id` | Admin | Soft-delete product |
| GET | `/api/admin/purchases` | Admin | List all purchase records |