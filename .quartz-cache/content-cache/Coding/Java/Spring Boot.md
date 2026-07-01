## Class: [[Spring Boot]]

## Topic: #Spring-boot #java #dependecies #auto-configuration #ioc  #REST #exception-handling #validation #mongoDB  #db-migration #backend

## Date: 21-03-2025

---

* Spring-boot simplifies Java-based Backend development by providing **auto-configuration**, **embedded servers** and **opinionated defaults**. to quickly build and deploy apps.
* Spring-boot follows a layered architecture.
    1. Presentation layer (Controller layer)
    2. Service layer (Business logic layer)
    3. Data access layer (Repository layer)
    4. Database layer (Persistent layer)

## 1.Presentation Layer (Controller Layer)

* This is where the API endpoints(REST Controllers) are defined.

* Handles HTTP Requests (GET, POST, PUT, DELETE) and returns responses in JSON/XML format.

* Uses **@RestController**, **@RequestMapping** , **@GetMapping**, ...annotations.
  
```java

    @RestController

    @RequestMapping("/users")

    public class UserController{

        @Autowired

        Private UserService userservice;

  

        @GetMapping("/{id}")

        public User getUser(@pathVariable long id){

            return userservice.getUserById(id);

        }

    }

```

## 2. Service Layer (Business Logic Layer)

* Contains the **business logic** of the application.
* Acts as the bridge between the Controller and Repository layer.
* Uses **@Service** annotation.

```java

    @Service

    public class UserService{

        @Autowired

        private UserRepository userreposiory;

  

        public user getUserById(long id){

            return userRepository.findById(id).orElse(null);

        }

    }

```

## 3. Data Access Layer (Repository Layer)

* Handles DataBase operations using Spring Data JPA or Spring Data MongoDB in my case since i am using MongoDB.

* Uses **@Repository** annotation.
  
```java

    @Repository

    public interface UserRepository extends JpaRepository < user, long > {

        //if its a Jpa repository

    }

```

this automatically provides a CRUD operations like findById( ), save( ), delete( ), ....

## 4. Database Layer (Persistent Layer)

* The actual database where the data is stored(MySQL, MongoDB, ....)
* Spring-boot supports both relational(JPA ) and NoSQL (MongoDB) databases.

Example: Entity for MySQL (JPA/Hibernate)

```java

    @Entity

    public class user{

        @Id

        @GeneratedValue(strategy = GenerationType.IDENTITY)

        private long id;

        private String name;

    }

```

---

# How Spring-boot Works Internally

  Spring-boot works in the following way:

#### 1. Spring-boot auto-configuration

* Automatically sets up Spring Beans, Database configs, Security, .....

#### 2. Embedded Servers

* Spring-boot removes the need for an external server
* By default it comes with *Tomcat*, *Jetty* or *Undertow*.

#### 3. Spring-boot Starters

* Starters are pre-configured dependencies to reduce boilerplate code.
     e.g.: `spring-boot-starter-web`-> for building REST APIs'
      `spring-boot-starter-data-mongodb`-> for database access

#### 4. Spring boot Application Lifecycle

 spring-boot application follows a lifecycle from *startup* to *shutdown*.

 1. start up
 * application starts running using `SpringApplication.run()`.
 * Auto-configuration happens.
 2. context initialization
 * spring scans for components (`@Component`,  `@Service`, `@Repository` , etc)
 * dependencies are injected via`@Autowired`.

3.Running
 
   - The application is fully running.

### 4. context refresh & events (hooks & listeners)

	 - during startup, spring triggers *events* that developers can listen to.

#### 5. shutdown

	- spring shuts down 
 - beans are destroyed
 - resources (sb connections, threads, caches) are cleaned up.

