---
title: 🧠 **Auth in [[Intro to Django|Django]] + React**
tags:
  - authentication
  - django
date: 2025-08-14
---

# 🧠 **Auth in [[Intro to Django|Django]] + React**

---

## **1. Session-Based Authentication**

_(Django’s default way)_

- **How it works**
  - React sends username + password → Django checks → Django sets a **session ID cookie**.
  - Browser automatically sends the session cookie on every request.
  - Django knows who you are by looking up the session in the database.
- **Pros**
  - Simple (already built into Django).
  - Secure against token theft (cookies are httpOnly + secure if configured).
  - No extra setup (no external library needed).
  - Works well if frontend & backend are on the same domain.
- **Cons**
  - More annoying with **cross-origin setups** (React on `localhost:3000`, Django on `localhost:8000`) → need CORS and CSRF configs.
  - Doesn’t scale well for mobile apps / multiple clients (requires cookie/session handling).  
  - Harder if you want to expose your API to third-party clients (like a public API).
- **Best when**
  - React frontend + Django backend live on **same domain**.
  - You don’t expect to have mobile apps or external API users.
  - Simpler project, internal tool, school/university project, etc.

---

## **2. Token/JWT-Based Authentication**

_(common for React/SPA/mobile apps)_

- **How it works**
  - React sends username + password → Django returns a **[[JWT Auth Setup (Django + React)|JWT]] token**.
  - React stores the token (usually `localStorage` or `httpOnly cookie`).
  - On every request, React sends `Authorization: Bearer <token>` in headers.
  - Django/[[DRF Principles|DRF]] validates the token without DB lookup (JWT is self-contained).
- **Pros**
  - Frontend-agnostic → works with React, mobile apps, third-party clients.
  - Stateless (no DB lookup needed on every request → better for scaling).
  - Cleaner separation of frontend & backend.
  - Industry standard for modern SPAs.
- **Cons**
  - Tokens can be stolen if stored in `localStorage` (XSS vulnerability). Needs secure handling.
  - Slightly more setup (install `djangorestframework-simplejwt` or similar).
  - You need to handle token refresh (JWTs usually expire quickly).
- **Best when**
  - React frontend + Django backend are on **different domains**.
  - You want **mobile app support** in the future.
  - You expect to expose API to external developers.
  - Larger, more scalable projects.

---

## **🗝️ Quick Mindmap Style**

```pgsql
AUTH OPTIONS
│
├── Session-Based (Default Django)
│   ├── Stores session in DB
│   ├── Uses cookies automatically
│   ├── Easier to set up
│   ├── Harder with CORS/CSRF
│   └── Best for small/same-domain apps
│
└── JWT / Token-Based
    ├── Returns JWT to frontend
    ├── React stores token
    ├── Sent via Authorization header
    ├── Stateless (scales better)
    ├── Needs secure token handling
    └── Best for modern SPAs, mobile apps, APIs
```

## Related

- [[Django REST Framework Generic API Views - Crash Course]]
- [[Django Concepts]]
- [[Django Channels]]
- [[Creating Django Project]]
- [[Django Channels 1]]
- [[Django Channels 2]]
- [[Session-Based Authentication]]
- [[FastAPI Auth]]
