---
title: errors
tags:
  - core_java
  - errors
  - exception
  - java
date: 2025-03-23
---

## **Types of Errors**

# errors
Errors may be classified into two categories:

- *Compile-time errors*
- *Run-time errors*

1. **Compile-Time Errors**: All syntax errors are detected and displayed by the Java compiler and hence these errors are known as compile-time errors. Whenever the compiler displays an error, it will not create the .class file. Therefore, it is necessary that we fix all the errors before we can successfully compile and run the program.

2. **Run-Time Errors**:  Sometimes, a program may compile successfully creating *.class* file but it may not run properly. Such programs may produce incorrect output due to wrong logic or may terminate due to errors such as [[Stacks|stack overflow]]. Most common run-time errors are:
 - *Dividing an integer by zero*
 - *Accessing an element that is out of the bounds of an array*
 - *Trying to store a value into an array of an incompatible class*
 - *Passing a parameter that is not in a valid range or value for a method*
 - *Trying to illegally change the state of a thread*
 - *Attempting to use a negative size for an array*
 - *Using a null object reference as a legitimate object reference to access a method or a variable*
 - *Converting invalid string to a number*

When such errors are encountered, Java typically generates an error message and aborts the program.

----

## Exceptions

# exception

- An **exception** is a condition caused by a run-time error in the program. When the Java interpreter encounters an error such as *dividing an integer by zero*, it creates and throws an exception object (i.e., informs us that an error has occurred).
- If we want our program to continue with the execution of the remaining code, then we should try to catch the exception object thrown by the error condition and then display an appropriate message for taking corrective actions. This task is known as **exception handling.**
- The purpose of exception handling is to detect and report an “exceptional circumstance” so that appropriate action can be taken. Error handling code performs the following tasks:
 1. Find the problem (Hit the exception).
 2. Inform that an error has occurred (Throw the exception)
 3. Receive the error information (Catch the exception)
 4. Take corrective actions (Handle the exception)

| Exception type                  | cause of Exception                                                                                           |
| :------------------------------ | :----------------------------------------------------------------------------------------------------------- |
| ArithmeticException             | It is caused by math errors such as<br><br>division by zero                                                  |
| ArrayIndexOutOfBoundsException  | Caused by bad array indexes                                                                                  |
| ArrayStoreException             | Caused when a program tries to<br><br>store the wrong type of data in an<br><br>array                        |
| FileNotFoundException           | Caused by an attempt to access a<br><br>nonexistent file                                                     |
| IOException                     | Caused by general I/O failures, such<br><br>as inability to read from a file                                 |
| NullPointerException            | Caused by referencing a null object                                                                          |
| NumberFormatException           | Caused when a conversion between<br><br>strings and number fails                                             |
| OutOfMemoryException            | Caused when there’s not enough<br><br>memory to allocate a new object                                        |
| SecurityException               | Caused when an applet tries to<br><br>perform an action not allowed by<br><br>the browser’s security setting |
| [[Stacks|StackOverflowException]]          | Caused when the system runs out of<br><br>stack space                                                        |
| StringIndexOutOfBoundsException | Caused when a program attempts to<br><br>access a nonexistent character<br><br>position in a string          |

## Related

- [[Java Refresher]]