| Stages                         | what happens?                             |
| ------------------------------ | ----------------------------------------- |
| **1️⃣ Startup**                | `SpringApplication.run()` starts the app  |
| **2️⃣ Context Initialization** | Beans are created & dependencies injected |
| **3️⃣ Running**                | Application is fully functional           |
| **4️⃣ Events & Hooks**         | Listeners can respond to lifecycle events |
| **5️⃣ Shutdown**               | Cleanup happens, resources are released   |

---

# Spring-boot Starter Dependencies

# dependecies
* They are pre-configured dependencies that simplify project setup.
* Instead of manually adding multiple dependencies, you just add one *starter* and it automatically pulls everything needed.

## Commonly Used Spring-boot Starters

### **1️⃣ spring-boot-starter-web** 🌐 (For Building Web Apps & REST APIs)

📌 **Use when you need:**
* Spring MVC (Controllers, Services, Views)
* REST API development
* Embedded Tomcat server

📌 **Includes:**
* Spring MVC (`spring-web`)
* Jackson (for JSON handling)
* Embedded Tomcat

**Maven Dependency:**

```java
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

Gradle Dependency:

`implementation 'org.springframework.boot:spring-boot-starter-web'`

### 2️⃣  **spring-boot-starter-data-mongodb** 🍃 (For MongoDB)

📌 **Use when you need:**

* Work with **MongoDB (NoSQL database)**
*

📌 **Includes:**
* Spring Data MongoDB (`spring-data-mongodb`)
* MongoDB Java Driver

📌 **Dependency:**

```java
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-mongodb</artifactId>
</dependency>

```

## **🔹 Summary Table – Spring Boot Starters**

| Starter Name                         | Purpose                                      |
| ------------------------------------ | -------------------------------------------- |
| **spring-boot-starter-web**          | Build REST APIs & Web Applications           |
| **spring-boot-starter-data-jpa**     | Use JPA & Hibernate for relational databases |
| **spring-boot-starter-data-mongodb** | Work with MongoDB (NoSQL)                    |
| **spring-boot-starter-security**     | Implement [[Spring Security Basics & JWT|authentication & authorization]]     |
| **spring-boot-starter-validation**   | Validate request payloads                    |
| **spring-boot-starter-test**         | Write unit & integration tests               |
| **spring-boot-starter-mail**         | Send emails using SMTP                       |
| **spring-boot-starter-thymeleaf**    | Render dynamic HTML pages                    |
| **spring-boot-starter-actuator**     | Monitor application health & metrics         |

## **💡 How to Choose the Right Starters?**

✔️ If you're building a **REST API** → `spring-boot-starter-web`  
✔️ If you're working with a **relational database** → `spring-boot-starter-data-jpa`  
✔️ If you're working with **MongoDB (NoSQL)** → `spring-boot-starter-data-mongodb`  
✔️ If you need **authentication & security** → `spring-boot-starter-security`  
✔️ If you need **validation** → `spring-boot-starter-validation`  
✔️ If you want **testing** → `spring-boot-starter-test`

---

# Spring Boot Auto-Configuration

# auto-configuration

## **🔹 What is Auto-Configuration?**

Spring Boot **Auto-Configuration** is a feature that **automatically configures beans and dependencies** based on the libraries present in the classpath.

## **🔹 How Does Auto-Configuration Work?**

1️⃣ **Spring Boot scans the classpath** for dependencies (e.g., `spring-web`, `spring-data-jpa`)  
2️⃣ **Loads default configurations** for detected dependencies  
3️⃣ **Creates required beans automatically**

This is enabled by **`@SpringBootApplication`**, which includes `@EnableAutoConfiguration`.

example:

```java
@SpringBootApplication
public class MyApplication {
    public static void main(String[] args) {
        SpringApplication.run(MyApplication.class, args);
    }
}
// this automatically configures a spring-boot application
```

Spring Boot **Auto-Configuration** **removes the need for manual setup**, making development **fast and easy**. It detects dependencies and **configures everything automatically**

---

# Inversion of Control (IoC)

# ioc

## **🔹 What is Inversion of Control (IoC)?**

Inversion of Control (IoC) is a **design principle** in which the **control of object creation and dependency management** is transferred from the programmer to a framework (like Spring).

## **🔹 Traditional (Without IoC) vs. IoC Example**

### **🛑 Without IoC (Manual Object Creation)**

```java
  public class Car {
      private Engine engine;
  
      public Car() {
          this.engine = new Engine(); 
          // Manually creating dependency
      }
  }

