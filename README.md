# Adithya Supply Chain Sourcing Portal

A full-stack B2B sourcing and quotation management platform with an admin-gated workflow.

## Architecture

- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **Database:** MongoDB + Mongoose
- **Auth:** JWT for Admin
- **Email:** Nodemailer tokenized links

## Monorepo Structure

```
.
├── backend
│   ├── src
│   │   ├── config
│   │   ├── controllers
│   │   ├── middlewares
│   │   ├── models
│   │   ├── routes
│   │   ├── scripts
│   │   ├── services
│   │   ├── utils
│   │   ├── app.js
│   │   └── server.js
│   └── .env.example
└── frontend
    ├── src
    │   ├── components
    │   ├── hooks
    │   ├── layouts
    │   ├── pages
    │   ├── services
    │   └── styles
    └── .env.example
```

## Features Implemented

### Public
- Home, About, Services, Contact pages
- Producer initial request form
- Manufacturer requirement request form

### Producer Workflow
- Initial producer request submission
- Admin approval/rejection workflow
- Secure onboarding token email flow
- Producer detailed onboarding form (via tokenized link)

### Manufacturer Workflow
- Requirement intake form
- Admin match engine based on requested items vs producer products

### Admin Workflow
- JWT-based admin login
- Dashboard summary cards
- Pending producer request handling
- Approved producer listing with search
- Manufacturer request management
- Matching and quotation request dispatch
- Quotation comparison table with highlighted:
  - Lowest quote
  - Best delivery timeline
  - Best overall option

### Data Models
- producer_requests
- approved_producers
- manufacturer_requests
- quotation_requests
- quotations
- admins

### Enhancements Included
- Admin notes field in request models
- Request status tracking
- Notification emails for onboarding and quotation requests
- Better supplier matching score

## Setup

## 1) Backend

```bash
cd backend
npm install
cp .env.example .env
# update .env with MongoDB URI, JWT secret, SMTP credentials
npm run seed
npm run dev
```

Seeded admin credentials:
- `admin@adithya.com`
- `Admin@123`

## 2) Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## API Overview

- `POST /api/auth/login`
- `POST /api/public/producer-requests`
- `POST /api/public/manufacturer-requests`
- `GET /api/producers/onboarding/validate?token=...`
- `POST /api/producers/onboarding/complete`
- `GET /api/producers/pending` (admin)
- `PATCH /api/producers/requests/:id/status` (admin)
- `GET /api/producers/approved` (admin)
- `GET /api/manufacturer-requests` (admin)
- `GET /api/manufacturer-requests/:id/matches` (admin)
- `POST /api/quotations/send` (admin)
- `GET /api/quotations/request-by-token?token=...`
- `POST /api/quotations/submit`
- `GET /api/quotations/comparison/:id` (admin)
- `GET /api/dashboard/summary` (admin)

## Security Notes

- Producer data is never exposed publicly; only admins access approved producer listings.
- Admin JWT is required for admin endpoints.
- Producer onboarding and quotation submission links use secure tokens.

## Production Notes

- Configure CORS with explicit origins.
- Use managed SMTP and MongoDB in production.
- Store secrets in secure secret manager.
- Add request rate limiting and audit logging as a next step.
