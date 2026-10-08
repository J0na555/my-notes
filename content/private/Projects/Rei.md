# Rei — Detailed DevOps Learning Plan

> **Core rule:** every phase produces a working system. Don't learn a technology in isolation; introduce it because Nami has a problem that requires it.

---

# Phase 1 — Build the actual product

### Target architecture

```text
                    Browser
                       │
                       ▼
                    Nginx
                       │
                       ▼
                    FastAPI
                  /         \
                 /           \
                ▼             ▼
          PostgreSQL         Redis
```

Start as a **modular monolith**. Don't split FastAPI into microservices yet.

---

## 1. Authentication

### Authentication method

**Email/username + password**

```text
POST /auth/register
POST /auth/login
POST /auth/logout
POST /auth/refresh
GET  /auth/me
```

Use:

- Argon2id for password hashing
    
- short-lived JWT access tokens
    
- refresh tokens
    
- refresh-token rotation
    
- HTTP-only secure cookies for browser authentication
    
- CSRF protection if you use cookie-based auth
    
- rate limiting on login/register
    
- email verification eventually
    
- password reset eventually
    

### Roles

Keep it simple:

```text
User
Admin
```

Eventually:

```text
User
Moderator
Admin
```

Authorization should be **RBAC**:

```text
User
 ├── watch anime
 ├── manage watchlist
 ├── rate anime
 └── manage profile

Admin
 ├── everything User can do
 ├── create anime
 ├── upload episodes
 ├── manage users
 └── manage media
```

### What you're actually learning

Don't just implement `/login`.

Learn:

- authentication vs authorization
    
- token rotation
    
- cookie security
    
- CSRF
    
- CORS
    
- RBAC
    
- brute-force protection
    
- rate limiting
    
- password reset flows
    
- secret management
    

---

# 2. Anime catalog

Entities:

```text
User
Anime
Genre
Episode
Season
WatchHistory
Watchlist
Rating
```

```text
Anime
 ├── id
 ├── title
 ├── description
 ├── cover_image
 ├── status
 ├── release_year
 └── ...
```


```text
Episode
 ├── id
 ├── anime_id
 ├── season
 ├── episode_number
 ├── title
 ├── duration
 └── media_status
```

### API

Something roughly like:

```text
GET    /anime
GET    /anime/{id}
POST   /anime              admin
PATCH  /anime/{id}        admin
DELETE /anime/{id}        admin

GET    /anime/{id}/episodes
POST   /anime/{id}/episodes admin
```

Learn:

- REST API design
    
- pagination
    
- filtering
    
- sorting
    
- database relationships
    
- indexes
    
- query optimization
    

---

# 3. Search


Start with **PostgreSQL full-text search**.

```text
GET /anime/search?q=naruto
```

Learn:

- `tsvector`
    
- full-text search
    
- indexes
    
- query planning
    
- `EXPLAIN ANALYZE`
    


```text
PostgreSQL
     │
     ▼
Search engine
```

---

# 4. Watchlist

Simple CRUD:

```text
POST   /users/me/watchlist/{anime_id}
DELETE /users/me/watchlist/{anime_id}
GET    /users/me/watchlist
```

But use this to learn:

- unique constraints
    
- foreign keys
    
- transactions
    
- pagination
    

For example:

```text
UNIQUE(user_id, anime_id)
```

So a user can't add the same anime twice.

---

# 5. Watch progress

This is more interesting.

```text
User
 │
 └── WatchProgress
       ├── anime_id
       ├── episode_id
       ├── position_seconds
       ├── completed
       └── updated_at
```

The frontend periodically sends:

```text
PATCH /episodes/{id}/progress
```

Example:

```json
{
  "position": 742
}
```

Now you're dealing with:

- frequent writes
    
- upserts
    
- race conditions
    
- Redis caching
    
- database optimization
    

**This is where Redis starts becoming useful.**

---

# 6. Admin upload

Initially:

```text
Admin
  │
  ▼
FastAPI
  │
  ▼
Local filesystem
```

Don't start with S3/object storage yet.

Store something like:

```text
media/
└── anime-id/
    └── episode-01/
        └── original.mkv
```

---

# 7. Deployment

Before Docker, actually deploy it manually once.

```text
Internet
   │
   ▼
VPS
   │
   ├── Nginx
   │
   ├── FastAPI
   │
   ├── PostgreSQL
   │
   └── Redis
```

Learn:

- SSH
    
- Linux users/groups
    
- systemd
    
- firewall
    
- ports
    
- processes
    
- logs
    
- DNS
    
- TLS
    
- reverse proxy
    
- environment variables
    
- database backups
    

This is important.

**Don't Dockerize before you've experienced the pain of deploying it manually.**

