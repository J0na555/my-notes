---
title: Big Picture (Before Code)
tags:
  - authentication
  - fastapi
date: 2025-12-16
---

# Big Picture (Before Code)

What you’ve built is **stateless authentication** using [[🔑 JWT Auth Setup (Django + React)|JWT]].

That means:

* The server **does NOT store sessions**
* The client holds the token
* Every protected request must send the token
* The server only **verifies**, never remembers

Your SQLite DB is only used for:

* Users
* Password hashes
* Looking up users during login & request validation

---

# Step 0: Important Constants (Auth Configuration)

```python
SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
```

### What these actually mean

* **SECRET_KEY**

  * Used to **sign** and **verify** JWTs
  * If leaked → game over, anyone can forge tokens
  * Should be an environment variable in production (your code is fine for learning)

* **HS256**

  * Symmetric algorithm
  * Same key signs and verifies
  * Simple and fast (good choice)

* **Expiration**

  * Tokens automatically die after 30 minutes
  * This is enforced by JWT itself (`exp` claim)

---

# Step 1: Password Hashing (Security Foundation)

```python
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
```

### Why this matters

You **never store raw passwords**. Ever.

### Register flow

```python
def get_password_hash(password):
    return pwd_context.hash(password)
```

* User sends plaintext password
* You hash it with bcrypt
* Only hash is stored in SQLite

### Login flow

```python
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)
```

* bcrypt checks if plaintext matches stored hash
* You never decrypt (impossible anyway)

This part is **done correctly**.

---

# Step 2: User Lookup & Authentication

```python
def get_user(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()
```

Simple DB lookup.

---

```python
def authenticate_user(db: Session, username: str, password: str):
    user = get_user(db, username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user
```

### What this does conceptually

* Checks:

  1. User exists
  2. Password matches
* Returns:

  * `User` object if valid
  * `False` if invalid

This function is the **gatekeeper** before token creation.

---

# Step 3: Token Creation (JWT Birth)

```python
def create_access_token(data: dict, expires_delta: timedelta | None = None):
```

### Input

```python
data={"sub": user.username}
```

This is critical.

#### `sub` (subject)

* JWT standard claim
* Represents **who this token belongs to**
* You use `username` as identity (fine choice)

---

### Expiration Logic

```python
expire = datetime.now(timezone.utc) + expires_delta
to_encode.update({"exp": expire})
```

JWT will:

* Automatically reject expired tokens
* Raise an exception during `jwt.decode`

No manual expiry checking needed later.

---

### Signing the Token

```python
encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
```

This:

* Creates header + payload
* Signs them using `SECRET_KEY`
* Produces a **string token**

Example token (simplified):

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

# Step 4: Login Endpoint (`/token`)

```python
@router.post("/token")
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
)
```

### Why `OAuth2PasswordRequestForm`?

* Expects:

  * `username`
  * `password`
* Matches OAuth2 spec
* Works perfectly with Swagger UI

---

### Flow Inside `/token`

1. **Authenticate user**

```python
user = authenticate_user(db, form_data.username, form_data.password)
```

1. **Fail fast if invalid**

```python
raise HTTPException(401, "Incorrect username or password")
```

1. **Create JWT**

```python
access_token = create_access_token(
    data={"sub": user.username},
    expires_delta=timedelta(minutes=30)
)
```

1. **Return token**

```python
return {
    "access_token": access_token,
    "token_type": "bearer"
}
```

### Client now stores

```
Authorization: Bearer <JWT>
```

---

# Step 5: OAuth2 Token Extraction (Magic Glue)

```python
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")
```

This does **one thing only**:

* Extracts token from:

```
Authorization: Bearer <token>
```

It does NOT:

* Validate token
* Decode token
* Touch the DB

Just extraction.

---

# Step 6: Protecting Routes (`get_current_user`)

This is the **most important function**.

```python
async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
)
```

### Step-by-step logic

---

### 1️⃣ Get token from request

FastAPI:

* Reads `Authorization` header
* Extracts JWT string
* Passes it as `token`

If missing → auto 401.

---

### 2️⃣ Decode JWT

```python
payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
```

This automatically:

* Verifies signature
* Checks expiration (`exp`)
* Raises `InvalidTokenError` if:

  * Token is expired
  * Token is tampered
  * Wrong secret

---

### 3️⃣ Extract identity

```python
username = payload.get("sub")
```

If `sub` missing → invalid token.

---

### 4️⃣ Fetch user from DB

```python
user = db.query(User).filter(User.username == username).first()
```

This ensures:

* Token refers to a **real user**
* Deleted users lose access even if token exists

---

### 5️⃣ Return user object

```python
return user
```

Now any route using this dependency **gets the logged-in user**.

---

# Step 7: Active User Wrapper

```python
async def get_current_active_user(
    current_user: User = Depends(get_current_user)
):
    return current_user
```

Right now this is redundant.

But later you can add:

* `is_active`
* `is_banned`
* `is_verified`

Good forward-thinking structure.

---

# Step 8: Using It in Protected Routes

Example:

```python
@router.get("/me")
def read_users_me(current_user: User = Depends(get_current_active_user)):
    return current_user
```

If:

* Token missing ❌
* Token invalid ❌
* Token expired ❌

→ Request is blocked before hitting the function.

---

# Stateless Nature (Very Important)

Your server:

* Does NOT store tokens
* Does NOT track sessions
* Can scale easily

JWT contains:

* Identity
* Expiry
* Integrity guarantee

That’s why this works so cleanly.

---

# Honest Critique (No Sugar-Coating)

### ✅ What you did right

* Correct JWT flow
* Proper password hashing
* Clean dependency usage
* DB lookup after token decode (important)

### ⚠️ What’s missing (but normal at this stage)

* Refresh tokens
* Token revocation
* Role/permission claims
* Rate limiting
* HTTPS enforcement (mandatory in real apps)

### ❌ Small improvement suggestion

Instead of:

```python
except InvalidTokenError:
```

Use:

```python
except jwt.PyJWTError:
```

Catches more edge cases.

---

# Final Mental Model (Remember This)

JWT auth in FastAPI is **just this**:

1. Login → verify password
2. Create signed token with identity + expiry
3. Client sends token on every request
4. Server:

   * Verifies token
   * Extracts identity
   * Fetches user
   * Allows or denies

No sessions. No memory. No magic.

## Related

- [[Concurrency and async,await]]
- [[Pydantic]]
- [[Django Authentication]]
