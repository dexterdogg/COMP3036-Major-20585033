# University Store — B2C Store Application
Daniel Woodbury - 20585033

## Overview
this Store is a B2C store application built from a previous Express/EJS/PostgreSQL university project. The application allows users to browse products, filter/search products, manage a cart, and complete a mock checkout.

## Original Codebase Acknowledgement
This project extends a previous COMP3028/Express CampusWell-style application. The original app included authentication, profile, search/event, mood tracker, and task board functionality. For the COMP3036 Major Project, the codebase has been significantly modified into a B2C store application.

## Iteration 1 Scope
- Product catalogue
- Product search and category filtering
- User authentication
- Shopping cart
- Mock checkout
- Purchase database records
- API documentation
- Automated tests
- CI workflow

## Iteration 2 Scope
- Full admin product dashboard
- Admin purchase records view
- User purchase history UI
- Deployment
- UI polish
- Additional E2E coverage

## Setup
- Install dependencies:

npm install

- reset and see the PostgreSQL database:

npm run db:reset

- Start application:

npm start

- open app at:

http://127.0.0.1:3000

## Testing

npm test
npm run test:e2e

npm run test:all

## Demo Accounts

Student:
- Email: student1@example.edu
- Password: Stud123

Admin:
- Email: admin1@example.edu
- Password: Admin123

## API Documentation
See docs/API.md


## Generative AI Acknowledgement

Generative AI was used as a support tool to review code structure, identify potential bugs, improve documentation, and assist with test planning. All code was reviewed, tested, Understood and adapted before submission.