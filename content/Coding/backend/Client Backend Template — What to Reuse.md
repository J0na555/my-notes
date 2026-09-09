---
tags: [backend, typescript, client-work, template, ai-assistant]
created: 2026-09-09
---

## Client Projects Analyzed

- **Ethio-afro-tour** — Express + Prisma + TSX + Gemini/OpenAI
- **Ethio-origins-tour** — Express + Prisma + TSX + Gemini/OpenAI/Anthropic/Grok/NVIDIA
- **Hamba-ethiopian-tours** — Django + RAG + Gemini embeddings
- **Rove-car-rental** — Next.js frontend only, no backend AI

## What's Identical Across Projects

Every TypeScript backend (Ethio-afro-tour, Ethio-origins-tour) has the same bones:

### 1. Server scaffold

Same `server.ts` → `app.ts` → `routes.ts` pattern. Same tsconfig, same scripts (`dev`, `build`, `start`). Same Prisma generate flow.

### 2. AI assistant module

This is the biggest repetition. Every project has:

- **Provider abstraction** — `createProvider()` that switches on `ASSISTANT_PROVIDER` env var to pick OpenAI/Gemini/etc
- **Context builder** — Query Prisma tables (tours, destinations, packages, blog posts), format as text, inject into system prompt
- **Session management** — Track conversation history, limit messages per session, limit daily usage
- **Chat route** — `POST /api/v1/assistant/chat` with session ID, message, and IP hash

The code in `provider.client.ts` and `assistant.service.ts` is nearly identical between the two Express projects.

### 3. Email service

Same nodemailer + SendGrid pattern. Same admin notification emails, customer confirmation emails, status update emails. The HTML templates change but the structure is the same.

### 4. Auth middleware

JWT + cookie-based admin auth. Same `auth.middleware.ts` pattern.

### 5. File upload

Same multer + storage provider pattern (local vs S3 vs database).

## What Actually Changes Per Client

| What | Why it changes |
|------|----------------|
| **Prisma schema** | Each client has different models (tours vs products vs listings) |
| **Context builder queries** | Which tables to pull for AI grounding |
| **System prompt** | Brand name, tone, what the assistant should/shouldn't do |
| **Email templates** | Branding, content |
| **Rate limits** | Different traffic patterns |

## Template Recommendation

### Make a template for: AI Assistant Module

This is the single highest-value thing to templatize because:

1. **It's the most complex piece** — session management, streaming, rate limiting, provider switching
2. **It's nearly identical across projects** — same provider abstraction, same catalog builder pattern, same route structure
3. **It changes least** — the core architecture works for any domain (tours, products, services)

### The template should include:

```
src/modules/assistant/
  provider.client.ts       # OpenAI + Gemini implementations, createProvider()
  assistant.service.ts     # runChat() orchestration
  context-builder.ts       # CatalogContextBuilder — customizable per client
  session-store.ts         # Session + usage tracking
  gating.ts                # Token estimation, daily/session limits
  assistant.routes.ts      # POST /api/v1/assistant/chat
  assistant.validation.ts  # Zod schemas
```

### What's fill-in-the-blank per client:

- **Context builder** — which Prisma models to query
- **System prompt** — brand name, tone, rules
- **Rate limits** — daily cap, session cap, context size

### What stays the same:

- Provider abstraction (OpenAI/Gemini/Anthropic switching)
- Session creation/resume logic
- Token estimation and usage tracking
- Streaming response pattern
- Error handling and timeouts

## Free AI SDK Options

| Provider | SDK | Free Tier |
|----------|-----|-----------|
| Google Gemini | `@google/genai` | 15 RPM, 1M tokens/month |
| OpenAI | `openai` | $5 credit new accounts |
| Anthropic | `@anthropic-ai/sdk` | $5 credit new accounts |
| Groq | `groq-sdk` | Free tier, fast inference |

**Recommendation:** Default to Gemini (`@google/genai`). It's free, already used in 2 of 3 projects, and the SDK is solid.

## Other Things Worth Templating

- Express + Prisma + TSX server scaffold (copy-paste boilerplate)
- Email service (nodemailer + provider)
- Auth middleware (JWT + cookie)
- File upload/storage abstraction

## What NOT to Template

- Database schema — each client has different models
- Hamba's Django stack — completely different framework
- Frontend code — too varied across clients

## Next Steps

1. Build the AI assistant module as a standalone template package
2. Make the context builder configurable (pass in Prisma models + field mappings)
3. Keep provider abstraction as-is — it already works
4. Optional: add embedding service for RAG (Hamba-style) as a separate module
