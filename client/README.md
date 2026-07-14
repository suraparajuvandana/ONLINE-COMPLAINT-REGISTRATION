# Complaint Management System — Client

A React + Vite frontend for a role-based Complaint Management System (User / Agent / Admin).

## Features
- JWT-based authentication (login/register) via `AuthContext`
- Role-based protected routing (`ProtectedRoute`) for `user`, `agent`, `admin`
- Complaint lifecycle: create, view, track status, timeline, assign (agent/admin)
- Feedback & rating system for resolved complaints
- In-app notifications with polling
- Responsive layout (Navbar, Sidebar, Footer)

## Getting Started

```bash
cd client
npm install
cp .env.example .env   # set VITE_API_URL to your backend
npm run dev
```

The app runs on `http://localhost:3000` by default and proxies `/api` requests to `http://localhost:5000` (see `vite.config.js`).

## Folder Structure
- `src/assets` — images and modular CSS
- `src/components` — reusable UI building blocks
- `src/pages` — route-level views
- `src/context` — global state (Auth, Complaints)
- `src/services` — API calls (axios)

## Backend Contract (expected REST endpoints)
- `POST /api/auth/login`, `POST /api/auth/register`, `PUT /api/auth/profile`, `PUT /api/auth/change-password`
- `GET/POST /api/complaints`, `GET /api/complaints/my`, `GET /api/complaints/assigned`
- `GET /api/complaints/:id`, `PATCH /api/complaints/:id/status`, `PATCH /api/complaints/:id/assign`
- `POST /api/complaints/:id/feedback`, `GET /api/feedback`
- `GET /api/notifications`, `PATCH /api/notifications/:id/read`

Replace image placeholders in `src/assets/images/` with real assets before shipping to production.
