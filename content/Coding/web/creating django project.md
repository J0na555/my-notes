---
title: Setting up a Django Project
tags:
  - django
  - django_concepts
  - python
date: 2025-08-02
---

# Setting up a Django Project

---
Setting up a Django project involves installing Python and Django, creating a virtual environment, creating a new Django project using the django-admin command, configuring the database in the settings.py file, and starting the development server using the python manage.py runserver command. Once the server is running, you can build your web application by creating new apps and adding [[Views|views]], templates, and models. It's a good practice to create a virtual environment for your Django projects to keep them isolated from your system-wide Python installation.

## Setting up a Django project on your computer

### 1. Install Python

Django is a Python web framework, so you'll need to have Python installed on your computer. You can download Python from the official website: [https://www.python.org/downloads/](https://www.python.org/downloads/).

### 2. Install Django

Once you have Python installed, you can install Django using pip, the Python package manager. Open a terminal or command prompt and run the following command:

```python
pip install django
```

This will install the latest version of Django.

### 3. Create a virtual environment

It's a good practice to create a virtual environment for your Django projects. A virtual environment is a self-contained environment that allows you to install packages without affecting your system-wide Python installation. To create a virtual environment, run the following command in your terminal:

```python
python -m venv myenv
```

Replace "myenv" with the name you want to give to your virtual environment.

### 4. Activate the virtual environment

Once you've created the virtual environment, you need to activate it. To activate the virtual environment on Windows, run the following command:

```python
myenv\Scripts\activate
```

On macOS or Linux, run the following command:

```
source myenv/bin/activate
```

### 5. Create a new Django project

With the virtual environment activated, you can create a new Django project using the following command:

```python
django-admin startproject myproject
```

Replace "myproject" with the name you want to give to your project.

### 6. Configure the database

By default, Django uses SQLite as its database backend. If you want to use a different database, you need to modify the settings.py file in your project folder. Look for the DATABASES setting and update it with your database details.

### 7. Run the development server

With the database configured, you can start the development server using the following command:

```python
python manage.py runserver
```

