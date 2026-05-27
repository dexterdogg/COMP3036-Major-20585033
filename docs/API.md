# Campus Store API Documentation

## Overview

Campus Store exposes customer-facing and admin API endpoints for the B2C store application.

Authentication uses a JWT stored in an HttpOnly `auth` cookie after login.

## Public Product Endpoints

### GET /api/products

Returns active products.

Query parameters:

| Name | Type | Required | Description |
|---|---|---:|---|
| search | string | No | Search by product name |
| category | string | No | Filter by category slug |

Example:

```http
GET /api/products?search=headphones&category=electronics