# Insurance App Frontend

React + Vite fintech dashboard.

## Setup
```bash
cp .env.example .env
npm install
npm run dev
```

## Routes
- `/`
- `/plans`
- `/calculator`
- `/admin`

## Features
- Live rate fetch from `GET /insurance/plans`
- Premium calculator
- Admin adjustment logs via `GET /insurance/adjustments`
- Recharts line chart for base vs current rates
