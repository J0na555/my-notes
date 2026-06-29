---
title: GET /api/products/ - returns list of all products
tags:
  - django
  - genericviews
  - intro_to_django
  - rest
date: 2025-10-20
---

## 1. What are Generic API Views?

Generic API Views are pre-built class-based views that handle common API patterns, so you don't have to write the same code repeatedly.

```python
from rest_framework import generics
```

## 2. The Main Generic Views

### ListAPIView - Read-Only List

```python
from rest_framework import generics
from .models import Product
from .serializers import ProductSerializer

class ProductList(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    
# GET /api/products/ - returns list of all products
```

### RetrieveAPIView - Read-Only Single Object

```python
class ProductDetail(generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    
# GET /api/products/1/ - returns single product
```

### ListCreateAPIView - List + Create

```python
class ProductListCreate(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    
# GET /api/products/ - list all
# POST /api/products/ - create new
```

### RetrieveUpdateAPIView - Read + Update

```python
class ProductRetrieveUpdate(generics.RetrieveUpdateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    
# GET /api/products/1/ - get single
# PUT /api/products/1/ - update full
# PATCH /api/products/1/ - update partial
```

### RetrieveDestroyAPIView - Read + Delete

```python
class ProductRetrieveDestroy(generics.RetrieveDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    
# GET /api/products/1/ - get single
# DELETE /api/products/1/ - delete
```

### RetrieveUpdateDestroyAPIView - Full CRUD on Single Object

```python
class ProductDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    
# GET /api/products/1/ - read
# PUT /api/products/1/ - update full
# PATCH /api/products/1/ - update partial  
# DELETE /api/products/1/ - delete
```

### CreateAPIView - Create Only

```python
class ProductCreate(generics.CreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    
# POST /api/products/ - create new only
```

## 3. Core Components You MUST Define

### Minimum Required

```python
class ProductList(generics.ListAPIView):
    queryset = Product.objects.all()           # Required
    serializer_class = ProductSerializer       # Required
```

### Optional But Useful

```python
class ProductList(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]     # Who can access
    filter_backends = [SearchFilter]           # How to filter
    search_fields = ['name', 'description']    # What to search
    pagination_class = PageNumberPagination    # Pagination
    ordering_fields = ['price', 'name']        # Sorting fields
```

## 4. Customizing Behavior

### Override get_queryset() - Dynamic Filtering

```python
class ActiveProducts(generics.ListAPIView):
    serializer_class = ProductSerializer
    
    def get_queryset(self):
        # Only return active products
        return Product.objects.filter(is_active=True)
```

### Override get_queryset() with URL Parameters

```python
class CategoryProducts(generics.ListAPIView):
    serializer_class = ProductSerializer
    
    def get_queryset(self):
        category_id = self.kwargs['category_id']  # From URL
        return Product.objects.filter(category_id=category_id, is_active=True)
```

### URL for above

```python
path('categories/<int:category_id>/products/', CategoryProducts.as_view())
```

### Override perform_create() - Custom Creation Logic

```python
class ProductCreate(generics.CreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    
    def perform_create(self, serializer):
        # Automatically set the creator to current user
        serializer.save(created_by=self.request.user)
```

## 5. Real-World Examples

### Example 1: User Profile

```python
class UserProfile(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        # Always return the current user's profile
        return self.request.user
```

### Example 2: Searchable Product List

```python
from rest_framework import filters

class ProductSearch(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description', 'category__name']
    ordering_fields = ['price', 'created_at', 'name']
    ordering = ['-created_at']  # Default ordering
```

### Example 3: Category-specific Products

```python
class CategoryProducts(generics.ListAPIView):
    serializer_class = ProductSerializer
    
    def get_queryset(self):
        category_slug = self.kwargs['slug']
        return Product.objects.filter(
            category__slug=category_slug, 
            is_active=True
        ).select_related('category')
```

## 6. Handling URL Parameters

### Path Parameters (URL kwargs)

```python
# urls.py
path('products/<int:pk>/', ProductDetail.as_view())

# views.py  
class ProductDetail(generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    # pk is automatically available in self.kwargs['pk']
```

