---
title: pointers
date: 2026-08-21
tags:
  - cpp
  - pointers
type: note
status: draft
source: https://www.learn-cpp.org/en/Pointers
publish: "false"
---
# Pointers
pointers are basically a reference to a variable in memory. They are pointing to a memory address where a variable is stored.

## data type
A pointer in almost all cases needs a datatype that matches the reference variable. for ex: an int pointer can hold the address of an int var and float pointer can hold the address of a float vat. 

A special case is the so called "Void pointer"
## Void pointer
Void pointer is a pointer which has no data type assigned. It can hold an address of any type and can be typecasted to any other type.

```cpp
#include <iostream>

using namespace std;

int main() {
    int a = 5;
    int *b = 0;

    cout << "\"b\" is initialized and pointing to memory address : " << b
         << endl
         << endl;

    // lets make the pointer to point to a
    b = &a; // b now points to address of a

    cout << "\"a\" is stored at memory-address:  " << &a << endl;
    cout << "\"b\" is stored at memory-address:  " << &b << endl;
    cout << "\"b\" is pointing to memory-address now:  " << b << endl << endl;

    cout << "The value of \"a\" is: " << a << endl;
    // the "*b" will get the value from the address b points to (the value of a)
    cout << "The value of the area \"b\" is pointing to is: " << *b << endl
         << endl
         << endl;

    // Now modify the value of the address "b" is pointing to...effectively
    // changing the value of "a"
    *b = 10;
    cout << "\"a\" is still stored at memory-address:  " << &a << endl;
    cout << "\"b\" is still stored at memory-address:  " << &b << endl;
    cout << "\"b\" is still pointing to memory-address:  " << b << endl << endl;

    cout << "The value of \"a\" is now: " << a
         << endl; // returns the value of a
    cout << "The value of the area \"b\" is pointing to is now: " << *b << endl
         << endl;

    return 0;
}
```

```cpp
void* p1;
char* p2;

p2 = p1 // not valid in cpp but in c 
p2 = (char*) p1; // cpp have to typecast the pointer
```