```

🔴 **Problem:** The `Car` class is tightly coupled to the `Engine` class. If we change the `Engine`, we must modify `Car`.

### **✅ With IoC (Spring Manages Dependencies)**

```java
 @Component
 public class Engine {
     public void start() {
         System.out.println("Engine started!");
     }
 }
 
 @Component
 public class Car {
     private final Engine engine;
 
     @Autowired // Spring injects Engine automatically!
     public Car(Engine engine) {
         this.engine = engine;
     }
 }

```

🔹 **Spring creates and injects the Engine** automatically → No need to manually create objects!

## **🔹 IoC in Action – Example**

### **1️⃣ Define Components (Beans)**

```java
 @Component 
 public class Engine {     
  public void start() {         
   System.out.println("Engine started!");     
  } 
 }
```

### **2️⃣ Inject Dependencies using `@Autowired`**

```java
 @Component
 public class Car {     
  private final Engine engine; 
       
  @Autowired     
  public Car(Engine engine) {         
   this.engine = engine;     
  }      
  public void drive() {         
   engine.start();         
   System.out.println("Car is moving!");     
  } 
 }
```

### **3️⃣ Run the Application**

```java
 @SpringBootApplication 
 public class MyApp {     
  public static void main(String[] args) {         
   ApplicationContext context = SpringApplication.run(MyApp.class, args);          
   
   // Get Car bean from IoC Container         
   Car car = context.getBean(Car.class);        
   car.drive();     
  } 
 }
```

✅ **Spring Boot automatically manages `Car` and `Engine` beans and injects dependencies.**

## **🔹 IoC and Dependency Injection (DI)**

IoC is **the concept**, and **Dependency Injection (DI)** is **the technique** used to achieve IoC.

📌 **IoC = Giving control to Spring**  
📌 **DI = How Spring injects dependencies automatically**

---

# **Understanding REST APIs**

# REST

### **🔹 What is a REST API?**

A **REST API** (Representational State Transfer) is a set of **rules** that allow systems to communicate over HTTP using standard **CRUD** operations (Create, Read, Update, Delete).

### **💡 Key Principles of REST:**

1. **Stateless**: Each request is independent; no client session stored on the server.
2. **Client-Server Architecture**: Client and server are separate, communicating via HTTP.
3. **Uniform Interface**: Uses standardized HTTP methods (GET, POST, PUT, DELETE).
4. **Resource-Based**: Resources (like data) are identified by URLs.  
5. **Representation**: Resources can be represented in formats like JSON or XML.  

### **💡 HTTP Methods in REST:**

* **GET**: Retrieve data
* **POST**: Create data  
* **PUT**: Update data
* **DELETE**: Delete data
* **PATCH**: Partially update data
## **Building Controllers in Spring Boot**

### **🔹 What is a Controller?**

In Spring Boot, **Controllers** are responsible for **handling incoming HTTP requests** and returning appropriate responses.

### **💡 Building a Basic Controller:**

```java
 @RestController // Indicates it's a REST controller
@RequestMapping("/api") // Base URL mapping
public class MyController {
    
    @GetMapping("/hello") // Handle GET requests at /api/hello
    public String sayHello() {
        return "Hello, World!";
    }
}

