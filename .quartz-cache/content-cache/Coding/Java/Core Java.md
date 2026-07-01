## Class: [[java]]
## Topic: #java #java-tokens #class #object #static #interface #polymorphism #super #constructors #this #encapsulation #backend
## Date: 23-03-2025
---
## Features of Java
- **Simple**
- **Object-oriented** 
- **Secure, Portable and Robust**
- **multithreaded**: allows programmers to write programs that performs multiple tasks
- **Dynamic**
---
## **Java Tokens**
#java-tokens
Tokens are the basic building blocks of the java programming language that are used in constructing expressions, statements and blocks.
1. **Keywords**: these words are already been defined by the language and have a predefined meaning and use. Key words cannot be used as a variable, method, class or interface etc.
	e.g. : class, int, super, break, final, try, ......

2. **Identifiers**: Identifiers are used to name a variable, method, block, class or interface etc. Java is case-sensitive. Identifier may be any sequence of uppercase and lowercase letters, numbers, or the underscore characters.

3. **Literals**: Literals are the value assigned to a variable;
	Example: 10, “Mumbai”, 3.14, ‘Y’, ‘\n’ etc.

4. **Operators**: Operators are the symbols that performs operations. Java contains different types of operators like *Arithmetic Operator (+, -, *,  /, %)* ,  *Logical Operator* (&&, ||, ~ ), *Relational Operator* (<, <=, >, >=, !=, = =),  Bitwise Operator (&, |, ~), *Shift Operator* ( <<, >>, >>>), Assignment Operators *(=, +=, -+, *=,  /=, %=)*, Conditional Operator (?:), Instance Of Operator.

5. **Separators**: Separators are used to separate words, expressions, sentences, blocks etc. e.g.: ;,{}, [], , , .
---
## **Class**
#class
A class is a blue print for creating objects. A class is a group of objects which have common properties. A class defines the data and code that can be shared by a set of objects. Each object of a given class contains the structure and behavior defined by the class, as if it were stamped out by a mold in the shape of the class.

---
## **Object**
#object
An entity that has state and behavior is known as an object. An object has three characteristics: 
- **State**: represents the data or value of an object.
-  **Behavior**: represents the behavior (functionality) of an object such as deposit, withdraw, etc.
-  **Identity**: An object identity is a unique ID. 
An object represents a class during program execution. Thus, a class is a template for an object, and an object is an instance of a class. Because an object is an instance of a class, you will often see the two words object and instance used interchangeably. 
*There are five different ways to create objects in java*: Using new keyword: 
Complex com = new Complex(10, 20); 
1. Using  Class.forName():
	`Class.forName(“sun.jdbc.odbc.JdbcOdbcDriver”); `
2. Using clone():
	`Complex com1 = com.clone();`
3. Using Object Deserialization 
	```java
	ObjectInputStreamois = new objectInputStream(some data);
	 MyObject object = (MyObject) instream.readObject(); 
	 Using newIntance() method Object obj =  DemoClass.class.getClassLoader().loadClass("DemoClass").new Instance ();
```

---
## **Static Keywords**
#static
  Static is a non-access modifier in Java, it is used with variables, methods, blocks and nested class. It is a keyword that are used for share the same variable or method of a given class. This is used for a constant variable or a method that is the same for every object of a class. The main method of a class is generally labeled static. The static keyword is used in java mainly for memory management. No object needs to be created to use static variable or call static methods, just put the class name before the static variable or method to use them. Static method cannot call non-static method. The static variable allocate memory only once in class area at the 20 time of class loading. It is use to make our program memory efficient.
  
  When a variable is declared as static, then a single copy of variable is created and shared among all objects at class level. Static variables are, essentially, global variables. All instances of the class share the same static variable and can be created at class-level only.
  
  When a method is declared with static keyword, it is known as static method. The most common example of a static method is main( ) method. Any static member can be accessed before any objects of its class are created, and without reference to any object. Methods declared as static can only directly call other static methods and can only directly access static data. They cannot refer to this or super.
  
---
## **Constructors**
#constructors
A constructor initializes an object at the time of creation. It has the same name as the class in which it resides. The constructor is automatically called when the object is created, before the newoperator completes. Constructors have no return type, not even void. This is because the implicit return type of a class’ constructor is the class type itself. It is the constructor’s job to initialize the internal state of an object so that the code creating an instance will have a fully initialized, usable object immediately.
There are three rules defined for the constructor. 
1. Constructor name must be the same as its class name
2. A Constructor must have no explicit return type 
3. A Java constructor cannot be abstract, static, final, and synchronized

