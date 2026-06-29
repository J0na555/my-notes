---
title: Web Framework
date: 2026-06-10
meta: web framework · backend · 2026
publish: "true"
---
q## Contents

> - [[#Request lifecycle]]
> - [[#HTTP parser]]
> - [[#Routing]]
> - [[#Controller handlers]]
> - [[#framework API design checklist]]
> - [[#Middleware pipeline]]
> - [[#Error handling]]
> - [[#Template engine]]
> - [[#Complete request flow]]
> - [[#Quick reference table]]
> - [[#Framework Comparison Table]]
> - [[#Future Improvements]]
> - [[#Out of Scope]]
> - [[#Framework Architecture Decisions]]
> - [[#Lessons learned]]]

---
When I first thought about building a web framework, I assumed parsing HTTP would take maybe 30 minutes.

I was wrong.

The moment I looked at raw socket data I discovered requests can arrive in chunks, be malformed, use chunked encoding, and even be split across multiple reads.

That's when I realized an HTTP parser is its own project.

## Request lifecycle

```text
                ┌────────────┐
                │   Socket   │
                └─────┬──────┘
                      │
                      ▼
                ┌────────────┐
                │ HTTPParser │
                └─────┬──────┘
                      │
                      ▼
                ┌────────────┐
                │   Router   │
                └─────┬──────┘
                      │
                      ▼
                ┌────────────┐
                │ Middleware │
                └─────┬──────┘
                      │
                      ▼
                ┌────────────┐
                │  Handler   │
                └─────┬──────┘
                      │
                      ▼
                ┌────────────┐
                │  Response  │
                └────────────┘
```


## HTTP parser
- Convert raw socket data into a structured `Request` object.
- raw socket gives bytes arriving in chunks, we can't just simply call `socket.recv(65525)` and parse, cause the request might be
	- incomplete
	- pipelined
	- malicious
	- use legacy formats (HTTP/0.9)

### Raw HTTP example
```http
POST /submit?name=John&age=25 HTTP/1.1\r\n
Host: example.com\r\n
Content-Type: application/x-www-form-urlencoded\r\n
Content-Length: 18\r\n
Authorization: Bearer token123\r\n
\r\n
name=Jane&age=30
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

### Parser Internals

#### Buffer Management
- we shouldn't parse directly from socket.recv() without a buffer, cause when data arrives in chunks we would lose bytes between reads.
```python
class HTTPParser:
    def __init__(self):
        self.buffer = bytearray()  # mutable, efficient append
        self.content_length = None
        self.headers_received = False
        
    def feed(self, data: bytes):
        self.buffer.extend(data)
        return self.try_parse()
```

#### finding header terminators
- header end with `\r\n\r\n`, but naive approach is o(n^2).
```python 
def find_header_end(buffer: bytearray) -> int:
    # Search for \r\n\r\n sequence
    for i in range(len(buffer) - 3):
        if buffer[i] == 13 and buffer[i+1] == 10 and buffer[i+2] == 13 and buffer[i+3] == 10:
            return i + 4  # return position after the blank line
    return -1
```

#### parse request line
```python 
def parse_request_line(line: bytes):
    parts = line.split(b' ')
    if len(parts) != 3:
        raise BadRequest("Malformed request line")
    
    method = parts[0].decode('ascii')  # methods are ASCII only
    path = parts[1].decode('utf-8')    # but path can have UTF-8
    version = parts[2].decode('ascii')
    
    # Validate method
    if method not in ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'OPTIONS', 'PATCH']:
        raise BadRequest(f"Unknown method: {method}")
    
    # Parse query string
    path_only, raw_query = (path.split('?', 1) + [''])[:2]  # trick: ensures 2 elements
    query_params = parse_query_string(raw_query)
    
    return method, path_only, query_params, version
```

#### parse query parameter
```python
from urllib.parse import unquote_plus

def parse_query_string(qs: str) -> dict:
    if not qs:
        return {}
    
    params = {}
    for pair in qs.split('&'):
        if '=' in pair:
            key, value = pair.split('=', 1)
        else:
            key, value = pair, ''  # key without value
        
        key = unquote_plus(key)
        value = unquote_plus(value)
        
        # Handle repeated keys (e.g., ?a=1&a=2)
        if key in params:
            if isinstance(params[key], list):
                params[key].append(value)
            else:
                params[key] = [params[key], value]
        else:
            params[key] = value
    
    return params
```

#### parse headers
```python
def parse_headers(header_bytes: bytes) -> dict:
    headers = {}
    for line in header_bytes.split(b'\r\n'):
        if not line:  # empty line = end of headers (already handled)
            continue
        
        # Find first colon
        colon_idx = line.find(b':')
        if colon_idx == -1:
            raise BadRequest(f"Invalid header: {line}")
        
        key = line[:colon_idx].decode('ascii').lower()  # normalise to lowercase
        value = line[colon_idx+1:].lstrip(b' \t').decode('utf-8')  # strip LWS
        
        # Multi-value headers
        if key in headers:
            if isinstance(headers[key], list):
                headers[key].append(value)
            else:
                headers[key] = [headers[key], value]
        else:
            headers[key] = value
    
    return headers
```


### Edge cases
-  Missing headers
-  Chunked transfer encoding
-  Large bodies (need streaming)
-  URL-encoded query params

### Complete Parser Skeleton
```python 
class Request:
    __slots__ = ('method', 'path', 'query_params', 'headers', 'body', 'http_version')
    
    def __init__(self, method, path, query_params, headers, body, http_version):
        self.method = method
        self.path = path
        self.query_params = query_params
        self.headers = headers
        self.body = body
        self.http_version = http_version
    
    @property
    def json(self):
        if self.headers.get('content-type') == 'application/json':
            import json
            return json.loads(self.body)
        raise ValueError("Not JSON")


class HTTPParser:
    MAX_HEADERS = 100
    MAX_HEADER_SIZE = 8192
    MAX_BODY_SIZE = 10 * 1024 * 1024  # 10MB
    
    def __init__(self):
        self.buffer = bytearray()
        self.state = 'REQUEST_LINE'  # or 'HEADERS', 'BODY'
        self.content_length = 0
        self.body_received = 0
        
    def parse(self, data: bytes):
        self.buffer.extend(data)
        
        if self.state == 'REQUEST_LINE':
            # Find \r\n
            if b'\r\n' not in self.buffer:
                return None  # need more data
            # ... parse request line, update state
```

### Testing
```python
# Test 1: Basic GET
raw = b'GET / HTTP/1.1\r\nHost: localhost\r\n\r\n'

# Test 2: POST with body
raw = b'POST /submit HTTP/1.1\r\nContent-Length: 11\r\n\r\nHello World'

# Test 3: Chunked encoding
raw = b'POST / HTTP/1.1\r\nTransfer-Encoding: chunked\r\n\r\n5\r\nHello\r\n0\r\n\r\n'

# Test 4: Malformed (missing Host)
raw = b'GET / HTTP/1.1\r\n\r\n'

# Test 5: Split across reads
first = b'GET / HTTP/1.1\r\nHost:'
second = b' localhost\r\n\r\n'
```

**Related:** [[#Routing]] | [[#Error handling]]

---

## Routing

Map `(method, path)` to a controller handler.

### Route table internal structures

#### simple list
```python
class Router:
    def __init__(self):
        self.routes = []  # list of (method, pattern, handler, param_names)
    
    def add(self, method, pattern, handler):
        param_names = self._extract_param_names(pattern)
        self.routes.append((method, pattern, handler, param_names))
    
    def match(self, method, path):
        for route_method, pattern, handler, param_names in self.routes:
            if route_method != method:
                continue
            
            params = self._match_pattern(pattern, path, param_names)
            if params is not None:
                return handler, params
        return None, None
```
**Complexity:** O(R) where R = number of routes. Fine for < 100 routes.

#### method-based buckets

```python
class Router:
    def __init__(self):
        self.routes = {
            'GET': [],
            'POST': [],
            'PUT': [],
            'DELETE': [],
            'PATCH': [],
        }
    
    def match(self, method, path):
        for pattern, handler, param_names in self.routes.get(method, []):
            params = self._match_pattern(pattern, path, param_names)
            if params:
                return handler, params
```
Only routes belonging to the matching HTTP method are examined.

#### Radix Tree
- a radix tree (compact prefix tree) gives o(k) lookup where k is path segment length
- In practice, route lookup becomes dependent on path length rather than total route count.
```python
# Visual representation:
# Routes:
#   GET /users/:id
#   GET /users/:id/posts
#   GET /static/*filepath
#
# Radix tree:
#   root
#    ├── "users/" -> param "id"
#    │              ├── (leaf: handler1)
#    │              └── "posts" -> leaf: handler2
#    └── "static/" -> wildcard "filepath" -> leaf: handler3
```
- no linear scan, each byte of path is compared once
- naturally handles parameter extraction
- memory efficient
simplified implementation 
```python
class RadixNode:
    __slots__ = ('prefix', 'children', 'handler', 'param_name', 'wildcard_child')
    
    def __init__(self, prefix=""):
        self.prefix = prefix          # path segment string
        self.children = []            # list of RadixNode
        self.handler = None           # route handler
        self.param_name = None        # e.g., "id" for :id
        self.wildcard_child = None    # special * wildcard

class Router:
    def __init__(self):
        self.root = RadixNode()
    
    def add_route(self, method, path, handler):
        node = self.root
        segments = self._split_path(path)
        
        for i, seg in enumerate(segments):
            if seg.startswith(':'):
                # Parameter node
                param_name = seg[1:]
                if not node.param_name:
                    node.param_name = param_name
                    node.children.append(RadixNode())
                node = node.children[-1]
            elif seg == '*':
                # Wildcard node
                node.wildcard_child = RadixNode()
                node.wildcard_child.handler = handler
                return
            else:
                # Static segment - find or create
                child = self._find_child(node, seg)
                if not child:
                    child = RadixNode(seg)
                    node.children.append(child)
                node = child
        
        node.handler = handler
    
    def match(self, method, path):
        node = self.root
        params = {}
        segments = self._split_path(path)
        
        for i, seg in enumerate(segments):
            # Try static match first
            child = self._find_child(node, seg)
            if child:
                node = child
                continue
            
            # Try parameter match
            if node.param_name:
                params[node.param_name] = seg
                node = node.children[-1]  # assume param is last child
                continue
            
            # Try wildcard
            if node.wildcard_child:
                # Capture remaining path as one parameter
                remaining = '/'.join(segments[i:])
                params['*'] = remaining
                return node.wildcard_child.handler, params
            
            return None, None  # no match
        
        return node.handler, params
```

### Path parameter extraction (deep dive)

#### The `:param` pattern

Your path `/users/:id` needs to:

- Match `/users/42` but NOT `/users/42/posts`
- Extract `{"id": "42"}` 

**Matching algorithm:**

```python
def match_pattern(pattern: str, path: str) -> dict | None:
    pattern_parts = pattern.split('/')
    path_parts = path.split('/')
    
    if len(pattern_parts) != len(path_parts):
        return None
    
    params = {}
    for pattern_part, path_part in zip(pattern_parts, path_parts):
        if pattern_part.startswith(':'):
            param_name = pattern_part[1:]
            params[param_name] = path_part
        elif pattern_part != path_part:
            return None
    
    return params
```


**Gotchas:**

- `/users/42/` vs `/users/42`, decide: normalize or treat as different?
- Empty segments: `//`,  reject as 400.  
- Reserved parameter names: `id`, `slug`, `*`, avoid collisions.

#### Wildcard `*` (catch-all)

```python
# Pattern: /files/*
# /files/js/app.js  -> {"*": "js/app.js"}
# /files/           -> {"*": ""}  (empty capture)
def match_wildcard(pattern, path):
    if not pattern.endswith('*'):
        return None
    
    prefix = pattern[:-1]  # remove '*'
    if not path.startswith(prefix):
        return None
    
    suffix = path[len(prefix):]
    # Remove leading slash from suffix? Depends on design
    return {'*': suffix.lstrip('/')}
```

**Important:** Only ONE wildcard per route, and it must be the last segment.

---

### Priority ordering 
1. **Static** (exact match) — highest priority
2. **Parameterized** (`:id`) — medium priority
3. **Wildcard** (`*`) — lowest priority
4. **404** — fallback

What about this conflict?

```python
routes = [
    GET /users/:id,
    GET /users/profile,   # static
]
```


Static `/users/profile` should match, not parameter. So algorithm must be:

- Check static matches first
- Only try parameter if no static match at that depth 

**Correct matching order with radix tree:**

1. Traverse static children
2. If no static match, try parameter child
3. If no parameter, try wildcard

---

### Reverse routing 

Generate URLs from route names, essential for hypermedia APIs.

```python
router = Router()
router.add('GET', '/users/:id', get_user, name='get_user')
router.add('GET', '/users/:id/posts/:post_id', get_post, name='get_post')
# Reverse lookup
url = router.reverse('get_user', {'id': 42})
# Returns "/users/42"
url = router.reverse('get_post', {'id': 42, 'post_id': 5})
# Returns "/users/42/posts/5"
```

Implementation:
```python
class Router:
    def __init__(self):
        self.routes = {}  # name -> (method, pattern, param_names)
        self.param_pattern = re.compile(r':([a-zA-Z_][a-zA-Z0-9_]*)')
    
    def add(self, method, pattern, handler, name=None):
        if name:
            param_names = self.param_pattern.findall(pattern)
            self.routes[name] = (method, pattern, param_names)
        # ... also add to routing structure
    
    def reverse(self, name, params):
        method, pattern, param_names = self.routes[name]
        
        # Validate all params present
        missing = set(param_names) - set(params.keys())
        if missing:
            raise KeyError(f"Missing params: {missing}")
        
        # Replace :param with values
        result = pattern
        for param in param_names:
            result = result.replace(f':{param}', str(params[param]))
        
        return result
```
---

### Route groups / prefixes

Enable API versioning and middleware scoping.
```python
router = Router()
# Without groups
router.add('GET', '/api/v1/users', list_users)
router.add('POST', '/api/v1/users', create_user)
router.add('GET', '/api/v1/users/:id', get_user)

# With groups (much cleaner)
api = router.group('/api/v1')
api.add('GET', '/users', list_users)
api.add('POST', '/users', create_user)
api.add('GET', '/users/:id', get_user)

# Nested groups
admin = router.group('/admin')
admin.middleware(require_auth)
v1_admin = admin.group('/v1')
```

Implementation:
```python
class RouteGroup:
    def __init__(self, router, prefix, middlewares=None):
        self.router = router
        self.prefix = prefix.rstrip('/')
        self.middlewares = middlewares or []
    
    def add(self, method, path, handler):
        full_path = self.prefix + path
        self.router.add(method, full_path, handler, middlewares=self.middlewares)
        
class Router:
    def group(self, prefix, middlewares=None):
        return RouteGroup(self, prefix, middlewares)
```

---

### Performance benchmarks 
For 1000 routes with 10 parameters:

|Structure|Lookup time|Memory|Notes|
|---|---|---|---|
|Linear list|~50µs|Low|Fine for small apps|
|Map (exact)|~0.1µs|Low|Only static, no params|
|Radix tree|~0.5µs|Medium|Production standard|
|Regex array|~100µs|High|Avoid (Express 4.x uses this)|

**Express 4.x actually uses regex internally**, that's why it slows down with many routes. Modern frameworks (Express 5, Gin, Echo) use radix trees.

---

### Edge cases 

- **Trailing slash normalization**
```text
/users vs /users/
```

Option A: Treat as different routes (RESTful)  
Option B: Redirect /users/ → /users (common)  
Option C: Both match same handler (Django-style)

 - **Overlapping routes with different methods**
```python
GET /users/:id    -> get_user
DELETE /users/:id -> delete_user
```

Same path, different methods, fine, they coexist.

- **Route ordering with defaults**
Some frameworks allow optional segments: `/users/:id?/posts`  
This requires backtracking in parser, complexity jumps significantly.

- **Case sensitivity**
`/Users` vs `/users`
HTTP paths are case-sensitive (spec), but some frameworks normalize to lowercase.

- **Unicode in routes**

`/café/:name`
ensure UTF-8 handling in path splitting.

---

### Testing routing

```python
def test_routing():
    router = Router()
    router.add('GET', '/users/:id', lambda: "user")
    router.add('GET', '/static/*', lambda: "static")
    
    handler, params = router.match('GET', '/users/42')
    assert params == {'id': '42'}
    
    handler, params = router.match('GET', '/static/js/app.js')
    assert params == {'*': 'js/app.js'}
    
    handler, params = router.match('GET', '/notfound')
    assert handler is None
```

**Related:** [[#Controller handlers]] | [[#HTTP parser]]

---

## Controller handlers
User code that processes a request and returns a response.

### Handler signature


```python
# What about:
async def handler(request): ...                    # Async support
def handler(request, db_connection): ...           # Dependency injection
def handler(request, response): ...                # Streaming responses
handler = require_auth(lambda r: ...)               # Decorator stacking
```

the framework needs to decide
- synchronous vs async, 
- how dependencies flow, 
- error boundaries, and 
- response formatting.

---

### Handler signatures across frameworks

| Framework | Signature                                                  | Paradigm                          |
| --------- | ---------------------------------------------------------- | --------------------------------- |
| Flask     | `def index():` (implicit request via `request` global)     | Thread-local magic                |
| Django    | `def view(request, user_id, **kwargs)`                     | Explicit params from routing      |
| Express   | `(req, res) => {}` (mutable response object)               | Mutating API                      |
| FastAPI   | `async def read(user_id: int, db: Session = Depends(...))` | Dependency injection + type hints |
| Gin       | `func(c *gin.Context)`                                     | Context object with methods       |

simplest implementation

```python
class Context:
    """Wraps request and response for a single HTTP request."""
    
    def __init__(self, request: Request, response: Response = None):
        self.request = request
        self.response = response or Response()
        self.params = {}  # Path params (from router)
        self.state = {}   # For middleware to share data
    
    def json(self, data, status=200):
        self.response = json_response(data, status)
        return self.response
    
    def html(self, template, context=None, status=200):
        self.response = render_template(template, context, status)
        return self.response
```

**Handler becomes:**
```python
def user_show(ctx: Context):
    user_id = ctx.params['id']
    user = db.get_user(user_id)
    return ctx.json({"id": user_id, "name": user.name})
```

### Response class skeleton
```python
class Response:
    """HTTP Response with proper header handling."""
    
    # Standard status codes with default phrases
    STATUS_PHRASES = {
        200: "OK",
        201: "Created",
        204: "No Content",
        301: "Moved Permanently",
        302: "Found",
        304: "Not Modified",
        400: "Bad Request",
        401: "Unauthorized",
        403: "Forbidden",
        404: "Not Found",
        405: "Method Not Allowed",
        500: "Internal Server Error",
    }
    
    def __init__(self, body="", status=200, headers=None, content_type="text/html"):
        self.body = body
        self.status = status
        self.headers = headers or {}
        self.content_type = content_type
        self.cookies = []  # For Set-Cookie headers
        self._headers_sent = False  # For streaming
    
    @property
    def status_line(self) -> str:
        phrase = self.STATUS_PHRASES.get(self.status, "Unknown")
        return f"HTTP/1.1 {self.status} {phrase}"
    
    def to_bytes(self) -> bytes:
        """Convert response to raw HTTP bytes."""
        # Always set Content-Type
        if 'Content-Type' not in self.headers:
            self.headers['Content-Type'] = self.content_type
        
        # Convert body to bytes if needed
        if isinstance(self.body, str):
            body_bytes = self.body.encode('utf-8')
        elif isinstance(self.body, (dict, list)):
            # If someone forgot to use json_response
            import json
            body_bytes = json.dumps(self.body).encode('utf-8')
            self.headers['Content-Type'] = 'application/json'
        else:
            body_bytes = bytes(self.body) if self.body else b''
        
        # Set Content-Length (unless chunked)
        if 'Transfer-Encoding' not in self.headers:
            self.headers['Content-Length'] = str(len(body_bytes))
        
        # Build headers string
        headers_lines = [f"{k}: {v}" for k, v in self.headers.items()]
        
        # Add cookies (multiple Set-Cookie headers allowed)
        for cookie in self.cookies:
            headers_lines.append(f"Set-Cookie: {cookie}")
        
        headers_str = "\r\n".join(headers_lines)
        
        # Build full response
        response_bytes = (
            f"{self.status_line}\r\n"
            f"{headers_str}\r\n"
            f"\r\n"
        ).encode('latin-1')  # Headers are latin-1, not UTF-8!
        
        response_bytes += body_bytes
        
        return response_bytes
```
**NB**
- Headers use latin-1 encoding
```python
# This is CRITICAL
# HTTP headers are defined as ISO-8859-1 (latin-1), not UTF-8
# If you use UTF-8, some proxies will break
headers_str.encode('latin-1')  # Correct
headers_str.encode('utf-8')    # Wrong (but usually works until it doesn't)
```

- Content-Length vs Transfer-Encoding
```python
# For large or streaming responses, don't set Content-Length
response = Response(body=open('large.mp4', 'rb'))
response.headers['Transfer-Encoding'] = 'chunked'
```

- Multiple Set-Cookie headers
```python
# Each cookie needs its own header line
response.cookies.append("session=abc123; HttpOnly; Path=/")
response.cookies.append("pref=dark; Max-Age=3600")
# Results in:
# Set-Cookie: session=abc123; HttpOnly; Path=/
# Set-Cookie: pref=dark; Max-Age=3600
```

### Helper functions
#### JSON response
```python
def json_response(data, status=200, headers=None):
    """Create a JSON response."""
    import json
    
    body = json.dumps(data, ensure_ascii=False)
    headers = headers or {}
    headers['Content-Type'] = 'application/json'
    
    return Response(body=body, status=status, headers=headers)
```
#### Redirect response
```python
def redirect(url, status=302, headers=None):
    """Create a redirect response."""
    headers = headers or {}
    headers['Location'] = url
    
    # 302 is temporary, 301 is permanent
    # 303 See Other (POST → GET redirect)
    # 307 Temporary Redirect (preserve method)
    
    body = f'<a href="{url}">Redirecting...</a>'
    return Response(body=body, status=status, headers=headers)
```
**Status code usage:**
- `301` — permanent redirect (cached by browsers)
- `302` — temporary redirect (default)
- `303` — POST-Redirect-GET pattern (after form submission)
- `307` — same as 302 but preserves HTTP method

#### Render template
```python
def render_template(template_name, context=None, status=200):
    """Render HTML template."""
    context = context or {}
    
    # Basic implementation 
    template_str = load_template_file(template_name)
    
    # Simple variable substitution 
    html = template_str
    for key, value in context.items():
        html = html.replace(f"{{{{ {key} }}}}", str(value))
    
    return Response(body=html, status=status, content_type="text/html")
```

### Common pitfalls 

#### Returning non-string body
```python
# Wrong:
response = Response(body=42)  # 42 is int
# Right:
response = Response(body=str(42))
```


#### Missing Content-Type
Set a default 

#### Not handling HEAD requests

HEAD should return same headers as GET but no body:
```python
if request.method == "HEAD":
    response = handler(ctx)  # Handler runs normally
    response.body = ""        # Remove body
    return response
```

### 4. Large file responses

Don't read entire file into memory:
```python
class FileResponse(Response):
    def __init__(self, filepath, status=200):
        self.filepath = filepath
        self.status = status
        self.headers = {
            'Content-Type': mimetypes.guess_type(filepath)[0] or 'application/octet-stream'
        }
    
    def to_bytes(self):
        # This is wrong for large files — need chunked encoding
        # Real implementation: stream in chunks with Transfer-Encoding: chunked
        pass
```
---

##  framework API design checklist

| Feature            | Flask                   | Express               | This framework?        |
| ------------------ | ----------------------- | --------------------- | ---------------------- |
| Access path params | `kwargs['id']`          | `req.params.id`       | `ctx.params['id']`     |
| JSON response      | `jsonify()`             | `res.json()`          | `ctx.json()`           |
| Redirect           | `redirect()`            | `res.redirect()`      | `redirect()` function  |
| Template render    | `render_template()`     | `res.render()`        | `render_template()`    |
| Set cookie         | `response.set_cookie()` | `res.cookie()`        | `ctx.response.cookies` |
| Get cookie         | `request.cook`          | `res.cookie()`        | `ctx.response.cookies` |
| Context            | `request.cookies.get()` | `ctx.request.cookies` | `ctx.request.cookies`  |

**Related:** [[#Routing]] | [[#Template engine]]

---

## Middleware pipeline

**Definition:** Functions that run before (and optionally after) the controller.

### Pipeline flow
```
Request → Middleware1 → Middleware2 → Handler → Middleware2 → Middleware1 → Response
```
```python 
#  call run(request, handler):
#
# logger_middleware receives next = middleware2
#   → prints "→ GET /"
#   → calls next(request) which calls middleware2
#        → middleware2 receives next = handler
#        → calls next(request) which calls handler
#        → handler returns response
#        → prints "handler done"
#   → prints "← 200"
```

### Implementation pattern
```python
class Pipeline:
    def __init__(self):
        self.middlewares = []
    
    def add(self, middleware):
        self.middlewares.append(middleware)
    
    def run(self, request, handler):
        def chain(req, idx):
            if idx >= len(self.middlewares):
                return handler(req)
            return self.middlewares[idx](req, lambda r: chain(r, idx + 1))
        return chain(request, 0)


def logger_middleware(request, next_middleware):
    print(f"→ {request.method} {request.path}")
    response = next_middleware(request)
    print(f"← {response.status}")
    return response

# Handler
def home_handler(request):
    return Response(body="Home", status=200)


# Usage
pipeline = Pipeline()
pipeline.add(logger_middleware)
response = pipeline.run(request, home_handler)
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

`i am too tired to implement these so probably another time`

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
    # Planned errors 
    if isinstance(error, RouteNotFoundError):
        return Response("Not Found", 404)
    if isinstance(error, MethodNotAllowedError):
        return Response("Method Not Allowed", 405)
    if isinstance(error, BadRequestError):
        return Response("Bad Request", 400)
    
    # Unexpected errors (
    # In dev: show details
    # In production: log it, return generic 500
    return Response("Internal Server Error", 500)
```

### simple request/error flow
```python
def process_request(raw_bytes):
    req = None  
    try:
        req = parse_http(raw_bytes)  # May raise BadRequestError
        handler = router.match(req.method, req.path)  # May raise Route/Method errors
        response = pipeline.run(req, handler)  # May raise anything
    except Exception as e:
        response = handle_error(e, req)
    return response.to_bytes()
```

### Where errors comes from
| Layer       | Error type                                    |
| ----------- | --------------------------------------------- |
| HTTP parser | `BadRequestError` (malformed request)         |
| Router      | `RouteNotFoundError`, `MethodNotAllowedError` |
| Middleware  | Any (auth fails → 401? )                      |
| Handler     | Any (validation errors → 400)                 |

### Dev vs Production
- **Dev:** return full stack trace + error details
- **Production:** log internally, return minimal safe message
```python
DEBUG = True  

def handle_error(error, request) -> Response:
    if isinstance(error, RouteNotFoundError):
        return Response("Not Found", 404)
    
    if DEBUG:
        # Send full error to client for testing
        import traceback
        body = traceback.format_exc()
        return Response(body, 500)
    else:
        # Log to file/console, send generic message
        print(f"ERROR: {error}")  # or use logging module
        return Response("Internal Server Error", 500)
```

**Related:** [[#HTTP parser]] | [[#Middleware pipeline]]

---

## Template engine
Renders dynamic HTML using template files + context data.

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
import re

class TemplateEngine:
    def __init__(self, template_dir="templates"):
        self.template_dir = template_dir
        self.cache = {}
    
    def render(self, template_name: str, context: dict) -> str:
        # Read template (with caching)
        if template_name not in self.cache:
            with open(f"{self.template_dir}/{template_name}", 'r') as f:
                self.cache[template_name] = f.read()
        
        content = self.cache[template_name]
        
        # Replace {{ var }}
        for key, value in context.items():
            content = content.replace(f"{{{{ {key} }}}}", str(value))
        
        # Replace {% for item in list %}...{% endfor %}
        loop_pattern = r'\{% for (\w+) in (\w+) %\}(.*?)\{% endfor %\}'
        def replace_loop(match):
            item_name = match.group(1)
            list_name = match.group(2)
            body = match.group(3)
            
            result = ""
            for item in context.get(list_name, []):
                result += body.replace(f"{{{{ {item_name} }}}}", str(item))
            return result
        
        content = re.sub(loop_pattern, replace_loop, content, flags=re.DOTALL)
        
        # Replace {% if var %}...{% endif %}
        if_pattern = r'\{% if (\w+) %\}(.*?)\{% endif %\}'
        def replace_if(match):
            var_name = match.group(1)
            body = match.group(2)
            
            if context.get(var_name):
                return body
            return ""
        
        content = re.sub(if_pattern, replace_if, content, flags=re.DOTALL)
        
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

```python
class WebFramework:
    def __init__(self):
        self.parser = HTTPParser()
        self.router = Router()
        self.pipeline = Pipeline()
        self.engine = TemplateEngine()
    
    def run(self, host="localhost", port=8080):
        import socket
        server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        server.bind((host, port))
        server.listen(5)
        print(f"Serving on http://{host}:{port}")
        
        while True:
            client, addr = server.accept()
            raw_data = client.recv(65535)
            
            # THE COMPLETE FLOW
            response = self.process_request(raw_data)
            
            client.sendall(response.to_bytes())
            client.close()
    
    def process_request(self, raw_bytes):
        try:
            # 1. Parse HTTP
            request = self.parser.parse(raw_bytes)
            
            # 2. Find handler (or 404)
            handler = self.router.match(request.method, request.path)
            if not handler:
                raise RouteNotFoundError()
            
            # 3. Run pipeline + handler
            response = self.pipeline.run(request, handler)
            
        except Exception as e:
            # 4. Error handling
            response = self.handle_error(e, request)
        
        return response
```

### Implementation order

| Step | Minimal goal      | Code to write                                         |
| ---- | ----------------- | ----------------------------------------------------- |
| 1    | Parser + Response | `parse_http()` returns `Request`, `Response("Hello")` |
| 2    | Router (static)   | `router.add("GET", "/", home_handler)`                |
| 3    | Error handling    | `try/except` returns 404/500                          |
| 4    | Handlers          | `def handler(req): return Response(body)`             |
| 5    | Middleware        |  `Pipeline.run()`                                     |
| 6    | Path params       | `/users/:id` → `req.params["id"]`                     |
| 7    | Query string      | `/search?q=hello` → `req.query["q"]`                  |
| 8    | Templates         | `render_template("page.html", {"name": "John"})`      |

---

## Quick reference table
| Component       | Input                   | Output                  | Notes                                                                |
| --------------- | ----------------------- | ----------------------- | -------------------------------------------------------------------- |
| HTTP parser     | raw bytes               | `Request`               |                                                                      |
| Router          | `Request`               | handler function        | Also extracts path params into `Request.params`                      |
| Middleware      | `Request`               | `Request` or `Response` | Can modify Request (e.g., add `user`) or short-circuit with Response |
| Handler         | `Request`               | `Response`              |                                                                      |
| Error handler   | Exception               | `Response`              | Also needs `Request` for logging/context                             |
| Template engine | template name + context | HTML string             | Called from inside handler                                           |

## Framework Comparison Table

|Feature|Flask|Django|Express|FastAPI|This Framework|
|---|---|---|---|---|---|
|Router|Werkzeug|URLConf|path-to-regexp|Starlette|Radix Tree|
|Templates|Jinja2|Django Templates|Optional|Jinja2|Custom|
|Middleware|WSGI|Middleware Stack|Chain|ASGI|Pipeline|
|Request Context|Global|Request Object|req/res|Dependency Injection|Context|


## Future Improvements

- Async support
- WebSockets
- Keep-Alive
- Dependency Injection
- Session management
- CSRF protection
- Template inheritance
- Static file serving
- Multipart/form-data parser
- Streaming responses

## Out of Scope
For simplicity, this framework does not currently support:
- HTTP/2
- TLS/HTTPS
- WebSockets
- Async handlers
- Multipart uploads
- Keep-Alive connections

## Framework Architecture Decisions

### Parser
Choice:
- Stateful parser
Reason:
- Supports partial reads
- Handles chunked data safely
### Router
Choice:
- Radix tree
Reason:
- Lookup depends on path length rather than route count
### Middleware
Choice:
- Onion pipeline model
Reason:
- Supports both pre-processing and post-processing
### Context
Choice:
- Context object
Reason:
- Centralized request state
- Easier middleware communication
### Templates
Choice:
- Simple string replacement
Reason:
- Easy to understand
- Minimal implementation complexity


## Lessons learned
- HTTP is far more complicated than it initially appears.
- Routing is mostly a data structure problem.
- Middleware is essentially function composition.
- Response generation is simpler than request parsing.
- Most framework complexity comes from edge cases rather than happy paths.