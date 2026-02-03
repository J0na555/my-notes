---
"title:": " Django Beginner Notes (with Spring Boot References)"
tags:
  - django
  - python
date: 2025-07-16
---

# 🧠 Django: Beginner Notes (with Spring Boot References)

---

## ⚙️ What is Django?

**Django** is a high-level Python web framework that encourages **rapid development** and **clean, pragmatic design**. It's built on the **[[Django Concepts#MVT Pattern (vs MVC in Spring Boot)|Model-View-Template (MVT)]]** architecture.

> ✅ **Spring Boot analogy**: Django is to Python what Spring Boot is to Java. Both are batteries-included frameworks that handle most of the plumbing so you can focus on business logic.

---

## 🧱 Django Project Structure

When you create a Django project:

```bash
[[creating django project|django-admin startproject myproject]]
cd myproject
python manage.py startapp myapp
```

You'll see this structure:

```
myproject/
├── myproject/       ← Settings, WSGI, ASGI (like `application.properties` in Spring Boot)
│   ├── __init__.py
│   ├── settings.py  ← Project-wide configuration
│   ├── urls.py      ← Route definitions (like Spring's @RequestMapping)
│   ├── asgi.py
│   └── wsgi.py
├── myapp/           ← App logic (like Spring Boot modules)
│   ├── [[Django Concepts#Django Model|models.py]]    ← Define database models (like JPA entities)
│   ├── views.py     ← Define request handlers (like @Controller or @RestController)
│   ├── urls.py      ← App-level routing
│   ├── admin.py     ← Admin interface
│   └── apps.py
├── db.sqlite3       ← Default database (can switch to PostgreSQL, MySQL, etc.)
└── manage.py        ← CLI tool (like Spring Boot's `mvn spring-boot:run`)
```

---

## 🔁 MVT Pattern (vs MVC in Spring Boot)

|Django (MVT)|Spring Boot (MVC)|Description|
|---|---|---|
|Model|Model (JPA Entity)|Represents data and DB logic|
|View|Controller|Handles business logic and HTTP requests|
|Template|View (Thymeleaf)|HTML templates rendered with context|

> Django calls the **Controller** the "view" and the **template** is what you’d call "view" in Spring MVC. Confusing at first, but you'll get used to it.

---

## 🗃️ Models (Spring Boot's `@Entity`)

In Django:

```python
# myapp/models.py
from django.db import models

class Product(models.Model):
    name = models.CharField(max_length=100)
    price = models.FloatField()
```

In Spring Boot:

```java
@Entity
public class Product {
    @Id
    @GeneratedValue
    private Long id;
    private String name;
    private Double price;
}
```

- Django auto-generates the table.

- You run `python manage.py makemigrations` and `python manage.py migrate` to sync models with the DB.

---

## 🌐 Routing and Views (Spring's @Controller)

In Django:

```python
# myapp/views.py
from django.http import HttpResponse

def home(request):
    return HttpResponse("Hello, Django!")
```

```python
# myapp/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
]
```

```python
# myproject/urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('myapp.urls')),
]
```

In Spring Boot:

```java
@RestController
public class HomeController {
    @GetMapping("/")
    public String home() {
        return "Hello, Spring!";
    }
}
```

---

## 🧾 Templates (Spring's Thymeleaf equivalent)

Use Django's template system (`.html` files):

```html
<!-- templates/home.html -->
<html>
  <body>
    <h1>Hello, {{ user_name }}!</h1>
  </body>
</html>
```

Render it:

```python
from django.shortcuts import render

def home(request):
    return render(request, "home.html", {"user_name": "Jonas"})
```

---

## 🛡️ Forms and Validation (like Spring’s DTOs + Validation)

Django has `forms.py`:

```python
from django import forms

class ProductForm(forms.Form):
    name = forms.CharField()
    price = forms.FloatField()
```

You use it in views to render and validate input.

Spring Boot analogy:

- Spring: DTOs + `@Valid` + `BindingResult`

- Django: Form classes handle rendering + validation

---

## 🔐 Authentication & Admin Panel

Django gives you a ready-made admin interface and auth system.

```bash
python manage.py createsuperuser
```

Visit `/admin` and log in.

Spring Boot analogy:

- Django Admin = Pre-built admin dashboard

- Spring Boot = You usually build your own or use something like Spring Security + custom UI

---

## 🔄 ORM vs JPA

- Django has its own ORM (no need for Hibernate or JPA).

- You define models as classes, and Django handles SQL generation.

- No need for `@OneToMany`, `@ManyToOne` — instead, you use `ForeignKey`, `ManyToManyField`, etc.

Example:

```python
class Category(models.Model):
    name = models.CharField(max_length=50)

class Product(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
```

Spring Boot equivalent:

```java
@Entity
public class Category {
    @OneToMany(mappedBy = "category")
    private List<Product> products;
}

@Entity
public class Product {
    @ManyToOne
    private Category category;
}
```

---

## 🐍 Useful Django Commands

|Command|Description|
|---|---|
|`django-admin startproject myproject`|Create a new Django project|
|`python manage.py startapp myapp`|Create a new app inside the project|
|`python manage.py runserver`|Start development server|
|`python manage.py makemigrations`|Create DB migration from models|
|`python manage.py migrate`|Apply DB migrations|
|`python manage.py createsuperuser`|Create admin user|
|`python manage.py shell`|Open Python shell with Django context|

---

## 🌍 REST APIs in Django

Use [[DRF principles|Django REST Framework (DRF)]] — like Spring Boot REST APIs.

Install:

```bash
pip install djangorestframework
```

Create API:

```python
# serializers.py
from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'
```

```python
# views.py
from rest_framework import viewsets
from .models import Product
from .serializers import ProductSerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
```

```python
# urls.py
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet

router = DefaultRouter()
router.register(r'products', ProductViewSet)

urlpatterns = router.urls
```

> Django REST Framework = Spring Boot + Spring Data REST + Jackson

---

## 💡 Major Differences from Spring Boot

|Django|Spring Boot|
|---|---|
|Python-based|Java-based|
|Built-in ORM|Uses Hibernate (JPA)|
|Built-in Admin panel|No admin panel out of the box|
|Templates: Jinja-like|Templates: Thymeleaf|
|Uses `manage.py` for CLI|Uses `mvn` or `gradle`|
|Lightweight|More boilerplate|
|REST via DRF|REST via annotations|
|Convention over configuration|Explicit annotations and XML (less now)|

---

## 🔚 Summary

|Concept|Django|Spring Boot Equivalent|
|---|---|---|
|Project structure|`startproject` & `startapp`|Spring Initializr modules|
|Models|`models.py`|`@Entity`, JPA classes|
|Views|`views.py` functions|`@Controller` or `@RestController`|
|Templates|Django Templates|Thymeleaf|
|Routing|`urls.py`|`@RequestMapping`|
|ORM|Built-in|Hibernate + JPA|
|Admin Panel|Built-in `/admin`|Build manually|
|REST|Django REST Framework|Spring Boot REST|

---

## Related

- [[Concurrency and async,await]]
- [[Django REST Framework Generic API Views - Crash Course]]
- [[Django Concepts]]
- [[Python Types hints]]
- [[OOP in Python]]
- [[Django Channels]]
- [[Django Channels 1]]
- [[Django Authentication]]
- [[Django channels 2]]
- [[Python Web Frameworks]]
- [[Session-Based Authentication]]