### Query Parameters (GET params)

```python
class ProductList(generics.ListAPIView):
    serializer_class = ProductSerializer
    
    def get_queryset(self):
        queryset = Product.objects.all()
        
        # Get query parameters
        category = self.request.query_params.get('category')
        min_price = self.request.query_params.get('min_price')
        
        if category:
            queryset = queryset.filter(category__name=category)
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
            
        return queryset

# Usage: /api/products/?category=electronics&min_price=100
```

## 7. [[Django Authentication|Permissions and Authentication]]

```python
from rest_framework import generics, permissions

class ProductCreate(generics.CreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]
    # or [permissions.IsAdminUser]
    # or [permissions.IsAuthenticatedOrReadOnly]
    # or [permissions.AllowAny] - default

class UserProducts(generics.ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # Only show current user's products
        return Product.objects.filter(owner=self.request.user)
```

## 8. Response Customization

```python
class ProductList(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    
    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        # Customize the response
        custom_data = {
            'status': 'success',
            'count': len(response.data),
            'products': response.data
        }
        return Response(custom_data)
```

## 9. Error Handling

```python
class ProductDetail(generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    
    def get_object(self):
        try:
            return super().get_object()
        except Product.DoesNotExist:
            raise NotFound("Product not found")
```

## 10. Complete Practical Example

### Models

```python
from django.db import models

class BlogPost(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_published = models.BooleanField(default=False)
    author = models.ForeignKey('User', on_delete=models.CASCADE)
```

### Serializer

```python
from rest_framework import serializers
from .models import BlogPost

class BlogPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogPost
        fields = ['id', 'title', 'content', 'created_at', 'updated_at', 'is_published', 'author']
        read_only_fields = ['id', 'created_at', 'updated_at', 'author']
```

### Views

```python
from rest_framework import generics, permissions
from .models import BlogPost
from .serializers import BlogPostSerializer

class BlogPostListCreate(generics.ListCreateAPIView):
    serializer_class = BlogPostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        # Show all published posts to anyone
        # Show user's own drafts only to them
        user = self.request.user
        if user.is_authenticated:
            return BlogPost.objects.filter(
                models.Q(is_published=True) | 
                models.Q(author=user, is_published=False)
            )
        return BlogPost.objects.filter(is_published=True)
    
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class BlogPostDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = BlogPostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        # Same filtering logic as above
        user = self.request.user
        if user.is_authenticated:
            return BlogPost.objects.filter(
                models.Q(is_published=True) | 
                models.Q(author=user, is_published=False)
            )
        return BlogPost.objects.filter(is_published=True)
```

### URLs

```python
from django.urls import path
from .views import BlogPostListCreate, BlogPostDetail

urlpatterns = [
    path('posts/', BlogPostListCreate.as_view(), name='post-list-create'),
    path('posts/<int:pk>/', BlogPostDetail.as_view(), name='post-detail'),
]
```

## Quick Reference - Which Generic View to Use?

| Use Case | Generic View |
|----------|--------------|
| List objects only | `ListAPIView` |
| Get single object | `RetrieveAPIView` |
| List + Create | `ListCreateAPIView` |
| Get + Update | `RetrieveUpdateAPIView` |
| Get + Delete | `RetrieveDestroyAPIView` |
| Full CRUD on single | `RetrieveUpdateDestroyAPIView` |
| Create only | `CreateAPIView` |
| Update only | `UpdateAPIView` |

## Key Takeaways

1. **Less Code**: Generic views handle common patterns automatically
2. **Consistent**: Follow REST conventions out of the box
3. **Customizable**: Override methods for specific behavior
4. **Secure**: Built-in permission and authentication support
5. **Maintainable**: Clean separation of concerns

## Related

- [[DRF Principles]]
- [[Django Concepts]]
- [[Intro to Django]]
- [[Django Channels]]
- [[Creating Django Project]]
- [[Django Channels 1]]
- [[Django Channels 2]]
- [[Session-Based Authentication]]
