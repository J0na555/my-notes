---
title: Load Balancer
date: 2026-09-01
tags:
  - backend
  - loadbalancer
type: note
status: draft
source:
publish: "false"
---
---

## Introduction

A load balancer distributes incoming network traffic across a pool of backend servers. It improves availability, scalability, and performance by preventing any single server from becoming a bottleneck or single point of failure.

## What problem do load balancers solve?

Without a load balancer, all client requests hit a single server, which can become a bottleneck or single point of failure. If that server goes down, the whole service goes down with it. Load balancers:

- Prevent any one server from being overloaded by spreading requests across many.
- Improve reliability by detecting unhealthy servers and routing traffic only to healthy ones.
- Enable horizontal scaling — add more servers behind the LB instead of making one server bigger.
- Enable **zero-downtime deploys**: drain traffic from a server, deploy the new version, add it back to the pool, repeat for the rest — no outage window needed.
- Often provide additional features like TLS termination, DDoS mitigation, and observability.

## Types of Load Balancers

### By implementation

- **Hardware LB:** dedicated appliances (e.g., F5, Citrix ADC) with specialized ASICs for high throughput and low latency.
- **Software LB:** processes running on general purpose servers or VMs (e.g., NGINX, HAProxy, Envoy).
- **Cloud managed LB:** managed services (e.g., AWS ALB/NLB, GCP Load Balancing, Azure Load Balancer) that abstract away infrastructure.
- **DNS-based LB:** round-robin DNS or GeoDNS  the DNS server returns different IPs for the same hostname. Coarse-grained: no real-time health awareness without extra tooling, and DNS caching/TTLs mean failover is slow (a dead IP can keep getting handed out until caches expire).

### By OSI layer

- **Layer 4 (L4) load balancers**: Operate at the transport layer (TCP/UDP), making routing decisions based on IP and port. Fast and simple, but can't inspect application-level data. Good fit when you need raw throughput or you're balancing non-HTTP protocols.
- **Layer 7 (L7) load balancers**: Operate at the application layer (HTTP/HTTPS, gRPC, etc.), routing based on URL path, headers, cookies, or request content. Enable advanced features like path-based routing, canary deployments, and request rewriting. Good fit when you need routing logic or want to terminate TLS at the edge.

## By scope

- **Local/server-farm load balancers**: Distribute traffic within a single data center or cluster.
- **Global Server Load Balancers (GSLB)**: Distribute traffic across multiple data centers or regions, often using DNS-based routing and health checks to direct users to the closest or healthiest site.

## How load balancers distribute traffic

Load balancers use scheduling algorithms to decide which server gets each request.

**Static algorithms**

- **Round Robin**: cycles through servers in order. Simple, but ignores server load — a slow request can pile up on one server while others sit idle.
- **Weighted Round Robin**: assigns weights to servers (more powerful servers get higher weights). Weights are static, so it doesn't adapt if a server slows down at runtime.
- **IP Hash**: hashes client IP to a server, providing session affinity (same client → same server). Breaks down if the client's IP changes mid-session (common on mobile networks switching towers), and can cause uneven distribution when many clients sit behind the same NAT/corporate IP and all hash to one server.

**Dynamic algorithms**

- **Least connections**: sends new requests to the server with the fewest active connections. Doesn't measure request _cost_  10 cheap requests and 10 expensive ones look identical. Also needs a shared/synced connection count if you scale to multiple LB instances, which turns the LB itself into a coordination problem.
- **Least response time**: chooses the server with the lowest recent latency. Needs continuous latency sampling (overhead), and can oscillate  traffic piles onto whichever server just looked fast, making it slow again.
- **Resource based**: uses metrics like CPU, memory, or custom health signals to pick the best server. Requires an agent/exporter on each backend reporting metrics to the LB, which adds infra cost, and there's inherent lag between when a metric is collected and when the LB acts on it.

Many modern load balancers combine multiple strategies and support sticky sessions, health checks, and automatic failover.

## Health checks

- **Active health checks**: the LB proactively pings a health endpoint (e.g., `/health`) on each backend at an interval and marks servers unhealthy if they stop responding correctly.
- **Passive health checks**: the LB watches real traffic, if requests to a server start failing or timing out, it marks that server down without a separate probe.

Most production setups use both: active checks catch a dead server before real traffic hits it, passive checks catch failures active checks might miss between probe intervals.

## Sticky sessions

Sometimes we need the same client to keep hitting the same backend (e.g., in-memory session state). Two common approaches:

- **IP hash**: simple, but breaks on IP changes and can skew distribution behind shared NATs.
- **Cookie-based stickiness**: the LB sets a cookie identifying which backend a client was routed to, and uses that cookie on future requests. More common in practice than IP hash because it doesn't depend on the client's network path staying constant.

The better long-term fix is usually to avoid needing sticky sessions at all  keep session state in a shared store (Redis, a database) so any backend can serve any request.

## The load balancer as a single point of failure

A load balancer sits in front of every request, which means it can become the exact bottleneck/SPOF it was introduced to eliminate. Common mitigations:

- **Active-passive LB pair** with a floating/virtual IP (e.g., using keepalived)  if the active LB dies, the passive one takes over the IP.
- **DNS round-robin across multiple LB IPs**: spreads traffic across several LB instances instead of one.
- **Cloud-managed LBs** (ALB, GCP LB, etc.) are inherently redundant across zones, so this is handled for you.

## L7 features worth knowing

- **Path-based routing**: route by URL path, e.g. `/api/*` → application backend, `/static/*` → a CDN or static file server.
- **Canary / blue-green deployments**: send a small percentage of traffic to a new version before rolling it out fully, using the LB to control the split.
- **Request rewriting**: modify headers, paths, or other request data as it passes through the LB.

## Typical architecture

In a basic setup:

1. Clients send requests to the load balancer's IP or DNS name.
2. The load balancer performs health checks on backend servers and maintains a pool of "healthy" targets.
3. For each incoming request, it applies its algorithm and routing rules to select a backend.
4. The chosen server processes the request and responds; the load balancer forwards the response back to the client.