---

# Phase 2 — Containerize + automate

Now you take your working Rei deployment and make it reproducible.

## Docker architecture

```text
docker compose
│
├── nginx
├── api
├── postgres
├── redis
└── worker        ← later
```

### Docker

Learn:

- images
    
- containers
    
- layers
    
- Dockerfile
    
- multi-stage builds
    
- volumes
    
- networks
    
- health checks
    
- resource limits
    
- container logs
    

FastAPI image should eventually be something like:

```text
Dockerfile
    │
    ├── dependency installation
    ├── application
    └── non-root user
```

Don't run your application as root just because it works.

---

# CI/CD

Pipeline:

```text
                  Push / PR
                     │
                     ▼
               GitHub Actions
                     │
       ┌─────────────┼──────────────┐
       ▼             ▼              ▼
     Tests         Lint         Security
       │             │              │
       └─────────────┼──────────────┘
                     ▼
               Docker Build
                     │
                     ▼
             Container Registry
                     │
                     ▼
                  Deploy
```

### CI should eventually do

```text
pytest
ruff
mypy
dependency scan
secret scan
Docker build
Docker image scan
```

Start simple and add security checks progressively.

### CD

Initially:

```text
GitHub Actions
      │
      ▼
SSH into VPS
      │
      ▼
docker compose pull
      │
      ▼
docker compose up -d
```

---

# Phase 3 — Media pipeline

currently
```text
Admin
  │
  ▼
FastAPI
  │
  ▼
original.mkv
```

becomes:

```text
                 Upload
                    │
                    ▼
              Original Video
                    │
                    ▼
                   Queue
                    │
                    ▼
                 Worker
                    │
                    ▼
                  FFmpeg
                    │
       ┌────────────┼────────────┐
       ▼            ▼            ▼
     360p         720p         1080p
       │            │            │
       └────────────┼────────────┘
                    ▼
              HLS Packaging
                    │
                    ▼
              Object Storage
                    │
                    ▼
                 Player
```

---

## Queue

use **Redis + Celery** or **Redis + RQ** initially.

For learning, I'd lean toward **Celery** because it exposes you to more of the concepts you'll eventually encounter in distributed job processing.

Your API shouldn't do:

```python
upload()
ffmpeg()
return response
```

Instead:

```text
upload
  ↓
create job
  ↓
queue job
  ↓
return
```

Then:

```text
Worker
  ↓
FFmpeg
  ↓
update job status
```

Job states:

```text
PENDING
PROCESSING
COMPLETED
FAILED
```

Now learn:

- asynchronous jobs
    
- queues
    
- workers
    
- retries
    
- timeouts
    
- idempotency
    
- dead-letter handling
    
- job status tracking
    
- concurrency
    

---

# FFmpeg

Learn:

```text
Input
 ↓
demux
 ↓
decode
 ↓
filter
 ↓
encode
 ↓
mux
 ↓
output
```

Then understand:

- codecs
    
- bitrate
    
- resolution
    
- frame rate
    
- H.264/H.265/AV1
    
- audio codecs
    
- transcoding
    
- CPU vs GPU encoding
    

---

# HLS

Instead of:

```text
episode.mp4
```

produce:

```text
episode/
├── master.m3u8
├── 360p/
│   ├── playlist.m3u8
│   ├── segment001.ts
│   ├── segment002.ts
│   └── ...
├── 720p/
│   └── ...
└── 1080p/
    └── ...
```

Learn:

- manifests
    
- segments
    
- adaptive bitrate streaming
    
- bandwidth selection
    

Now the browser can switch quality dynamically.

---

# Object storage

Move media out of your API server.

```text
             API
              │
              ▼
          Job Queue
              │
              ▼
           Worker
              │
              ▼
        Object Storage
              │
              ▼
             CDN
              │
              ▼
           Browser
```

For development you can use **MinIO** locally.

Then later use an S3-compatible provider.

This teaches you the distinction between:

> **application storage vs object storage**

which is an important infrastructure concept.

---

# Phase 4 — Production infrastructure

## Infrastructure as Code

Use Terraform.

```text
terraform/
├── network/
├── compute/
├── database/
├── storage/
└── monitoring/
```

Terraform manages:

```text
Server
Firewall
Networking
Storage
DNS
Database
```

The principle:

> **If you had to rebuild the server tomorrow, could you do it from code?**

---

# Scaling

Start with:

```text
              Load Balancer
                    │
             ┌──────┴──────┐
             ▼             ▼
           API 1         API 2
             │             │
             └──────┬──────┘
                    │
              PostgreSQL
```

Then workers:

