---
title: Web Framework
date: 2026-06-10
meta: web framework · backend · 2026
publish: "true"
---
# Contents

> - [[#HTTP parser]]
> - [[#Routing]]
> - [[#Controller handlers]]
> - [[#Middleware pipeline]]
> - [[#Error handling]]
> - [[#Template engine]]
> - [[#Complete request flow]]
> - [[#Implementation order]]

---

## HTTP parser

**Purpose:** Convert raw socket data into a structured `Request` object.

### Raw HTTP example
```http
GET /users?id=42 HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{"name": "John"}
```

### Steps to implement
-  Read socket until `\r\n\r\n` (end of headers)
-  Parse request line → `method`, `path`, `version`
-  Parse headers into dict (case-insensitive keys)
-  Read body using `Content-Length` header

### Code skeleton
```python
class Request:
    def __init__(self, raw_bytes: bytes):
        self.method = ""
        self.path = ""
        self.query_params = {}
        self.headers = {}
        self.body = ""
        # TODO: parse raw_bytes
```

### Edge cases
-  Missing headers
-  Chunked transfer encoding
-  Large bodies (need streaming)
-  URL-encoded query params

**Related:** [[#Routing]] | [[#Error handling]]

---

## Routing

**Purpose:** Map `(method, path)` to a controller handler.

### Route table design
```python
routes = {}  # key: (method, path_pattern) -> handler

def add_route(method, path, handler):
    routes[(method, path)] = handler
```

### Path parameter support
| Pattern      | Example            | Captured         |
| ------------ | ------------------ | ---------------- |
| `/users/:id` | `/users/42`        | `id=42`          |
| `/files/*`   | `/files/js/app.js` | wildcard capture |

### Matching logic (priority order)
1. Static routes (exact match)
2. Parameterized routes (extract `:param`)
3. Wildcard routes (`*`)
4. 404 if none match

### Expansion ideas
- Trie/radix tree for performance
- Reverse routing (generate URL from route name)
- Route groups/prefixes

**Related:** [[#Controller handlers]] | [[#HTTP parser]]

---

## Controller handlers

**Purpose:** User code that processes a request and returns a response.

### Handler signature
```python
def handler(request: Request) -> Response:
    # request has .params for path params
    # request has .query_params, .body
    return Response(body="OK", status=200)
```

### Response class skeleton
```python
class Response:
    def __init__(self, body="", status=200, headers=None, content_type="text/html"):
        self.body = body
        self.status = status
        self.headers = headers or {}
        self.content_type = content_type
    
    def to_bytes(self) -> bytes:
        # TODO: build raw HTTP response
        pass
```

### Common helpers to provide
- `render_template(name, context)` → returns HTML Response
- `json_response(data, status=200)` → returns JSON Response
- `redirect(url, status=302)` → returns redirect Response

**Related:** [[#Routing]] | [[#Template engine]]

---

## Middleware pipeline

**Definition:** Functions that run before (and optionally after) the controller.

### Pipeline flow
```
Request → Middleware1 → Middleware2 → Handler → Middleware2 → Middleware1 → Response
```

### Implementation pattern
```python
class Pipeline:
    def __init__(self):
        self.middlewares = []
    
    def add(self, middleware):
        self.middlewares.append(middleware)
    
    def run(self, request, handler):
        # build chain backwards
        def chain(req, idx):
            if idx >= len(self.middlewares):
                return handler(req)
            return self.middlewares[idx](req, lambda r: chain(r, idx + 1))
        return chain(request, 0)
```

### Middleware example
```python
def logger_middleware(request, next_middleware):
    print(f"→ {request.method} {request.path}")
    response = next_middleware(request)
    print(f"← {response.status}")
    return response
```

### Built-in middleware ideas
- Logger
- Auth (sets `request.user`)
- CORS
- Rate limiter
- Compression

**Related:** [[#Error handling]] | [[#Controller handlers]]

---

## Error handling

### Error types to handle
| Error                   | HTTP Status | When                          |
| ----------------------- | ----------- | ----------------------------- |
| `RouteNotFoundError`    | 404         | No route matches              |
| `MethodNotAllowedError` | 405         | Path exists but wrong method  |
| `BadRequestError`       | 400         | Malformed HTTP/invalid params |
| `InternalError`         | 500         | Uncaught exception            |

### Centralized handler
```python
def handle_error(error, request) -> Response:
    if isinstance(error, RouteNotFoundError):
        return Response("Not Found", 404)
    if isinstance(error, MethodNotAllowedError):
        return Response("Method Not Allowed", 405)
    # catch-all for 500s
    return Response("Internal Server Error", 500)
```

### Try-catch wrapper
```python
def process_request(raw_bytes):
    try:
        req = parse_http(raw_bytes)
        handler = router.match(req.method, req.path)
        response = pipeline.run(req, handler)
    except Exception as e:
        response = handle_error(e, req)
    return response.to_bytes()
```

### Dev vs Production
- **Dev:** return full stack trace + error details
- **Production:** log internally, return minimal safe message

**Related:** [[#HTTP parser]] | [[#Middleware pipeline]]

---

## Template engine

**Purpose:** Render dynamic HTML using template files + context data.

### Folder structure
```
templates/
  ├── layout.html
  ├── users/
  │    ├── list.html
  │    └── show.html
```

### Simple engine implementation
```python
class TemplateEngine:
    def __init__(self, template_dir="templates"):
        self.template_dir = template_dir
        self.cache = {}  # optional: cache parsed templates
    
    def render(self, template_name: str, context: dict) -> str:
        # TODO: read file, replace {{ var }}, handle loops/conditions
        content = self._read_template(template_name)
        for key, value in context.items():
            content = content.replace(f"{{{{ {key} }}}}", str(value))
        return content
```

### Integration with framework
```python
def render_template(template_name, context):
    content = engine.render(template_name, context)
    return Response(body=content, content_type="text/html")
```

### Expansion ideas
- Template inheritance (`{% extends %}`)
- Auto-escaping (XSS prevention)
- Caching compiled templates
- Support Jinja2 as alternative

**Related:** [[#Controller handlers]] | [[#Error handling]]

---

## Complete request flow

```
[Socket] 
    ↓
[Read raw HTTP] 
    ↓
[HTTP parser] → Request object
    ↓
[Router] → find handler or 404
    ↓
[Middleware pipeline] (pre)
    ↓
[Controller handler] → Response object
    ↓
[Middleware pipeline] (post)
    ↓
[Error boundary] catches all exceptions
    ↓
[Response.to_bytes()]
    ↓
[Socket write]
```

---

## Implementation order

1. HTTP parser + basic Response (static "Hello World")
2. Router (static routes only)
3. Error handling (404, 500)
4. Controller handlers (Request → Response)
5. Middleware pipeline
6. Path parameters (dynamic routes)
7. Query string parsing
8. Template engine
9. Production hardening (keep-alive, chunked, streaming)

---

## Quick reference table

| Component | Input | Output |
|-----------|-------|--------|
| HTTP parser | raw bytes | `Request` |
| Router | `Request` | handler function |
| Middleware | `Request` | `Request` or `Response` |
| Handler | `Request` | `Response` |
| Error handler | Exception | `Response` |
| Template engine | template name + context | HTML string |
