---
title: Object-Oriented Programming
tags:
  - oop
  - python
  - python_with_examples
date: 2025-04-02
---

# Object-Oriented Programming

Object-oriented Programming in Python is a programming paradigm that organizes software design around *objects* , rather than functions and logic. just like

### Classes and Objects

#### Classes

A blueprint for creating objects (instances).It defines the properties (attributes) and behaviors (methods) that the object of the class will have.

#### Objects

An instance of a class It has a specific values for the attributes and can perform the methods defined in the class.

```python
class Car:
 def __init__(self, make, model):
  self.make = make
  self.model = model

 def drive(self):
  print(f"The {self.make} {self.model} is driving.")

# creating an instance of the Car class
my_car = Car("Toyota", "Corolla")
my_car.drive()
# "The Toyota Corolla is driving"
```

### Encapsulation

- Encapsulation refers to bundling the data(attributes)  and the methods that operate on the data into a single unit called **class**.
- It also refers involves restricting access to certain detail of the object, usually by using the **private** and **public** access modifiers
- In python we achieve encapsulation by using methods (functions within a class) to access or modify the  attributes.

```python
class Person:
 def __init__(self, name, age):
  self.name = name 
  self._age = age # making age private

 def get_age(self):
  return self.age

 def set_age(self, age):
  if age > 0:
   self._age = age
  else:
   print("invalid age")

person = Person("Alice", 23)
print(person.get_age()) # outputs:23
person.set_age(24)      # updates age:24
print(person.get_age()) # outputs:24
```

### Inheritance

Allows a class to inherit the attributes and methods of another class, enabling code reuse and creating a hierarchical relationship between classes.

```python
class Animal:
 def speak(self):
  print("Animal sound")

class Dog(Animal):
 def speak(self):
  print("Bark")
my_dog = Dog()
my_dog.speak() #outputs "Bark"
```

### Polymorphism

Polymorphism allows a method to have different behaviors depending on the object that calls it. This is often achieved by **method overriding** or **method overloading**.

```python
class Animal:
 def speak(self):
  print("Animal sound")

class Dog(Animal):
 def speak(self):
  print("Bark")

class Cat(Animal):
 def speak(self):
  print("meow")

animals = [Dog(), Cat()]
for animal in animals
 animal.speak() #outputs 'Bark', 'Meow'
```

### Abstraction

Abstraction involves hiding the complex implementation and showing only the essential features. We can achieve abstraction by using abstract classes which can't be instantiated directly and must be subclassed.

```python
from abc import ABC, abstractmethod

class Animal(ABC):
 @abstractmethod
 def speak(self)
  pass

class Dog(Animal):
 def speak(self):
  print("Bark")

my_dog = Dog()
my_dog.speak() # outputs : Bark
```

### Magic Methods

Python provides special methods(also known as *magic methods*) that allows you to define how objects behave in certain situations, such as when you added, compared or converted to string.

```python
class Point:
 def __init__(self, x, y):
  self.x = x
  self.y = y

 def __repr__(self):
  return f"Point {self.x}, {self.y}"

 def __add__(self, other):
  return Point{self.x}, {self.y} + other.y

point1 = Point(1,2)
point2 = Point(3,4)
point3 = point1 + point2 

print(point3) # outputs :Point(4,6)
```

### Summary

- **classes** are blueprint for objects, and **objects** are instances of those classes.
- **encapsulation** hides the internal working and exposes only necessary parts.
- **inheritance** allows classes to inherit the functionality of other classes.
- **polymorphism** allows different objects to have the same name but behaves differently.
- **abstraction** simplified complex systems only by exposing necessary functionalities.

## Related

- [[Concurrency and Async-Await]]
- [[Pydantic]]
- [[Django Concepts]]
- [[Intro to Django]]
- [[Python Type Hints]]
- [[Creating Django Project]]
- [[Python asyncio]]
- [[Python Web Frameworks]]
