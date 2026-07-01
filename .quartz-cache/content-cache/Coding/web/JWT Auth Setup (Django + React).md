---
title: 🔑 JWT Auth Setup (Django + React)
tags:
  - django_authentication
  - jwt
date: 2025-08-18
---

### 1. **Install dependencies**

- `djangorestframework` (if not already installed).
- `djangorestframework-simplejwt` (for JWT handling).

---

### 2. **Update Django settings**

- Add `rest_framework` to `INSTALLED_APPS`.
- Configure [[DRF Principles|DRF]] default auth classes to use JWT:
  - `REST_FRAMEWORK['DEFAULT_AUTHENTICATION_CLASSES'] = ['rest_framework_simplejwt.authentication.JWTAuthentication']`

---

### 3. **Create login (token) endpoints**

- Use `SimpleJWT` built-in views:
  - `/api/token/` → returns access + refresh tokens.
  - `/api/token/refresh/` → returns new access token using refresh token.

---

### 4. **Frontend (React) login flow**

- React collects username/password.
- Sends `POST` request to `/api/token/` with JSON:

```json
{ "username": "user", "password": "pass" }
```

```json
{ "access": "jwt-access-token", "refresh": "jwt-refresh-token" }
```

- React stores tokens (in memory, `localStorage`, or httpOnly cookies depending on security policy).

---

### 5. **Protect backend routes**

- Use DRF `@permission_classes([IsAuthenticated])` on protected API views.
- Requests must include:

```makefile
Authorization: Bearer <access_token>
```

---

1. Token refresh flow

    Access tokens usually expire fast (e.g., 5 min).
    Use /api/token/refresh/ with the refresh token to get a new access token.
    React should handle refreshing tokens silently in the background.

---

1. Logout

    No server-side logout with JWT (stateless).
    React just deletes stored tokens.
    (Optional) If you want server-side blacklist → enable SIMPLE_JWT['BLACKLIST_AFTER_ROTATION'] and use blacklist app.

---

1. Testing

    Test login with valid/invalid creds.
    Test calling a protected route with:
        No token → should be 401 Unauthorized.
        Expired token → should be 401.
        Valid token → should succeed.

---

👉 That’s the clean JWT pipeline:

```pgsql
React login form → POST /api/token/ → get JWTs → store token → 
use Authorization header → refresh tokens → logout clears tokens
```
