# Core Backend API

Production-ready REST API for Food + Insurance apps.

## Stack
- Node.js 20
- Express + Mongoose
- MongoDB Atlas
- JWT auth with httpOnly cookies
- Swagger (`/api-docs`)

## Setup
```bash
cp .env.example .env
npm install
npm run seed
npm run dev
```

## Environment Variables
- `MONGO_URI`
- `JWT_SECRET`
- `CLIENT_URL` (comma-separated frontend origins)
- `COOKIE_SECURE`

## API Base URL
`/api/v1`

## Key Endpoints
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`
- `GET /food`
- `POST /orders`
- `GET /insurance/plans`
- `GET /insurance/adjustments` (ADMIN)

## Interest Engine Rules
1. `order.totalAmount > 1000` => `+0.5%`
2. `>5 orders in last 30 days` => `+0.25%`
3. `healthyPercentage > 60` => `+0.4%`
4. `healthyPercentage < 30` => `-0.3%`
5. Adjustment capped to `[-1%, +2%]`

Order creation and reversal execute inside Mongo transactions.

## Tests
```bash
npm test
```

## ER Diagram
```mermaid
erDiagram
  USER ||--o{ ORDER : places
  USER ||--o{ INTEREST_ADJUSTMENT_LOG : triggers
  ORDER ||--o{ INTEREST_ADJUSTMENT_LOG : logs
  FOOD_ITEM ||--o{ ORDER : included_in
  INSURANCE_PLAN ||--o{ INTEREST_ADJUSTMENT_LOG : affected_by

  USER {
    ObjectId _id
    string name
    string email
    string password
    string role
    date createdAt
    date updatedAt
  }

  FOOD_ITEM {
    ObjectId _id
    string name
    string category
    number price
    number healthScore
    boolean isActive
    date createdAt
  }

  ORDER {
    ObjectId _id
    ObjectId userId
    object[] items
    number totalAmount
    number healthyPercentage
    date createdAt
  }

  INSURANCE_PLAN {
    ObjectId _id
    string name
    string provider
    number baseInterestRate
    number currentInterestRate
    date lastUpdated
  }

  INTEREST_ADJUSTMENT_LOG {
    ObjectId _id
    ObjectId userId
    ObjectId orderId
    number adjustment
    string reason
    date createdAt
  }
```