```

- `@RestController` combines `@Controller` and `@ResponseBody` to return data directly as JSON.
* `@GetMapping` is used to handle GET requests.
* You can use `@PostMapping`, `@PutMapping`, `@DeleteMapping` for POST, PUT, and DELETE requests.

### **💡 Request Mapping**

You can map specific HTTP methods to specific methods in the controller using:

* `@RequestMapping` for generic mapping
* `@GetMapping`, `@PostMapping`, `@PutMapping`, `@DeleteMapping` for specific methods.

## **Request and Response Handling**

### **🔹 Request Handling:**

Spring automatically maps incoming HTTP requests to the corresponding methods using annotations like `@RequestMapping`, `@GetMapping`, etc.

#### **Extracting Request Parameters:**

```java
@GetMapping("/greet")
public String greet(@RequestParam String name) {
    return "Hello, " + name;
}
```

- `@RequestParam`: Extracts query parameters from the URL.

#### **Path Variables:**

```java
@GetMapping("/users/{id}")
public User getUser(@PathVariable Long id) {
    return userService.getUserById(id);
}
```

`@PathVariable`: Extracts values from the URL path.

### **🔹 Response Handling:**

Spring automatically serializes the return values into JSON or XML.

#### **Response Body:**

```java
@GetMapping("/users")
@ResponseBody
public List<User> getUsers() {
    return userService.getAllUsers();
}
```

- `@ResponseBody`: Tells Spring to convert the returned object to JSON.

#### **Response Entity:**

For more flexibility in handling HTTP responses, you can use `ResponseEntity`.

## **Response Entity**

### **🔹 What is ResponseEntity?**

`ResponseEntity` is a wrapper for the HTTP response, allowing you to control the **status code**, **headers**, and **body** in a response.

### **💡 Example of Using ResponseEntity:**

```java
@GetMapping("/users/{id}")
public ResponseEntity<User> getUser(@PathVariable Long id) {
    Optional<User> user = userService.getUserById(id);
    if (user.isPresent()) {
        return ResponseEntity.ok(user.get()); // 200 OK
    } else {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build(); // 404 Not Found
    }
}
```

- **`ResponseEntity.ok()`**: Returns HTTP status 200 with a body.
* **`ResponseEntity.status(HttpStatus.NOT_FOUND)`**: Returns HTTP status 404 without a body.

### **💡 Why Use ResponseEntity?**

* **Custom status codes**: You can return any HTTP status code you need.

* **Headers**: You can add custom headers to the response.

---

# **Exception Handling in Spring Boot**

# exception-handling

### **🔹 What is Exception Handling?**

Exception handling in Spring Boot helps to manage errors and send appropriate HTTP responses (like 404 for resource not found, 400 for bad requests, etc.).

### **💡 Basic Exception Handling Example:**

```java
@GetMapping("/users/{id}")
public User getUser(@PathVariable Long id) {
    if (id == null) {
        throw new UserNotFoundException("User not found with id: " + id);
    }
    return userService.getUserById(id);
}

```

### **💡 Global Exception Handling with `@ControllerAdvice`**

You can handle exceptions globally using `@ControllerAdvice`.

```java
@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<String> handleUserNotFound(UserNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }
}

```

- `@ExceptionHandler`: Specifies the exception type to handle.

* `@ControllerAdvice`: Handles exceptions globally across all controllers.

---

# **Validation in Spring Boot**

# validation

### **🔹 What is Validation?**

Validation ensures that the incoming data (such as form inputs or JSON body) is **correct** and **meets specific criteria** before processing.

### **💡 Using `@Valid` for Validation:**

```java
@PostMapping("/users")
public ResponseEntity<String> createUser(@RequestBody @Valid User user) {
    userService.saveUser(user);
    return ResponseEntity.status(HttpStatus.CREATED).body("User created");
}

```

- `@Valid`: Tells Spring to validate the object before passing it to the controller.

### **💡 Validation Annotations:**

You can use various annotations to validate fields in a class:

* `@NotNull`: The field must not be null.
* `@Size(min = 2, max = 100)`: The field size should be between 2 and 100 characters.
* `@Email`: Validates if the field is a valid email.

```java
public class User {
    @NotNull
    private String name;
    
    @Email
    private String email;
    
