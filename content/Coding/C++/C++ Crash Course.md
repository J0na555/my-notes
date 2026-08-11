---
title: C++ crash course
date: 2026-08-07
tags:
  - cplusplus
  - programming
type: note
status: draft
source: https://github.com/rougier/CPP-Crash-Course#input-output
publish: "false"
---
## Basic stuff
### input/output
```c++
#inlude <iostream>

int main (int argc, char **argv){
	int i;
	std::cout<<"please enter an integer value: ";
	std::cin>>i;
	std::cout<<"The value you entered is " << i << std::endl;
	return 0;
}
```

### New/Delete
The `new` and `delete` keywords are used to allocate and free memory. They are "object-aware" so you'd better use them instead of `malloc` and `free`. In any case, never cross the streams (new/free or malloc/delete).

```c++
int *a = new int;
delete a;

int *b = new int[5];
delete [] b;
```
`delete`  does two things: it calls the destructor and it deallocated the memory.

### References
A reference allows to declare an alias to another variable. As long as the aliased variable lives, you can use indifferently the variable or the alias

```c++
int x;
int& foo = x;

foo = 42;
std::cout << x << std::endl; // 42 
// foo and x are two names of the same variable, changing one will change the other
// a reference must be bound to a variable when declared (you cannot write `int& foo;`).
```

References are extremely useful when used with function arguments since it saves the cost of copying parameters into the stack when calling the function.
### Default parameters
You can specify default values for function parameters. When the function is called with fewer parameters, default values are used.

```c++
float foo( float a=0, float b=1, float c=2 )
{return a+b+c;}

cout << foo(1) << endl
     << foo(1,2) << endl
     << foo(1,2,3) << endl;
```
You should obtain values 4, 5 and 6.

### Namespaces
Namespaces allows to group classes, functions and variables under a common scope name and can be referenced elsewhere.
```c++
namespace first  { int var = 5; }
namespace second { int var = 3; }
cout << first::var << endl << second::var << endl;
```
You should obtain values 3 and 5. There exists some standard namespace in the standard template library such as std.

### Overloading
Function overloading refers to the possibility of creating multiple functions with the same name as long as they have different parameters (type and/or number).
```c++
float add(float a, float b) {
retrun a + b;
}

int add (int a, int b) {
return a + b;
}
```

## Exercise
1. write a basic makefile for compiling sources
```Makefile
PLATRORM = $(shell uname)
CXX = g++
CXXFLAGS = -Wall -ansi -pedantic

SOURCES:= $(wildcard *.cc)
TARGETS := $(SOURCES:.cc=)

all: $(TARGETS)


define template
$(1): $(1).cc
	@echo "Building $$@... "
	@$(CXX) $(1).cc $(CXXFLAGS) -o $$@
endef
$(foreach target,$(TARGETS),$(eval $(call template,$(target))))

clean:
	@-rm -f $(TARGETS)

distclean: clean
	@-rm -f *~

```

2. how would you declare
- A pointer to a char
```c++
char letter = "hello";
char* ptr = &letter;
```
-  A constant pointer to a char
```c++
char letter = "hello";
char* const ptr = &letter;
```
- A pointer to a constant char
```c++
char letter = "hello";
const char* ptr = &letter;
```
- A constant pointer to a constant char
```c++
char letter = "hello";
const char* const ptr =  &letter;
```
- A reference to a char
```c++
char letter = "hello";
char& ref = letter;
```
- A reference to a constant char
```c++
char letter = "hello";
const char& ref = letter;
```

3. Create a two-dimensional array of integers (size is n x n), fill it with corresponding indices (a[i][j] = i * n+j), test it and finally, delete it.
4. write a function that swap two integers, then two pointers
5. What's the difference between `int const* p`, `int* const p` and `int const* const p` ?