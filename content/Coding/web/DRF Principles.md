---
title: what is REST API?
tags:
  - django
  - rest
  - restfulapi
date: 2025-08-25
---

# what is REST API?

REST API is an architectural style of designing **networked applications**, specially **web services**. It uses a standard HTTP methods (POST, GET, PUT , DELETE).

# Core principles of REST API

## Client-Server separation

- The client and the server are separated in other words the client (mobile app , web app) handles the request while the server handles the database and the  the process

## Statelessness

- Each request from a client to a server must contain all the information necessary to understand the request.
- The server does not store any client context between requests, promoting scalability and reliability.

## Cacheability

- Responses must explicitly indicate if they are cacheable (e.g., via HTTP headers like Cache-Control). This reduces server load and improves performance by allowing clients or intermediaries (like CDNs) to reuse responses for identical requests

## Uniform interface

- a consistent way of interacting with resources is maintained through the use of standard HTTP methods (POST, GET, DELETE, PUT) for specific actions (create, retrieve, delete, update)

## Layered system

- The architecture can have multiple layers (load balancers, databases, ...), but each component only interacts with the adjacent layer, this improves security.

# Key Components and Principles in DRF

## 1. Serializers: Handling Representations

Serializers convert complex data (e.g., Django QuerySets or models) into Python datatypes, then into JSON/XML for responses (serialization). They also parse incoming data for validation and conversion (deserialization). This enforces the uniform interface by standardizing data representations.

- **How They Work**: Similar to Django forms. Define fields, validate data with `.is_valid()`, and save with `.save()`. For deserialization, implement .create() and .update() for model interactions.
- **Types**:
  - `Serializer`: Basic, for custom data.
  - `ModelSerializer`: Maps to Django models, auto-generates fields and validators.
  - `HyperlinkedModelSerializer`: Uses hyperlinks for relationships (supports HATEOAS).
  - `ListSerializer`: For lists of objects (use with `many=True`).
  - `Best Practices`: Explicitly list `fields` to avoid exposing sensitive data. Use `read_only_fields` for security. Handle nested data with custom methods for writes.

```python
from rest_framework import serializers
from django.contrib.auth.models import User
  
class UserSerializer(serializers.ModelSerializer):
 class Meta:
  model = User
  fields = ['id', 'username', 'email']
 ```

## 2. Views: Processing Requests and Responses

Views handle incoming requests, enforce statelessness (no session storage), and return responses. They map HTTP methods to actions, supporting client-server separation.
- **How They Work**: Use DRF's `Request` and `Response` objects for content negotiation (e.g., JSON vs. XML).
- **Types**:
    - `APIView`: Base class, handles authentication/throttling before dispatching to methods like` .get()`.
    - `GenericAPIView`: Adds queryset and serializer support, often with mixins for CRUD.
    - `ViewSet`: Combines list/create/retrieve/update/delete into one class for efficiency.
    - Function-based: Use `@api_view` decorator for simplicity.
