---
title: models.py
tags:
  - django_concepts
  - view
date: 2025-07-28
---
**All the common [[Django Concepts#Class-Based Views (CBVs)|Django class-based views (CBVs)]]** with a full example, including:

1. **List View**
2. **Detail View**
3. **Create View**
4. **Update View**
5. **Delete View**
6. **How to connect one view/template to another (like a link or redirect)**

---

## 🧪 Example Model

Let’s assume you have a model like this:

```python
# models.py
from django.db import models

class Student(models.Model):
    name = models.CharField(max_length=100)
    age = models.IntegerField()
    department = models.CharField(max_length=100)

    def __str__(self):
        return self.name
```

---

## 🧠 1. ListView – Show All Students

```python
# views.py
from django.views.generic import ListView
from .models import Student

class StudentListView(ListView):
    model = Student
    template_name = 'students/student_list.html'  # Optional
    context_object_name = 'students'
```

```python
# urls.py
from django.urls import path
from .views import StudentListView

urlpatterns = [
    path('students/', StudentListView.as_view(), name='student-list'),
]
```

```html
<!-- templates/students/student_list.html -->
<h2>All Students</h2>
<ul>
  {% for student in students %}
    <li>
      <a href="{% url 'student-detail' student.pk %}">{{ student.name }}</a>
    </li>
  {% endfor %}
</ul>
<a href="{% url 'student-create' %}">Add Student</a>
```

---

## 🔍 2. DetailView – Show a Single Student

```python
# views.py
from django.views.generic import DetailView

class StudentDetailView(DetailView):
    model = Student
    template_name = 'students/student_detail.html'
    context_object_name = 'student'
```

```python
# urls.py
from .views import StudentDetailView

urlpatterns += [
    path('students/<int:pk>/', StudentDetailView.as_view(), name='student-detail'),
]
```

```html
<!-- templates/students/student_detail.html -->
<h2>{{ student.name }}</h2>
<p>Age: {{ student.age }}</p>
<p>Department: {{ student.department }}</p>
<a href="{% url 'student-update' student.pk %}">Edit</a>
<a href="{% url 'student-delete' student.pk %}">Delete</a>
<a href="{% url 'student-list' %}">Back to List</a>
```

---

## ➕ 3. CreateView – Add a Student

```python
from django.views.generic.edit import CreateView
from django.urls import reverse_lazy

class StudentCreateView(CreateView):
    model = Student
    fields = ['name', 'age', 'department']
    template_name = 'students/student_form.html'
    success_url = reverse_lazy('student-list')
```

```python
urlpatterns += [
    path('students/create/', StudentCreateView.as_view(), name='student-create'),
]
```

```html
<!-- templates/students/student_form.html -->
<h2>Add Student</h2>
<form method="post">
  {% csrf_token %}
  {{ form.as_p }}
  <button type="submit">Save</button>
</form>
<a href="{% url 'student-list' %}">Cancel</a>
```

---

## ✏️ 4. UpdateView – Edit a Student

```python
from django.views.generic.edit import UpdateView

class StudentUpdateView(UpdateView):
    model = Student
    fields = ['name', 'age', 'department']
    template_name = 'students/student_form.html'
    success_url = reverse_lazy('student-list')
```

```python
urlpatterns += [
    path('students/<int:pk>/update/', StudentUpdateView.as_view(), name='student-update'),
]
```

_It uses the same form template as the CreateView._

---

## ❌ 5. DeleteView – Delete a Student

```python
from django.views.generic.edit import DeleteView

class StudentDeleteView(DeleteView):
    model = Student
    template_name = 'students/student_confirm_delete.html'
    success_url = reverse_lazy('student-list')
```

```python
urlpatterns += [
    path('students/<int:pk>/delete/', StudentDeleteView.as_view(), name='student-delete'),
]
```

```html
<!-- templates/students/student_confirm_delete.html -->
<h2>Are you sure you want to delete {{ student.name }}?</h2>
<form method="post">
  {% csrf_token %}
  <button type="submit">Yes, Delete</button>
</form>
<a href="{% url 'student-detail' student.pk %}">Cancel</a>
```

---

## 🔁 Bonus: Linking One View to Another

In templates, use `{% url %}` to link to other views. For example:

```html
<a href="{% url 'student-detail' student.pk %}">Details</a>
<a href="{% url 'student-create' %}">Add New Student</a>
```

---

## ✅ Template Folder Structure (Recommended)

```
yourapp/
├── templates/
│   └── students/
│       ├── student_list.html
│       ├── student_detail.html
│       ├── student_form.html
│       └── student_confirm_delete.html
```

---

## 🧩 Summary of URL Names

| View   | Path                         | URL Name         |
| ------ | ---------------------------- | ---------------- |
| List   | `/students/`                 | `student-list`   |
| Detail | `/students/<int:pk>/`        | `student-detail` |
| Create | `/students/create/`          | `student-create` |
| Update | `/students/<int:pk>/update/` | `student-update` |
| Delete | `/students/<int:pk>/delete/` | `student-delete` |
|        |                              |                  |

---

## Related

- [[creating django project]]
- [[Session-Based Authentication]]
