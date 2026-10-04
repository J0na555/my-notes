# Ani vault 5 phase DevOps project
1. the actual project 
```
Frontend
   │
   ▼
FastAPI ───── PostgreSQL
   │
   └────────── Redis
```
- [ ] Authentication
- [ ] Anime catalog
- [ ] Search/filter
- [ ] Watchlist
- [ ] Watch progress
- [ ] Episode playback
- [ ] Admin upload

learn linux, networking, postgreSQL, Redis, Nginx, HTTPS, deployment

2. containerize and automate
```
Git push
   │
   ▼
GitHub Actions
   │
   ├── Test
   ├── Lint
   ├── Security checks
   ├── Docker build
   └── Deploy
```

use 
- [ ] Docker
- [ ] Docker compose
- [ ] github actions
- [ ] container registry

3. Build media pipeline
```
       Upload
          │
          ▼
        Queue
          │
          ▼
       Worker
          │
        FFmpeg
          │
    ┌─────┼─────┐
    ▼     ▼     ▼
  360p  720p  1080p
    │     │     │
    └─────┼─────┘
          ▼
     Object Storage
          │
          ▼
       Streaming
```

learn 
- [ ] FFmpeg
- [ ] HLS
- [ ] background jobs
- [ ] queues
- [ ] object storage
- [ ] caching 
- [ ] large file handling

4. production infrastructure 

```
              Internet
                  │
             Load Balancer
                  │
          ┌───────┴───────┐
          ▼               ▼
        API 1            API 2
          │               │
          └───────┬───────┘
                  │
          ┌───────┴────────┐
          ▼                ▼
       PostgreSQL         Redis
          
          Workers
             │
             ▼
       Video Storage
```

introduce 
- [ ] terraform
- [ ] monitoring
- [ ] centralized logging
- [ ] metrics
- [ ] backups
- [ ] health checks
- [ ] load balancing
- [ ] scaling
Use Prometheus/Grafana when you actually have something worth monitoring.