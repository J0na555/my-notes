---
title: continuing the above example...
tags:
  - fastapi
  - pydantic
  - python_with_examples
date: 2025-12-08
---

## Why use Pydantic?[¶](https://docs.pydantic.dev/latest/#why-use-pydantic)

- **Powered by [[Python Types hints|type hints]]** — with [[Pydantic]], schema validation and serialization are controlled by type annotations; less to learn, less code to write, and integration with your IDE and static analysis tools. [Learn more…](https://docs.pydantic.dev/latest/why/#type-hints)
- **Speed** — Pydantic's core validation logic is written in Rust. As a result, Pydantic is among the fastest data validation libraries for Python. [Learn more…](https://docs.pydantic.dev/latest/why/#performance)
- **JSON Schema** — Pydantic models can emit JSON Schema, allowing for easy integration with other tools. [Learn more…](https://docs.pydantic.dev/latest/why/#json-schema)
- **Strict** and **Lax** mode — Pydantic can run in either strict mode (where data is not converted) or lax mode where Pydantic tries to coerce data to the correct type where appropriate. [Learn more…](https://docs.pydantic.dev/latest/why/#strict-lax)
- **Dataclasses**, **TypedDicts** and more — Pydantic supports validation of many standard library types including `dataclass` and `TypedDict`. [Learn more…](https://docs.pydantic.dev/latest/why/#dataclasses-typeddict-more)
- **Customisation** — Pydantic allows custom validators and serializers to alter how data is processed in many powerful ways. [Learn more…](https://docs.pydantic.dev/latest/why/#customisation)
- **Ecosystem** — around 8,000 packages on PyPI use Pydantic, including massively popular libraries like _FastAPI_, _huggingface_, _Django Ninja_, _SQLModel_, & _LangChain_. [Learn more…](https://docs.pydantic.dev/latest/why/#ecosystem)
- **Battle tested** — Pydantic is downloaded over 360M times/month and is used by all FAANG companies and 20 of the 25 largest companies on NASDAQ. If you're trying to do something with Pydantic, someone else has probably already done it. [Learn more…](https://docs.pydantic.dev/latest/why/#using-pydantic)

[Installing Pydantic](https://docs.pydantic.dev/latest/install/) is as simple as: `pip install pydantic`

## Pydantic examples[¶](https://docs.pydantic.dev/latest/#pydantic-examples)

To see Pydantic at work, let's start with a simple example, creating a custom class that inherits from `BaseModel`:

```python
from datetime import datetime

from pydantic import BaseModel, PositiveInt


class User(BaseModel):
    id: int  
    name: str = 'John Doe'  
    signup_ts: datetime | None  
    tastes: dict[str, PositiveInt]  


external_data = {
    'id': 123,
    'signup_ts': '2019-06-01 12:22',  
    'tastes': {
        'wine': 9,
        b'cheese': 7,  
        'cabbage': '1',  
    },
}

user = User(**external_data)  

print(user.id)  
#> 123
print(user.model_dump())  
"""
{
    'id': 123,
    'name': 'John Doe',
    'signup_ts': datetime.datetime(2019, 6, 1, 12, 22),
    'tastes': {'wine': 9, 'cheese': 7, 'cabbage': 1},
}
"""
```

If validation fails, Pydantic will raise an error with a breakdown of what was wrong:

```python
# continuing the above example...

from datetime import datetime
from pydantic import BaseModel, PositiveInt, ValidationError


class User(BaseModel):
    id: int
    name: str = 'John Doe'
    signup_ts: datetime | None
    tastes: dict[str, PositiveInt]


external_data = {'id': 'not an int', 'tastes': {}}  

try:
    User(**external_data)  
except ValidationError as e:
    print(e.errors())
    """
    [
        {
            'type': 'int_parsing',
            'loc': ('id',),
            'msg': 'Input should be a valid integer, unable to parse string as an integer',
            'input': 'not an int',
            'url': 'https://errors.pydantic.dev/2/v/int_parsing',
        },
        {
            'type': 'missing',
            'loc': ('signup_ts',),
            'msg': 'Field required',
            'input': {'id': 'not an int', 'tastes': {}},
            'url': 'https://errors.pydantic.dev/2/v/missing',
        },
    ]
    """
```

## Custom Validation

```python
@validator("account_id)
def validate_account_id(cls, value):
 if value <= 0:
  raieseError(f"account must be a positive {value}")
 return value
```

## Json serialization

```python
user_json_str = user.json()
print(user_json_str)


# or you can just see it as a dict
user_json_obj = user.dict()
print(user_json_obj)

# can also change from json to pydantic model
json_str = '{"name":"jinx", "email":"jinx@haha.com", "account_id":134}'
user = User.parse_raw(json_str)


```

```python
from pydantic import BaseModel, EmailStr,validator


class User(BaseModel):
 name: str
 email: EmailStr
 account_id: int
 
 
 @validator("account_id)
 def validate_account_id(cls, value):
  if value <= 0:
   raieseError(f"account must be a positive {value}")
  return value

  

user = User(name="jinx", email="jinx@haha.com", account_id=54445)

user_json_str = user.json()
print(user_json_str)


```

## Related

- [[Concurrency and async,await]]
- [[OOP in Python]]
- [[Python asyncio]]
- [[FastAPI Auth]]
