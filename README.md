# Food + Insurance Multi-Repo System

This workspace contains 3 deployable repositories:

1. `core-backend-api`
2. `food-app-frontend`
3. `insurance-app-frontend`

## Local Run Order

### 1) Backend
```bash
cd /Users/ameyakulkarni/Desktop/Insurance/core-backend-api
cp .env.example .env
npm install
npm run seed
npm run dev
```

### 2) Food Frontend
```bash
cd /Users/ameyakulkarni/Desktop/Insurance/food-app-frontend
cp .env.example .env
npm install
npm run dev
```

### 3) Insurance Frontend
```bash
cd /Users/ameyakulkarni/Desktop/Insurance/insurance-app-frontend
cp .env.example .env
npm install
npm run dev
```

## Deployment

### Backend (Render)
- Create new Web Service from `core-backend-api`
- Build Command: `npm install`
- Start Command: `npm start`
- Add env vars:
  - `MONGO_URI`
  - `JWT_SECRET`
  - `CLIENT_URL` (comma-separated GitHub Pages URLs)
  - `COOKIE_SECURE=true`

### Frontends (GitHub Pages)
Each frontend has a deploy workflow at:
- `/Users/ameyakulkarni/Desktop/Insurance/food-app-frontend/.github/workflows/deploy.yml`
- `/Users/ameyakulkarni/Desktop/Insurance/insurance-app-frontend/.github/workflows/deploy.yml`

Set GitHub secret `VITE_API_URL` to your Render API URL + `/api/v1`.

## Live URL Format Example
- Food app: `https://<github-username>.github.io/food-app-frontend/`
- Insurance app: `https://<github-username>.github.io/insurance-app-frontend/`
- Backend API: `https://<render-service>.onrender.com/api/v1`
- Swagger: `https://<render-service>.onrender.com/api-docs`

## Admin Test Credentials
- `admin@demo.com` / `Admin@12345`

## Seeded Sample Data
- 2 users (admin + normal user)
- 6 food items across all categories
- 1 insurance plan (`Adaptive Wealth Shield`)

Seed script: `/Users/ameyakulkarni/Desktop/Insurance/core-backend-api/scripts/seed.js`

## Testing
- Unit: `interestEngine` rules
- Integration: order creation -> interest update + adjustment log

Run:
```bash
cd /Users/ameyakulkarni/Desktop/Insurance/core-backend-api
npm test
```

## API Documentation
- Swagger UI: `/api-docs`
- Postman collection:
  - `/Users/ameyakulkarni/Desktop/Insurance/core-backend-api/docs/postman_collection.json`

## Screenshots
Screenshots are not generated automatically in this environment. Capture after local run:
- Food: landing, menu, cart checkout success, orders
- Insurance: plans chart, calculator, admin logs