    @Size(min = 5)
    private String password;
}
```

### **💡 Custom Validation:**

You can create custom validation annotations for more complex checks.

```java
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = EmailValidator.class)
public @interface ValidEmail {
    String message() default "Invalid email";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

```

## **Summary of Key Concepts:**

| **Topic**                         | **Description**                                                                                                                |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **Understanding REST APIs**       | Defines how systems communicate over HTTP using standard methods (GET, POST, etc.).                                            |
| **Building Controllers**          | Spring controllers handle HTTP requests and responses. Use `@RestController` and `@RequestMapping` to create RESTful services. |
| **Request and Response Handling** | Spring maps request parameters using annotations like `@RequestParam` and `@PathVariable`, and returns data as JSON or XML.    |
| **Response Entity**               | `ResponseEntity` allows control over the response body, headers, and status code.                                              |
| **Exception Handling**            | Use `@ExceptionHandler` or `@ControllerAdvice` to handle errors globally and return appropriate HTTP responses.                |
| **Validation**                    | Use `@Valid`, `@NotNull`, `@Size`, etc., to validate incoming request data.                                                    |

---

# **Spring Data MongoDB**

# mongoDB

### **🔹 What is Spring Data MongoDB?**

**Spring Data MongoDB** is a part of the Spring Data project that provides a simple way to interact with a **MongoDB database** in a Spring-based application. It integrates MongoDB with Spring's data access layer and simplifies the process of CRUD operations.

### **💡 Key Features:**

* **Automatic Mapping**: Maps Java objects to MongoDB documents using annotations.
* **Repository Support**: Provides `MongoRepository` for easy access to MongoDB collections.
* **Query Methods**: Supports the creation of custom queries using method naming conventions or `@Query` annotation

### **🔹 Setting Up Spring Data MongoDB**

1. **Add Dependencies**: In your `pom.xml` (for Maven):

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-mongodb</artifactId>
</dependency>

```

For Gradle:

```java
implementation 'org.springframework.boot:spring-boot-starter-data-mongodb'
```

1. **Configure MongoDB in `application.properties` or `application.yml`**: In `application.properties`:

```java
spring.data.mongodb.uri=mongodb://localhost:27017/mydb

```

In `application.yml`:

```yaml
spring:
  data:
    mongodb:
      uri: mongodb://localhost:27017/mydb

```

1. **Create a MongoDB Entity**: An **entity** in MongoDB is a class that will represent documents in a MongoDB collection. You can annotate the class with `@Document` to mark it as a MongoDB entity.

```java
@Document(collection = "users")
public class User {

    @Id
    private String id;
    private String name;
    private String email;
    
    // Getters and Setters
}

```

- `@Document` is used to mark this class as a MongoDB document (equivalent to a row in a table).
* `@Id` marks the primary key (usually the `_id` field in MongoDB).

4. **Create a MongoDB Repository**: You can create a repository interface by extending `MongoRepository` or `CrudRepository`.

```java
public interface UserRepository extends MongoRepository<User, String> {
    List<User> findByName(String name);
}

```

- `MongoRepository` provides methods for standard CRUD operations, including `save()`, `findById()`, `delete()`, etc.
* You can define **custom query methods** using Spring Data's query method conventions (e.g., `findByName()`).

### **🔹 Basic CRUD Operations**