---
## **This Keyword**
#this
“this” is a reference to object itself. ‘this’ keyword can be used to refer current class instance variables, to invoke current class constructor, to return the current class instance, as method parameter, to invoke current class method and as an argument in the constructor call. “this” keyword when used in a constructor can only be the first statement in Constructor and constructor can have either this or super keyword but not both.

---
## **Inheritance**
#inheritance
Inheritance is an important concept of OOP. It is the mechanism in java by which one class is allows inheriting the fields and methods of another class. Inheritance facilitates code reusability to reuse the fields and methods of the existing class. The class from which a new class is created is called as a parent, base or super class and the new class is also called as child, derived or sub class.

---
## **Super Keyword**
#super
“super” is the reference to the parent class. Super keyword can be used to access parent class variable, method and to invoke parent class constructor.

---
## **Polymorphism (overloading & overriding)**
#polymorphism
*Method Overloading* is a mechanism in which a class allows more than one method with same name but with different prototype. Multiple methods can be created by changing the no. of parameters, type of parameters, order of parameters or combination of any. The *method binding* is done by the compiler at compile time and fix the calling method based on the actual parameter matching or by using implicit type conversion. This is also called as static binding, early binding or compile time polymorphism.

*Method Overriding* is a mechanism in which a method in a child class that is already defined in the parent class with the same method signature — same name, arguments, and return type. Method overriding is used to provide the specific implementation of a method which is already provided by its superclass. The method binding is done by the java interpreter at run time and fix the calling method based on the latest implementation in class hierarchy. This is also called as dynamic binding, late binding or run time polymorphism.

----
## **Abstraction**
#abstraction
Abstraction is a process of hiding the implementation details and showing only functionality to the user. Abstraction is selecting data from a larger pool to show only the relevant details to the object. It helps to reduce programming complexity and effort. In Java, abstraction is accomplished using Abstract classes and interfaces. Abstraction can be achieved using Abstract Class and Abstract Method in Java.
### **Abstract Class**

A class which is declared “**abstract**” is called as an *abstract class*. It can have abstract methods as well as concrete methods. A normal class cannot have abstract methods. Abstract classes help to describe generic types of behaviors and object-oriented programming class hierarchy. It also 29 Core JAVA describes subclasses to offer implementation details of the abstract class. Abstract class cannot be instantiated and is only used through inheritance. A “final” keyword cannot be used with abstract class.
**Abstract Method**: A method without a body is known as an Abstract Method. It must be declared in an abstract class. The abstract method will never be final because the abstract class must implement all the abstract methods. Abstract methods do not have an implementation; it only has method signature.
If a class is using an abstract method they must be declared abstract. The opposite cannot be true. This means that an abstract class does not necessarily have an abstract method. If a regular class extends an abstract class, then that class must implement all the abstract methods of the abstract parent otherwise this class will also become abstract. Abstract methods are mostly declared where two or more subclasses are also doing the same thing in different ways through different implementations.

---
## **Encapsulation**
#encapsulation
Classes and packages are both means of encapsulating and containing the name space and scope of variables and methods. Packages act as containers for classes and other subordinate packages. Classes act as containers for data and code. The class is Java’s smallest unit of abstraction. Because of the interplay between classes and packages, Java addresses four categories of visibility for class members: 
-  Subclasses in the same package
-  Non-subclasses in the same package
-  Subclasses in different packages 
-  Classes that are neither in the same package nor subclasses The three access modifiers, private, public, and protected, provide a variety of ways to produce the many levels of access required by these categories.

---

## **Interfaces**
#interface
An **interface** is like a class but, it has static constants and abstract methods only. An interface in java is a blueprint of a class. The interface in Java is a mechanism to achieve abstraction. There can be only abstract methods in the Java interface, not method body.
An interface is declared using interface keyword. It is used to provide total abstraction. That means all the methods in interface are declared with empty body and are public and all fields are public, static and final by default. A class that implement interface must implement all the methods declared in the interface. To implement interface use implements keyword. 
Interface can extend another interface. Java allows **multiple inheritance** using interface.

---