```text
             Redis Queue
                  │
       ┌──────────┼──────────┐
       ▼          ▼          ▼
    Worker 1   Worker 2   Worker 3
```

Learn:

- horizontal scaling
    
- stateless applications
    
- load balancing
    
- connection pooling
    
- database bottlenecks
    
- queue backpressure
    
- worker concurrency
    

---

# Observability

First define:

### Metrics

```text
HTTP requests/sec
HTTP error rate
p50/p95/p99 latency
active users
DB connections
Redis memory
queue depth
encoding jobs
encoding failures
```

Then:

```text
                    Nami
                      │
             ┌────────┼────────┐
             ▼        ▼        ▼
          Metrics     Logs    Traces
             │        │        │
             └────────┼────────┘
                      ▼
                 Observability
                      │
                      ▼
                   Grafana
```

Use **Prometheus + Grafana** for metrics initially.

For logs, start with structured JSON logs and centralized collection later.

---

# Backups

This deserves its own attention.

You need:

```text
PostgreSQL
    │
    ▼
Automated backup
    │
    ▼
Object storage
```

And then actually test:

> **Can I restore Rei from the backup?**

A backup that you've never restored is just a theory.

Learn:

- backup strategy
    
- retention
    
- point-in-time recovery concepts
    
- database dumps
    
- restore procedures
    

---

# Health checks

Your API should expose something like:

```text
GET /health
GET /ready
```

But make the distinction meaningful.

```text
/health
    ↓
"I'm alive"

 /ready
    ↓
"Can I actually serve traffic?"
    │
    ├── PostgreSQL ✓
    ├── Redis ✓
    └── required dependencies ✓
```

This becomes important once you have multiple instances.

---

# Where DevSecOps fits

I wouldn't make security a giant separate phase.

**Security should be progressively integrated into every phase.**

For example:

### Phase 1

- Argon2id
    
- secure cookies
    
- RBAC
    
- input validation
    
- SQL injection prevention
    
- rate limiting
    
- HTTPS
    

### Phase 2

CI security:

```text
SAST
Dependency scanning
Secret scanning
Container scanning
```

### Phase 3

Media security:

```text
Private object storage
Signed URLs
Access control
Upload validation
Resource limits
```

### Phase 4

Infrastructure:

```text
Least privilege
Firewall
Secrets management
Network isolation
Container hardening
Audit logs
```

That's much more realistic than:

> "Phase 5: now I do security."

---

# Your actual roadmap

So I'd turn your notes into this:

```text
                      REI 
                       │
          ┌────────────┼────────────┐
          │            │            │
          ▼            ▼            ▼
       PRODUCT      DEVOPS       SECURITY
          │            │            │
          │            │            │
    ┌─────┴─────┐      │            │
    │           │      │            │
   Auth       Catalog  │            │
    │           │      │            │
   Watch      Search   │            │
   Progress   Upload   │            │
          │            │            │
          └──────┬─────┘            │
                 ▼                  │
              DEPLOY                │
                 │                  │
                 ▼                  │
              DOCKER                │
                 │                  │
                 ▼                  │
              CI/CD ◄───────────────┘
                 │
                 ▼
          MEDIA PIPELINE
                 │
          ┌──────┼──────┐
          ▼      ▼      ▼
       Queue   Worker  FFmpeg
                 │
                 ▼
            HLS + Storage
                 │
                 ▼
           PRODUCTION
                 │
       ┌─────────┼─────────┐
       ▼         ▼         ▼
   Terraform  Scaling  Observability
       │         │         │
       └─────────┼─────────┘
                 ▼
             Production
```

### And the specific technology progression I'd use:

| Stage      | Technology                                                                 |
| ---------- | -------------------------------------------------------------------------- |
| Backend    | **FastAPI + PostgreSQL**                                                   |
| Cache      | **Redis**                                                                  |
| Auth       | **Argon2id + JWT + secure HTTP-only cookies + RBAC**                       |
| Server     | **Linux + systemd + Nginx**                                                |
| Containers | **Docker + Compose**                                                       |
| CI/CD      | **GitHub Actions**                                                         |
| Registry   | **GHCR**                                                                   |
| Jobs       | **Celery + Redis**                                                         |
| Video      | **FFmpeg + HLS**                                                           |
| Storage    | **S3-compatible storage / MinIO**                                          |
| IaC        | **Terraform**                                                              |
| Metrics    | **Prometheus**                                                             |
| Dashboards | **Grafana**                                                                |
| Logs       | **Structured logs → centralized logging**                                  |
| Scaling    | **Load balancer + multiple API/worker instances**                          |
| Security   | **SAST + dependency + secret + container scanning + DAST**                 |
| Kubernetes | **Only if the system reaches the point where it solves an actual problem** |
