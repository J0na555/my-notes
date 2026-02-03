## Class: [[Python with examples|Python]]

## Topic: #python #exception #exception-handling #backend  #errors

## Date: 29-03-2025

---

## Using Lists to Store Data

**Lists** are ordered collections that are mutable and can contain mixed
data types.
example:

```python
my_list = [1, 2, 3, "Python", 3.14]

# Access elements
print(my_list[3]) # Outputs 'Python'

# Add elements
my_list.append("new item")
print(my_list) # Outputs [1, 2, 3, 'Python', 3.14, 'new item']

# Slicing
print(my_list[1:4]) # Outputs [2, 3, 'Python']

# List comprehensions
squares = [x**2 for x in range(10)]
print(squares) # Outputs [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]
```

## Using Tuples

**Tuples**: These are similar to lists but are **immutable**. They are created by placing comma-separated values inside parentheses.
In other words tuples are immutable lists.
lists are good for storing values that changes overtime but if you want to store values that will stay constant you use **tuples**

Example:

```python
my_tuple = (1, 2, 3, "Python")

print(my_tuple[1]) # Outputs 2

 # Trying to modify a tuple will result in an error

 my_tuple[1] = 10 # This would raise a TypeError
```

## Using Sets

**Sets**: Sets are unordered collections of unique elements. They are defined by values separated by commas inside curly braces.
Example:

```python
my_set = {1, 2, 3, 4, 5, 5}

print(my_set) # Outputs {1, 2, 3, 4, 5} (duplicates are removed)

 # Adding and removing elements

my_set.add(6)

my_set.remove(1)

print(my_set) # Outputs {2, 3, 4, 5, 6}
```

## Comprehensions for Efficient Data Handling

Comprehensions provide a concise way to create lists, dictionaries, and sets from sequences or other iterable objects.

- **List Comprehensions :** These are used for creating new lists from existing iterables. A list comprehension consists of brackets containing an expression followed by a clause.

Example:

```python
# Squaring numbers in a range

squares = [x**2 for x in range(10)]

print(squares)
```

- **Dictionary Comprehensions :** Similar to list comprehensions but for dictionaries. It uses curly braces .

Example:

```python
# Create a dictionary with number and its square

square_dict = {x: x**2 for x in range(5)}

print(square_dict)
```

- **Set Comprehensions :** These are similar to list comprehensions, but they produce sets, which are collections of unique elements.

Example:

```python
# Creating a set of even numbers

evens = {x for x in range(10) if x % 2 == 0}

print(evens)
```

Control structures such as if-statements, loops, and comprehensions are fundamental to programming in Python, enabling you to write flexible and efficient code.

## Defining and Calling Functions

Functions in Python are defined using the keyword and are used to encapsulate code into reusable blocks. They can take inputs, perform

actions, and return outputs.

Example:

```python
def greet():
 print("Hello, World!")

# Calling the function

greet()
```

Function with parameters :

```python
def greet(name):
 print(f"Hello, {name}!")

# Calling the function with a parameter

greet("Alice")
```

Functions can also be defined with default parameter values, making some arguments optional during the function call.

## Parameters, Arguments, and Return Values

**Parameters** are variables that are defined in the function signature and receive values when the function is called. **Arguments** are the actual values passed to the function.

**Positional and Keyword Arguments :**

```python
def describe_pet(animal_type, pet_name):
 print(f"I have a {animal_type} named {pet_name}.")

# Positional arguments

describe_pet('hamster', 'Harry')

# Keyword arguments

describe_pet(pet_name='Willow', animal_type='cat')
```

**Returning Values**
Functions can return values using the statement, which exits the function and optionally passes back an expression to the caller.

```python
def square(number):
 return number ** 2

result = square(4)
print(result) # Outputs 16
```

## Organizing Code with Modules and Packages

**Modules** in Python are simply Python files with the extension containing Python code. **Packages** are a way of structuring Python’s module namespace by using “dotted module names”.

**Creating and Using a Module** :
Suppose you have a file named with the following code:

```python
# my_module.py

def make_pizza(topping):
 print(f"Making a pizza with {topping}")
```

You can import and use this module in another file:

```python
import my_module

my_module.make_pizza('pepperoni')
```

Using from…**import** Statement :You can also import specific attributes from a module using the keyword:

```python
from my_module import make_pizza

make_pizza('mushrooms')
```

**Packages** : A package is a directory containing Python modules and a file named
. It can be nested to create subpackages.
Suppose you have the following directory structure:

```
pizza/ 
 __init__.py
 dough.py 
 toppings.py
```

You can import modules from the package:

```python
from pizza import dough
from pizza.toppings import add_topping

dough.make_dough()
add_topping('tomato')
```

Understanding how to define and use functions, as well as organize larger code bases with modules and packages, is crucial for writing clean, maintainable, and reusable Python code. This organization helps in managing larger projects efficiently and keeps the code logically separated based on functionality.

## Exception Handling

### Understanding Exceptions

Exceptions in Python are errors detected during execution that disrupt the normal flow of a program. Python provides various built in exceptions such as , , , and many others. Understanding these exceptions is crucial for debugging and for writing robust programs.
Example of encountering an exception:

```python
numbers = [1, 2, 3]

print(numbers[3]) # IndexError: list index out of range
```

This example tries to access an element that is not present in the list, causing an .

### Handling Exceptions with Try-Except

To handle exceptions and to prevent them from crashing your program, Python uses the try-except block. You can catch specific exceptions and respond appropriately.

**Basic usage**:

```python
try:
# Code that might cause an exception
 print(numbers[3])
except IndexError as e:
# Code that runs if an exception occurs print("Error:", e)
```

This block will catch the and print an error message, preventing the program from crashing.

### Handling multiple exceptions

You can also handle multiple exceptions, which allows you to respond to different exception types differently.

```python
try:
# Code that might throw different exceptions
 x = int(input("Enter a number: "))
 result = numbers[x]
except ValueError:
 print("Please enter a valid integer.")
except IndexError:
 print("That index is out of range.")
except Exception as e:
 print("An unexpected error occurred:", e)
```

### Raising Custom Exceptions

Sometimes, you might need to create and raise your own exceptions. This is usually done to enforce certain conditions within your code.

Defining and raising a custom exception:

```python
# Define a custom exception by subclassing Exception class

class ValueTooHighError(Exception):

def __init__(self, message):
 self.message = message# Use case of the custom exception

def check_value(x):
 if x > 100:
 raise ValueTooHighError("Value is too high.")
 else:
 print("Value is within the limit.")

try:
 check_value(200)
except ValueTooHighError as e:
 print(e.message)
```

In this example, is a custom exception that is raised when a value exceeds a predetermined limit. This allows the programmer to provide meaningful error messages and to control the flow of the program more effectively. Exception handling is a fundamental part of developing reliable Python applications. It not only helps in managing errors and preventing program crashes but also allows developers to implement robust error-checking mechanisms that can anticipate and manage operational anomalies in the code.
