# Zaplink

A minimal, production-grade URL shortener similar to bit.ly, built with Next.js 15, PostgreSQL (Neon), and Prisma.  
Includes dashboard, link management, redirect routing, statistics page, and a health check endpoint.

![Next.js](https://img.shields.io/badge/Next.js-black)
![React](https://img.shields.io/badge/React-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-blue)
![Shadcn/ui](https://img.shields.io/badge/Shadcn/ui-blue)
![Zod](https://img.shields.io/badge/Zod-blue)
![TanStackQuery](https://img.shields.io/badge/TanStackQuery-blue)

## Features

- URL Shortening — Convert long URLs into short, unique codes
- Custom Codes — Optional user-defined short codes with global uniqueness
- Form Validation — URL must be valid (Zod validation) with optional custom code (6–7 characters)
- Stats Tracking — Total clicks and last clicked timestamp
- Redirect Handling — Proper 301/302 redirect behavior for `/:code` endpoint
- Delete Links — Allows removal of links; deleted links return 404 on access
- Dashboard — List, search, filter, add, and delete URLs
- Stats Page — `/code/:code` with detailed link analytics
- Health Check — `/api/healthz` for uptime and version information
- Polished UI — Responsive Tailwind CSS layout with consistent spacing and typography
- Next.js App Router — Server Actions + Edge-safe API routes
- PostgreSQL + Prisma ORM
- RFC-Compliant Code Rules — `[A-Za-z0-9]{6,8}`
- Autograder Compatible — Follows all required endpoints and behaviors

## Architecture Overview

### Tech Stack

- Next.js 15 (App Router)
- PostgreSQL (Neon)
- Prisma ORM
- Tailwind CSS
- Zod (Validation)
- TanStack React Query for client state
- Vercel Deployment

### Core API Routes

| Method | Path             | Description                       |
| ------ | ---------------- | --------------------------------- |
| POST   | /api/links       | Create short link (409 if exists) |
| GET    | /api/links       | List all links                    |
| GET    | /api/links/:code | Fetch stats for a given code      |
| DELETE | /api/links/:code | Delete a link                     |
| GET    | /api/healthz     | Health check                      |

### Page Routes (App Router)

| Page       | Path         | Description                |
| ---------- | ------------ | -------------------------- |
| Dashboard  | /            | Main link management UI    |
| Stats Page | /code/:code  | Detailed analytics view    |
| Redirect   | /:code       | 302 redirect to target URL |
| Health     | /api/healthz | Health information JSON    |

## Environment Variables

### Required Variables

- `DATABASE_URL`- postgres://postgres:mysecretpassword@localhost:5432/zaplink
- `GOOGLE_CLIENT_ID` - Google OAuth client ID from Google Cloud Console
- `GOOGLE_API_KEY` - Google For Malicious Url Validation
- `NEXT_PUBLIC_MAIN_URL` - Public-facing application URL

### Database Schema

![alt text](public/assets/screenshots/image.png)

## Development

### Available Scripts

```bash
pnpm install
pnpm run dev          # Start development server
pnpm run build        # Build for production
pnpm run start        # Start production server
pnpm run lint         # Run ESLint
```

### Database Management

```bash
pnpm prisma migrate dev  # Migrate all Database logic
pnpm prisma generate     # Generate Prisma Client
pnpm prisma studio       # Open Prisma Studio for database browsing
```