- **Best Practices**: Override `.initial()` or `.handle_exception()` for custom logic. Use class attributes for policies (e.g., `permission_classes`
Example:
```python
from rest_framework.views import APIView
from rest_framework.response import Response

class UserList(APIView):
    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)
```

## 3. Routers: Uniform URL Routing

Routers automatically generate URL patterns for ViewSets, ensuring a consistent, resource-based interface (e.g., `/users/` for list, `/users/{id}/` for detail).

- **How They Work**: Register ViewSets with a prefix; supports extra actions via `@action`.
- **Types**: `SimpleRouter` (basic), `DefaultRouter` (adds root API view and format suffixes).
- **Best Practices**: Use namespaces for versioning. Customize for read-only APIs.
- **Example**:

```python
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'users', UserViewSet)
urlpatterns = router.urls
```

## 4. Authentication: Identifying Clients

Authentication identifies users without storing state, aligning with statelessness. It sets `request.user` and `request.auth`.

- **How It Works**: Tries schemes in order; fails to 401/403.
- **Schemes**: Basic (username/password), Token (API keys), Session (for web), RemoteUser.
- **Best Practices**: Use HTTPS; combine with permissions.
- **Example**: Set globally in settings: '`DEFAULT_AUTHENTICATION_CLASSES': ['rest_framework.authentication.TokenAuthentication']`.

## 5. Permissions: Access Control

Permissions enforce who can access what, supporting layered security and uniform interface by restricting based on roles.

- **How They Work**: Checked before view execution; object-level via `.check_object_permissions()`.
- **Built-in**: `AllowAny`, `IsAuthenticated`, `IsAdminUser`, `DjangoModelPermissions`.
- **Best Practices**: Custom subclasses for fine-grained control.
- **Example**: permission_classes =`[permissions.IsAuthenticated]`.

## 6. Throttling: Rate Limiting for Cacheability and Scalability

Throttling prevents abuse, indirectly supporting cacheability by reducing unnecessary requests.

- **How It Works**: Based on IP/user; uses cache for tracking.
- **Types**: `AnonRateThrottle`, `UserRateThrottle`, `ScopedRateThrottle`.
- **Best Practices**: Set rates like '100/day'; custom for bursts.
- **Example**:`'DEFAULT_THROTTLE_CLASSES': ['rest_framework.throttling.UserRateThrottle']`.

## Pagination: Handling Large Datasets

Pagination splits results, making APIs cacheable and efficient for large resources.

- **How It Works**: Applies to lists; includes next/previous links (HATEOAS).
- **Styles**: `PageNumberPagination` (?page=2), `LimitOffsetPagination` (?limit=10&offset=20), `CursorPagination` (opaque cursors).
- **Best Practices**: Set `PAGE_SIZE`; customize templates.
- **Example**: `'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination'`.

## 8. Versioning: Evolving the API

Versioning allows changes without breaking clients, maintaining uniform interface over time.

- **How It Works**: Extracts version from request (URL, header); affects serializers/views.
- **Schemes**: `AcceptHeader`, `URLPath`, `Namespace`, `HostName`, `QueryParameter`.
- **Best Practices**: Use `ALLOWED_VERSIONS`; pass request to `reverse()`.
- **Example**: `'DEFAULT_VERSIONING_CLASS': 'rest_framework.versioning.URLPathVersioning'`.

## Best Practices for Django REST APIs

- Follow REST principles strictly: Use proper HTTP methods/statuses.
- Test with tools like Postman.
- Document with DRF's browsable API or Swagger.
- Secure with HTTPS, validate inputs, and monitor usage.
- For performance: Use caching (e.g., Django's cache framework) and optimize queries.

# Code Example

---

## Setup: Project and Model

First, let's set up a Django project and define a `Book` model. Run these commands to create a project and app:

```bash
django-admin startproject bookstore
cd bookstore
python manage.py startapp books
```

Add `'rest_framework'` and `'books'` to `INSTALLED_APPS` in `bookstore/settings.py`:

```python
INSTALLED_APPS = [
    ...
    'rest_framework',
    'books',
]
```

Define the `Book` model in `books/models.py`:

```python
from django.db import models

class Book(models.Model):
    title = models.CharField(max_length=200)
    author = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=6, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
```

Run migrations:

```bash
python manage.py makemigrations
python manage.py migrate
```

Create a superuser for testing:

```bash
python manage.py createsuperuser
```

---

## 1. Serializers: Handling Representations

Serializers convert the `Book` model to JSON and validate incoming data. They ensure the uniform interface by standardizing data representations.

**Code Example** (`books/serializers.py`):

```python
from rest_framework import serializers
from .models import Book

class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ['id', 'title', 'author', 'price', 'created_at']
        read_only_fields = ['created_at']  # Prevent modification

    def validate_price(self, value):
        if value <= 0:
            raise serializers.ValidationError("Price must be positive.")
        return value
```

**Explanation**:

- `ModelSerializer` maps to the `Book` model, auto-generating fields.
- `read_only_fields` ensures `created_at` can't be modified.
- `validate_price` adds custom validation for incoming data.

**Usage**: This serializer will be used in views to serialize/deserialize `Book` instances to/from JSON.

---

## 2. Views: Processing Requests and Responses

Views handle HTTP requests and return responses, ensuring statelessness by processing each request independently.

**Code Example** (`books/views.py`):

```python
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Book
from .serializers import BookSerializer

class BookList(APIView):
    def get(self, request):
        books = Book.objects.all()
        serializer = BookSerializer(books, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = BookSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
```

**Explanation**:

- `APIView` handles GET (list books) and POST (create book).
- `get` serializes all books to JSON.
- `post` validates and saves new book data, returning 201 on success or 400 on error.
- Each request is self-contained, supporting REST's statelessness.

**Usage**: Map this view to a URL to handle `/books/` endpoint requests.

---

## 3. Routers: Uniform URL Routing

Routers generate consistent URL patterns for ViewSets, ensuring a resource-based uniform interface (e.g., `/books/` for list, `/books/{id}/` for detail).

**Code Example** (`books/views.py` - add ViewSet, then `bookstore/urls.py`):

```python
# books/views.py
from rest_framework.viewsets import ModelViewSet
from .models import Book
from .serializers import BookSerializer

class BookViewSet(ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
```

```python
# bookstore/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from books.views import BookViewSet

router = DefaultRouter()
router.register(r'books', BookViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
```

**Explanation**:

- `ModelViewSet` provides list, create, retrieve, update, and delete actions.
- `DefaultRouter` maps `/books/` (list/create) and `/books/{id}/` (retrieve/update/delete).
- This enforces REST's resource identification via URIs.

**Usage**: Access endpoints like `http://localhost:8000/books/` or `http://localhost:8000/books/1/`.

---

## 4. Authentication: Identifying Clients

Authentication identifies users without storing state, using tokens or other schemes.

**Setup**: Enable token authentication and generate tokens:

```bash
python manage.py migrate  # Ensure token tables are created
```

Add to `bookstore/settings.py`:

```python
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
        
        # For browsable API        
        'rest_framework.authentication.SessionAuthentication',  

    ],
}
```

Generate a token for a user via Django shell:

```bash
python manage.py shell
>>> from rest_framework.authtoken.models import Token
>>> from django.contrib.auth.models import User
>>> user = User.objects.get(username='your_username')
>>> token = Token.objects.create(user=user)
>>> print(token.key)
```

**Code Example** (`books/views.py` - modify `BookViewSet`):

```python
from rest_framework.viewsets import ModelViewSet
from rest_framework.authentication import Token[[Django Authentication|Authentication]]
from .models import Book
from .serializers import BookSerializer

class BookViewSet(ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    authentication_classes = [TokenAuthentication]  # Require token
```

**Explanation**:

- `TokenAuthentication` checks for `Authorization: Token <token>` in headers.
- If valid, sets `request.user`; otherwise, returns 401 Unauthorized.
- Stateless: each request includes the token.

**Usage**: Include `Authorization: Token <your_token>` in API requests (e.g., via Postman).

---

## 5. Permissions: Access Control

Permissions restrict access, ensuring only authorized users perform actions.

**Code Example** (`books/views.py` - update `BookViewSet`):

```python
from rest_framework.viewsets import ModelViewSet
from rest_framework.authentication import Token[[Django Authentication|Authentication]]
from rest_framework.permissions import IsAuthenticated
from .models import Book
from .serializers import BookSerializer

class BookViewSet(ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]  # Require logged-in user
```

**Explanation**:

- `IsAuthenticated` ensures only authenticated users can access the ViewSet.
- Returns 403 Forbidden if not authenticated.
- Supports layered security by combining with authentication.

**Usage**: Unauthenticated requests to `/books/` will fail with 403.

---

## 6. Throttling: Rate Limiting for Cacheability and Scalability

Throttling limits request frequency, reducing server load and supporting cacheability.

**Setup** (`bookstore/settings.py`):

```python
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.UserRateThrottle',
        'rest_framework.throttling.AnonRateThrottle',
    ],
    'DEFAULT_THROTTLE_RATES': {
        'user': '100/hour',  # Authenticated users: 100 requests/hour
        'anon': '10/hour',   # Anonymous users: 10 requests/hour
    }
}
```

**Code Example** (`books/views.py` - no change needed, throttling is global):

```python
# Same BookViewSet as above
class BookViewSet(ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
```

**Explanation**:

- `UserRateThrottle` limits authenticated users to 100 requests/hour.
- `AnonRateThrottle` limits anonymous users to 10 requests/hour.
- Uses cache to track requests, aligning with REST's cacheability.

**Usage**: Exceeding limits returns 429 Too Many Requests.

---

## 7. Pagination: Handling Large Datasets

Pagination splits large result sets into pages, with links for navigation (supports HATEOAS).

**Setup** (`bookstore/settings.py`):

```python
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.UserRateThrottle',
        'rest_framework.throttling.AnonRateThrottle',
    ],
    'DEFAULT_THROTTLE_RATES': {
        'user': '100/hour',
        'anon': '10/hour',
    },
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 10,  # 10 books per page
}
```

**Code Example** (`books/views.py` - no change needed):

```python
# Same BookViewSet
class BookViewSet(ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
```

**Explanation**:

- `PageNumberPagination` splits results into pages of 10 books.
- Responses include `next`/`previous` links (e.g., `/books/?page=2`).
- Supports HATEOAS by providing navigation links.

**Usage**: Access `/books/?page=2` to get the second page of results.

---

## 8. Versioning: Evolving the API

Versioning allows API evolution without breaking clients, maintaining a uniform interface.

**Setup** (`bookstore/settings.py`):

```python
REST_FRAMEWORK = {

'DEFAULT_AUTHENTICATION_CLASSES': [

'rest_framework.authentication.TokenAuthentication',

'rest_framework.authentication.SessionAuthentication',

],

'DEFAULT_VERSIONING_CLASS': 'rest_framework.versioning.URLPathVersioning',

'DEFAULT_VERSION': 'v1',

'ALLOWED_VERSIONS': ['v1', 'v2'],

'VERSION_PARAM': 'version'

}
```

**Setup** (`bookstore/urls.py`):

```python
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from books.views import BookViewSet


router = DefaultRouter()
router.register(r'books', BookViewSet)

urlpatterns = [
path('<str:version>/', include(router.urls)), # e.g., /v1/books/
]
```

**Setup** (`bookstore/views.py`):

```python
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from .models import Book
from .serializers import BookSerializer

class BookViewSet(ModelViewSet):
 queryset = Book.objects.all()
 serializer_class = BookSerializer
 def get_serializer_class(self):
  # Example: Different serializers for different versions
  
  version = self.request.version
  if version == 'v2':
   # Assume BookSerializerV2 exists with different fields
   from .serializers import BookSerializerV2
   return BookSerializerV2
  return BookSerializer
 ```

**Setup** (`bookstore/serializers.py`):

```python
from rest_framework import serializers
from .models import Book
 
class BookSerializer(serializers.ModelSerializer):
 class Meta:
  model = Book
  fields = ['id', 'title', 'author', 'price', 'created_at']
  read_only_fields = ['created_at']

class BookSerializerV2(serializers.ModelSerializer):
 # Example: v2 adds a new field or changes structure
 discounted_price = serializers.SerializerMethodField()
 
 class Meta:
  model = Book
  fields = ['id', 'title', 'author', 'price', 'discounted_price', 'created_at']
 
 
 def get_discounted_price(self, obj):
  return obj.price * 0.9 # 10% discount for v2
```

**Explanation**:

- **Settings**: `URLPathVersioning` extracts the version from the URL (e.g., `/v1/`). `DEFAULT_VERSION` sets `v1` as `default`, and `ALLOWED_VERSIONS` restricts to `v1` and `v2`.
- **URLs**: The `<str:version>/`pattern captures the version (e.g., `/v1/books/`or `/v2/books/`).
- **ViewSet**: `get_serializer_class` customizes the serializer based on the version (`request.version`). This allows different data structures for `v1` and `v2`.
- **Serializers**: `BookSerializerV2` adds a discounted_price field for `/v2/books/`, demonstrating API evolution without breaking `v1` clients.
- **REST Alignment**: Maintains a uniform interface by keeping resource URLs consistent across versions while allowing changes in representation.

**Usage**:

- Run the Django server: `python manage.py runserver`
- Access:
  - `http://localhost:8000/v1/books/` (uses `BookSerializer`).
  - `http://localhost:8000/v2/books/`(uses `BookSerializerV2` with discounted_price).
- Invalid versions (e.g.,`/v3/books/`) return `404`.

**Testing**: Use Postman or curl with a token (from previous authentication setup) to test endpoints. For example:

```bash
curl -H "Authorization: Token <your_token>" http://localhost:8000/v2/books/
```

This setup ensures clients can use different API versions seamlessly, supporting REST's uniform interface principle.

## Related

- [[Django REST Framework Generic API Views - Crash Course]]
- [[Django Concepts]]
- [[Intro to Django]]
- [[Django Channels]]
- [[Creating Django Project]]
- [[Django Channels 1]]
- [[Django Channels 2]]
- [[Session-Based Authentication]]
