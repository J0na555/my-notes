---
title: Python with examples Python hints Intro
tags:
  - python
  - python_with_examples
  - typeshints
date: 2025-12-08
---

# [[Python with examples|Python]] hints Intro

Python has support for optional "type hints" (also called "type annotations").
These **"type hints"** or annotations are a special syntax that allow declaring the type of a variable.
By declaring types for your variables, editors and tools can give you better support.

```python
def get_full_name(first_name: str, last_name: str):
    full_name = first_name.title() + " " + last_name.title()
    return full_name


print(get_full_name("john", "doe"))

```

## Declaring Types

You just saw the main place to declare type hints. As function parameters.
This is also the main place you would use them with **[[FastAPI Auth|FastAPI]]**.

### Simple types

You can declare all the standard Python types, not only `str`.
You can use, for example:

- `int`
- `float`
- `bool`
- `bytes`

```python
def get_items(item_a: str, item_b: int, item_c: float, item_d: bool, item_e: bytes):
    return item_a, item_b, item_c, item_d, item_d, item_e
```

```python
def process_items(items: list[str]):
    for item in items:
        print(item)
```

note:
 Those internal types in the square brackets are called **"type parameters"**.
 In this case, `str` is the type parameter passed to `List` (or `list` in Python 3.9 and above).

```python
def process_items(items_t: tuple[int, int, str], items_s: set[bytes]):
    return items_t, items_s
```

This means:

- The variable `items_t` is a `tuple` with 3 items, an `int`, another `int`, and a `str`.
- The variable `items_s` is a `set`, and each of its items is of type `bytes`.

#### Dict

To define a `dict`, you pass 2 type parameters, separated by commas.
The first type parameter is for the keys of the `dict`.
The second type parameter is for the values of the `dict`:

```python
def process_items(prices: dict[str, float]):
    for item_name, item_price in prices.items():
        print(item_name)
        print(item_price)
```

This means:

- The variable `prices` is a `dict`:
  - The keys of this `dict` are of type `str` (let's say, the name of each item).
  - The values of this `dict` are of type `float` (let's say, the price of each item).

#### Union

You can declare that a variable can be any of **several types**, for example, an `int` or a `str`.

In Python 3.6 and above (including Python 3.10) you can use the `Union` type from `typing` and put inside the square brackets the possible types to accept.

In Python 3.10 there's also a **new syntax** where you can put the possible types separated by a vertical bar (`|`).

```python
def process_item(item: int | str):
    print(item)
```

In both cases this means that `item` could be an `int` or a `str`.

#### Possibly `None`

You can declare that a value could have a type, like `str`, but that it could also be `None`.

In Python 3.6 and above (including Python 3.10) you can declare it by importing and using `Optional` from the `typing` module.

```python
from typing import Optional


def say_hi(name: Optional[str] = None):
    if name is not None:
        print(f"Hey {name}!")
    else:
        print("Hello World")
```

Using `Optional[str]` instead of just `str` will let the editor help you detect errors where you could be assuming that a value is always a `str`, when it could actually be `None` too.

`Optional[Something]` is actually a shortcut for `Union[Something, None]`, they are equivalent.
This also means that in Python 3.10, you can use `Something | None`:

```python
def say_hi(name: str | None = None):
    if name is not None:
        print(f"Hey {name}!")
    else:
        print("Hello World")
```

### Classes as types

You can also declare a class as the type of a variable.
Let's say you have a class `Person`, with a name:

```python
class Person:
    def __init__(self, name: str):
        self.name = name


def get_person_name(one_person: Person):
    return one_person.name
```

Then you can declare a variable to be of type `Person`:

```python
class Person:
    def __init__(self, name: str):
        self.name = name


def get_person_name(one_person: Person):
    return one_person.name
```

[[[Pydantic]]] is a Python library to perform data validation.

[Pydantic](https://docs.pydantic.dev/) is a Python library to perform data validation.

You declare the "shape" of the data as classes with attributes.

And each attribute has a type.

Then you create an instance of that class with some values and it will validate the values, convert them to the appropriate type (if that's the case) and give you an object with all the data.

And you get all the editor support with that resulting object.

An example from the official Pydantic docs:

```python
from datetime import datetime

from pydantic import BaseModel


class User(BaseModel):
    id: int
    name: str = "John Doe"
    signup_ts: datetime | None = None
    friends: list[int] = []


external_data = {
    "id": "123",
    "signup_ts": "2017-06-01 12:22",
    "friends": [1, "2", b"3"],
}
user = User(**external_data)
print(user)
# > User id=123 name='John Doe' signup_ts=datetime.datetime(2017, 6, 1, 12, 22) friends=[1, 2, 3]
print(user.id)
# > 123
```

## Related

- [[Concurrency and Async-Await]]
- [[Pydantic]]
- [[Django Concepts]]
- [[Intro to Django]]
- [[Creating Django Project]]
- [[OOP in Python]]
- [[Python asyncio]]
- [[Python Web Frameworks]]
