# Payroll Management System

This repository now includes a **React + Tailwind CSS Payroll Payment UI** under:

- `/home/runner/work/Payroll-Management-System/Payroll-Management-System/frontend`

## Features implemented

- Payroll dashboard summary cards:
  - Total employees
  - Total net payroll amount
  - Paid records
  - Pending records
- Payroll payment table with:
  - Employee
  - Payroll period
  - Gross salary
  - Net salary
  - Payment status
  - Payment date
- Filters/search:
  - Search by employee name or payroll ID
  - Filter by payment status
  - Filter by payment date
- Record detail modal/panel for individual payroll entries

## Frontend setup and run

From `/home/runner/work/Payroll-Management-System/Payroll-Management-System/frontend`:

```bash
npm install
npm run dev
```

## Build for production

```bash
npm run build
```

Production assets are generated in `frontend/dist`.

## Deploy (production)

Deploy **only** the compiled `frontend/dist` assets using your static hosting or backend static-file server.

Examples:
- Nginx/Apache static hosting
- Any CDN/static host
- Existing backend static file middleware

## Security/hardening notes for frontend source

- Source code is maintained by developers in this repository (`frontend/src`).
- End users in normal usage should only receive compiled assets from `frontend/dist`.
- Vite production build is configured with source maps disabled to avoid exposing source in production bundles.
- UI/source changes should flow through repository access, code review, and deployment pipeline only.

## Quality checks used

From `frontend/`:

```bash
npm run lint
npm run build
```