 **Save**:

```java
@Autowired
private UserRepository userRepository;

public void saveUser(User user) {
    userRepository.save(user);  // Save or update a user
}

```

**Find**:

```java
public User getUserById(String id) {
    return userRepository.findById(id).orElse(null);
}

```

**Delete**:

```java
public void deleteUser(String id) {
    userRepository.deleteById(id);
}

```

**Custom Queries**: Spring Data MongoDB also allows creating custom queries with `@Query`:

```java
@Query("{ 'email' : ?0 }")
User findByEmail(String email);

```

---

# **Database Migration in Spring Boot**

# db-migration

### **🔹 Why Database Migration?**

Database migration helps to manage **database schema changes** (e.g., adding new tables, columns) in a controlled and versioned manner, especially for **production environments**. It ensures that your database schema is always in sync with your application code.

### **💡 Key Tools for Database Migration:**

* **Flyway**: A database migration tool that allows version-controlled migrations using SQL or Java-based migrations.

* **Liquibase**: Another tool for managing database migrations, using XML, YAML, or JSON format for change logs.

###  **Using Flyway with Spring Boot**

1. **Add Flyway Dependency**: In your `pom.xml`:

```xml
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-core</artifactId>
</dependency>

```

For Gradle:

```gradle
implementation 'org.flywaydb:flyway-core'

```

2. **Configuration**: Flyway will automatically run SQL migration scripts at application startup, and you can configure it in the `application.properties` file.

```properties
spring.flyway.url=jdbc:mysql://localhost:3306/mydb
spring.flyway.user=root
spring.flyway.password=password
spring.flyway.locations=classpath:db/migration

```

3. **Create Migration Scripts**: Create migration files in `src/main/resources/db/migration`. Flyway follows a naming convention like `V1__Initial_schema.sql`, `V2__Add_table_users.sql`, etc.

Example of `V1__Initial_schema.sql`:

```sql
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255)
);

```

* **Naming Convention**:
        - `V1`, `V2`, etc., is the version number.
        - `__` separates the version number from the description.

4. **Flyway Executes Migrations**: On application startup, Flyway will automatically apply all **pending migrations** to the database.
    * **Flyway’s Migration Strategy**:
        * **Migrate**: Runs all pending migrations.
        * **Clean**: Drops the schema and recreates it (use with caution).
        * **Validate**: Validates the schema against the applied migrations.
        * **Repair**: Repairs the Flyway metadata table if needed.

### **🔹 Using Liquibase with Spring Boot**

1. **Add Liquibase Dependency**: In your `pom.xml`:

```xml
<dependency>
    <groupId>org.liquibase</groupId>
    <artifactId>liquibase-core</artifactId>
</dependency>

```

2. Configuration**: Liquibase can be configured similarly to Flyway in the `application.properties` file:

```properties
spring.liquibase.change-log=classpath:db/changelog/db.changelog-master.xml

```

3. **Creating Liquibase Changelog**: Liquibase uses **XML-based changelogs** to manage schema changes.

Example of `db.changelog-master.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<databaseChangeLog
    xmlns="http://www.liquibase.org/xml/ns/dbchangelog"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.liquibase.org/xml/ns/dbchangelog
        http://www.liquibase.org/xml/ns/dbchangelog/dbchangelog-3.8.xsd">

    <changeSet author="user" id="1" >
        <createTable tableName="users">
            <column name="id" type="BIGINT">
                <autoIncrement/>
                <constraints primaryKey="true"/>
            </column>
            <column name="name" type="VARCHAR(255)"/>
            <column name="email" type="VARCHAR(255)"/>
        </createTable>
    </changeSet>

</databaseChangeLog>

```

### **🔹 Summary:**

|**Topic**|**Description**|
|---|---|
|**Spring Data MongoDB**|Simplifies interacting with MongoDB using repositories like `MongoRepository` for CRUD operations.|
|**MongoDB Entity**|Use `@Document` and `@Id` to map a Java class to a MongoDB collection.|
|**Flyway Database Migration**|A tool to manage schema changes, using versioned SQL migration scripts.|
|**Liquibase Database Migration**|Another migration tool that uses XML, YAML, or JSON changelogs to manage schema changes.|
|**Database Migration Setup**|Involves adding Flyway or Liquibase dependencies, configuring in `application.properties`, and creating migration scripts or changelogs.|

## **🚀 Conclusion**

* **Spring Data MongoDB** simplifies database interaction in a Spring Boot app with automatic object mapping and repository support.
* **Database migration** tools like **Flyway** and **Liquibase** ensure controlled and versioned schema changes, crucial for production applications.