This will start the server on [http://127.0.0.1:8000/](http://127.0.0.1:8000/). You can open this URL in your web browser to see the default Django welcome page.

That's it! You've now set up a Django project on your computer. You can start building your web application by creating new apps and adding views, templates, and models.

# Creating a Django App

---
Steps to create a new Django project:

### 1. Install Django

If you haven't already installed Django, open your terminal or command prompt and run the following command:

```python
pip install django
```

### 2. Create a new project

Once you have installed Django, you can create a new project by running the following command in your terminal or command prompt:

```python
django-admin startproject projek_ST
```

[![](https://github.com/drshahizan/learn-django/raw/main/materials/django/topic/vsc.png)](https://github.com/drshahizan/learn-django/blob/main/materials/django/topic/vsc.png)

Replace "projek_ST" with the name you want to give your new Django project. This command will create a new directory with the same name as your project inside the directory where you ran the command.

### 3. Create a new app

Once you have created a new project, you can create a new app by running the following command:

```python
python manage.py startapp appname
```

Replace "appname" with the name you want to give your new app. This command will create a new directory with the same name as your app inside the project directory.

[![](https://github.com/drshahizan/learn-django/raw/main/materials/django/topic/members.png)](https://github.com/drshahizan/learn-django/blob/main/materials/django/topic/members.png)

### 4. Define your models

Now that you have created a new app, you can define your models in the models.py file inside the app directory. Models are used to define the data structure of your application.

### 5. Create database tables

Once you have defined your models, you can create database tables by running the following command:

```python
python manage.py makemigrations
```

This command will create a new migration file in the migrations directory inside your app directory.

### 6. Apply database migrations

Once you have created the migration file, you can apply the migrations by running the following command:

```python
python manage.py migrate
```

[![](https://github.com/drshahizan/learn-django/raw/main/materials/django/topic/migrate.png)](https://github.com/drshahizan/learn-django/blob/main/materials/django/topic/migrate.png)

This command will create the necessary database tables based on the models you have defined.

### 7. Create a view

Now that you have defined your models and created the necessary database tables, you can create a view to display the data. Views are used to handle requests and render responses.

### 8. Define URLs

[](https://github.com/drshahizan/learn-django/blob/main/materials/django/topic/2-create.md#8-define-urls)

Once you have created a view, you can define URLs that will map to your views by creating a urls.py file inside your app directory.

### 9. Run the server

Now that you have defined your models, created database tables, created a view, and defined URLs, you can run the development server by running the following command:

```python
python manage.py runserver
```

This command will start the development server, and you can access your application by navigating to [http://127.0.0.1:8000/](http://127.0.0.1:8000/) [http://localhost:8000/](http://localhost:8000/) or in your web browser.

[![](https://github.com/drshahizan/learn-django/raw/main/materials/django/topic/localhost.png)

# Models in Django

---

In Django, a model is a Python class that represents a database table and its associated fields. Models define the structure of a database and provide an API for accessing the data stored within it. When you define a model in Django, you can specify the fields that it contains, as well as any relationships it has with other models.

To create models that represent your data in Django, you define Python classes that inherit from the django.db.models.Model class. Each attribute of the class represents a field in the database table, and you can specify the data type and other attributes of the field using the various field classes provided by Django.

Here's an example of a simple model in Django:

```python
from django.db import models

class BlogPost(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    pub_date = models.DateTimeField(auto_now_add=True)
```

In this example, we define a model called `BlogPost` with three fields: `title`, `content`, and `pub_date`. The `title` field is a `CharField` that can hold up to 200 characters, the `content` field is a `TextField` that can hold an arbitrary amount of text, and the `pub_date` field is a `DateTimeField` that will automatically be set to the current date and time when a new `BlogPost` object is created.

Models can also have relationships with other models. For example, you could define a `Comment` model that has a foreign key relationship with the `BlogPost` model:

```python
class Comment(models.Model):
    blog_post = models.ForeignKey(BlogPost, on_delete=models.CASCADE)
    author = models.CharField(max_length=100)
    content = models.TextField()
```

In this example, we define a `Comment` model with three fields: `blog_post`, which is a foreign key to a `BlogPost` object, `author`, which is a `CharField` that can hold up to 100 characters, and `content`, which is a `TextField` that can hold an arbitrary amount of text.

Models in Django provide a powerful and flexible way to define the structure of a database and interact with the data stored within it. They also provide an abstraction layer that allows you to work with data in a way that is independent of the underlying database engine.

## Database

Django is a high-level Python web framework that supports various relational database management systems (RDBMS) as its back-end database. Here are some of the most popular databases that are suitable for use with Django:

|Database|Description|
|---|---|
|PostgreSQL|An open-source object-relational database system that provides powerful features such as transactional integrity, concurrency control, and extensibility. It is known for its scalability, reliability, and performance, and is a popular choice for large-scale applications.|
|MySQL|Another open-source RDBMS that is widely used and supported. MySQL is known for its ease of use, flexibility, and reliability, and is suitable for a wide range of applications, from small-scale to enterprise-level.|
|SQLite|A lightweight, serverless database engine that stores data in a single file. SQLite is a popular choice for small-scale applications and development environments due to its simplicity and ease of use.|
|Oracle|A commercial RDBMS that is widely used in enterprise-level applications. Oracle provides a robust and scalable platform for managing large amounts of data and supporting complex business logic.|
|Microsoft SQL Server|Another commercial RDBMS that is widely used in enterprise-level applications. SQL Server provides a robust and scalable platform for managing large amounts of data and supporting complex business logic, and integrates well with other Microsoft technologies.|

When selecting a database for your Django project, it is important to consider factors such as performance, scalability, ease of use, and support. You should also consider any specific requirements of your application, such as data volume and transactional requirements, to ensure that the selected database can meet your needs.

## MongoDB

[](https://github.com/drshahizan/learn-django/blob/main/materials/django/topic/3-model.md#mongodb)

It is possible to use MongoDB with Django using a third-party package called "Django MongoDB Engine". This package provides a MongoDB-based database backend for Django, allowing you to use MongoDB as the primary data store for your Django application.

However, it is important to note that Django was originally designed to work with relational databases and its ORM (Object-Relational Mapping) is optimized for this type of database. MongoDB is a document-oriented NoSQL database, which means that its data model is different from that of a traditional relational database.

While it is possible to use MongoDB with Django, it may require more configuration and customization than using a relational database. Additionally, some of the features that come with Django's ORM may not be fully supported when using MongoDB, such as complex query generation and transactions.

If you have experience with MongoDB and prefer its data model over that of a traditional relational database, and if the features and performance of Django MongoDB Engine meet your requirements, then using MongoDB with Django can be a suitable option. However, if you are new to both Django and MongoDB, it may be easier to start with a traditional relational database that is natively supported by Django.

# Views and Templates

---

In Django, views and templates are two core components of the Model-View-Template (MVT) architecture, which is similar to the Model-View-Controller (MVC) pattern used in other web frameworks.

## [[Views|Views]]

Views are Python functions that handle HTTP requests and return HTTP responses. Views are responsible for fetching data from the database, processing it, and returning it to the user in a format suitable for rendering by the template. Views can perform various operations, such as querying the database, rendering HTML templates, and returning JSON or other data formats.

Here is an example of a simple view that returns a list of blog posts:

```python
from django.shortcuts import render
from myapp.models import BlogPost

def post_list(request):
    posts = BlogPost.objects.all()
    return render(request, 'post_list.html', {'posts': posts})
```

This view queries the `BlogPost` model to fetch a list of all posts, and then renders a template called `post_list.html`, passing the list of posts as a context variable.

## Templates

Templates are HTML files that define the structure and layout of your web pages. Templates can include variables, loops, conditionals, and other control structures that allow you to dynamically generate content based on data provided by the view. Templates can also include static files such as CSS, JavaScript, and images.

Here is an example of a simple template that displays a list of blog posts:

```html
{% extends "base.html" %}

{% block content %}
  <h1>Blog Posts</h1>
  <ul>
  {% for post in posts %}
    <li><a href="{{ post.get_absolute_url }}">{{ post.title }}</a></li>
  {% endfor %}
  </ul>
{% endblock %}
```

This template extends a base template called `base.html`, and defines a block called `content` where the list of blog posts will be displayed. The template uses a for loop to iterate over the list of posts passed from the view, and generates a list item for each post, with a link to the post's detail page.

In summary, views and templates are two essential components of a Django web application. Views handle requests and return responses, while templates define the structure and layout of web pages. Together, views and templates provide a powerful and flexible way to generate dynamic content for your users.

# URL routing in Django

---

In Django, URL routing is the process of matching incoming HTTP requests with the appropriate view function to handle them. Here is a brief overview of how URL routing works in Django:

1. Create a new Django app or use an existing one. An app is a self-contained module that encapsulates related functionality, such as a blog, a forum, or a shopping cart.

2. Define a set of URL patterns for the app in the app's `urls.py` file. A URL pattern is a regular expression that matches a specific URL pattern and maps it to a corresponding view function. Here is an example of a URL pattern for a blog app:

    ```python
    from django.urls import path
    from . import views
    
    urlpatterns = [
        path('', views.index, name='index'),
        path('post/<int:pk>/', views.post_detail, name='post_detail'),
        path('category/<slug:slug>/', views.category_detail, name='category_detail'),
    ]
    ```

- In this example, we define three URL patterns using the `path` function from Django's `urls` module. The first pattern matches the root URL (i.e., the empty string) and maps it to the `index` view function. The second pattern matches URLs of the form `/post/<id>/`, where `<id>` is an integer, and maps them to the `post_detail` view function, passing the integer as a keyword argument called `pk`. The third pattern matches URLs of the form `/category/<slug>/`, where `<slug>` is a string consisting of letters, digits, hyphens, and underscores, and maps them to the `category_detail` view function, passing the string as a keyword argument called `slug`.

- Define the view functions for the URL patterns in the app's `views.py` file. A view function is a Python function that takes a request object as input and returns an HTTP response object. Here is an example of a view function for the blog app:

    ```python
    from django.shortcuts import render, get_object_or_404
    from .models import Post, Category
    
    def index(request):
        posts = Post.objects.all()
        return render(request, 'blog/index.html', {'posts': posts})
    
    def post_detail(request, pk):
        post = get_object_or_404(Post, pk=pk)
        return render(request, 'blog/post_detail.html', {'post': post})
    
    def category_detail(request, slug):
        category = get_object_or_404(Category, slug=slug)
        posts = Post.objects.filter(category=category)
        return render(request, 'blog/category_detail.html', {'category': category, 'posts': posts})
    ```

- In this example, we define three view functions that correspond to the three URL patterns defined earlier. The `index` view function retrieves all the blog posts from the database using the `Post.objects.all()` method, and passes them as a context variable called `posts` to the `index.html` template. The `post_detail` view function retrieves a specific blog post from the database using the `get_object_or_404` function, which raises a 404 error if the post is not found, and passes it as a context variable called `post` to the `post_detail.html` template. The `category_detail` view function retrieves a specific category from the database using the `get_object_or_404` function, retrieves all the blog posts in that category using the `Post.objects.filter()` method, and passes them as context variables called `category` and `posts` to the `category_detail.html` template.

- Create the HTML templates for the views in the app's `templates` directory. A template is a text file that contains HTML markup and optional placeholders for dynamic content, called template tags and filters. Here is an example of a template for the `index` view function:

    ```html
    {% extends 'base.html' %}
    
    {% block content %}
    <h1>Latest Posts</h1>
    {% for post in posts %}
    <div class="post">
        <h2><a href="{% url 'post_detail' pk=post.pk %}">{{ post.title }}</a></h2>
        <p>{{ post.summary }}</p>
        <p class="meta">{{ post.pub_date|date:"F j, Y" }} | Category: {{ post.category }}</p>
    </div>
    {% endfor %}
    {% endblock %}
    ```

1. In this example, we define a template that extends a base template called `base.html` (which contains the common layout for all pages in the app), and overrides a content block called `content` with a list of blog posts. The `{% for %}` template tag loops over the `posts` context variable passed by the `index` view function and generates a list of post titles, summaries, and publication dates using template tags and filters, such as `{% url %}` and `{{ post.pub_date|date:"F j, Y" }}`.

2. Test the app by running the Django development server and visiting the URLs defined in the URL patterns. The development server is started by running the `python manage.py runserver` command from the app's root directory. The server listens on port 8000 by default, and serves the app's pages dynamically by routing incoming requests to the appropriate view functions and rendering them using the corresponding templates.

That's a brief overview of how to create views that handle requests and generate HTML using templates in Django, and how to route URLs to the appropriate views. The Django framework provides many other features and tools for building web applications, such as authentication, forms, middleware, and static files handling, which can be customized and extended to suit your needs.

## Related

- [[Concurrency and async,await]]
- [[Django channels 2]]
- [[Django REST Framework Generic API Views - Crash Course]]
- [[Django Concepts]]
- [[Intro to Django]]
- [[Python Types hints]]
- [[OOP in Python]]
- [[DRF principles]]
- [[Django Channels]]
- [[Django Channels 1]]
- [[Session-Based Authentication]]
- [[Django Authentication]]
- [[Python Web Frameworks]]
