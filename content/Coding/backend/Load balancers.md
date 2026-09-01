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
## Introduction
A load balancer distributes incoming network traffic across a pool of backend servers. It improves availability, scalability, and performance by preventing any single server from becoming a bottleneck or single point of failure.

## What problem do load balancers solve?
without loadbalancer, all client requests hit a single server, which can become a bottleneck or single point of failure. load balancers:
- prevent any one server from beign overloaded by speading requests across many.
- improve reliability by detecting unhealthy servers and routing traffic only to healthy once
- enable horizontal scalling
- often provide additional features like TLS termination, DDoS mitigation and observebility

## Types of Load Balancers
### by implementation
- **Hardware LB:** dedicated appliances (e.g., F5, Citrix ADC) with speicalized ASICs for high throughput  and low latency

- **Software LB:** processes running on general purpose servers or VMs (e.g., NGINX, HAProxy, Envoy).

- **Cloud manged LB:** managed services (e.g., AWS ALB/NLB, GCP Load Balancing, Azure Load Balancer) that abstract away infrastructure.
### By OSI layer
- **Layer 4 (L4) load balancers**: Operate at the transport layer (TCP/UDP), making routing decisions based on IP and port. They’re fast and simple but can’t inspect application-level data

- **Layer 7 (L7) load balancers**: Operate at the application layer (HTTP/HTTPS, gRPC, etc.), routing based on URL path, headers, cookies, or even request content. They enable advanced features like path-based routing, canary deployments, and request rewriting.

## By scope
- **Local/server-farm load balancers**: Distribute traffic within a single data center or cluster.

- **Global Server Load Balancers (GSLB)**: Distribute traffic across multiple data centers or regions, often using DNS-based routing and health checks to direct users to the closest or healthiest site.

## How load balancers distribute traffic

Load balancers use scheduling algorithms to decide which server gets each request.

**static algorithms**
- Round Robin: cycles through servers in order. simple but ignores server load.
- Weighted Round Robin: assigns weights to servers (more powerfull servers get higher weights)
- IP Hash: hashes client ip to a server, providing session affinity (same client -> same server)

**Dynamic  algorithms**
- **least connections:** sends new requests to the server with the fewest active connections
- **least response time:** choose the server with the lowest recent latency or response time
- **resounce based:** uses metrics like CPU, memory or custom health signals to pick the best server

Many modern load balancers combine multiple strategies and support sticky sessions, health checks and automatic fail over

## Typical architecture

In a basic setup:
1. Clients send requests to the load balancer’s IP or DNS name.

2. The load balancer performs health checks on backend servers and maintains a pool of “healthy” targets.

3. For each incoming request, it applies its algorithm and routing rules to select a backend.

4. The chosen server processes the request and responds; the load balancer forwards the response back to the client.