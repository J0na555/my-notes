## Class: [[Python Web Frameworks|API]]

## Topic: #API #Restfulapi #REST #backend #ai #Rest

## Date: 27-03-2025

---

## **REPRESENTATIVE STATE TRANSFER API**

- is a network interface design style used for interaction between network applications.
   *Verb* + **Object**
 	- *GET*: **Read**
 	- *POST*: **Create**
 	- *PUT*: **Update**
 	- *DELETE*: **Delete**

 **NB**:

- according to HTTP specifications verbs should be always in UPPERCASE.
- The object must be a noun. The URL usually represents a resource that serves as object of HTTP verb. URL should be a noun rather than a verb cuz they represent a resource collection or a single instance rather than an action.  
    **INCORRECT**                    **CORRECT**
   /GetAllCars                  /users ->collection of cars
   /CreateNewCar                /users/123 ->instance of users
- When your URL points to a collection of resources, use plural nouns (users), even when pointing to a single user using a plural noun is good. e.g.: users/123

## **STATUS CODES**

- An HTTP status code is 3 digit number divided in 5.
 	- *1xx* - informational
 	- *2xx* - success
 	- *3xx* - re-directional
 	- *4xx* - client error
 	- *5xx* - server error

### 1xx STATUS CODES

- API don't need 1xx status codes.

### 2xx STATUS CODES

- **GET: 200 OK** - request was successful & the resource has returned
- **POST: 201 Created** - new resource was successfully created
- **PUT: 200 OK / 204: No Content** - used for full resource updates. If content is returned use 200 if not use 204.
- **PATCH: 200 OK / 204 No Content**- used for partial updates similar to *PUT*, 204 indicates no content returned.
- **DELETE: 204 No Content** - indicates the content was successfully deleted usually with no content in the response.
- **202 ACCEPETED** - request has been accepted but not yet processed, useful for asynchronous operations.
- **206 Partial Content** - Indicates a partial response.

### 3XX STATUS CODES

- API's typically don't allow 301(permanent redirect) or 302(temporary redirect) including 307, since they are mostly relevant for browser-level-navigation.
- But, API's may use *303 see other* which references another URL like *302* & *307* it means *temporary re-direct* but *303* is specifically for POST, PUT & DELETE requests, unlike 302 browser don't follow automatically 303 request but instead allow the user to decide the next step.

### 4xx STATUS CODES

- **400 Bad Request** - The server doesn't understand the clients request and doesn't process it.
- **401 Unauthorized** - user doesn't provide authentication credentials or failed authentication
- **403 Forbidden** - authenticates successfully but lacks permission to access the response
- **404 Not Found** - the requested response doesn't exist
- **405 Method Not Allowed** - authenticates successfully but uses HTTP method that's not allowed
- **410 Gone** - the requested resource has been permanently removed
- **415 Unsupported Media type** - requested format that is not supported
- **422 unprocessed entity** - the client provided an attachment that is not supported
- **429 Too Many Requests** - the client has exceeded the allowed number of requests.

### 5XX STATUS CODES

- API's don't usually expose internal server details to users, so only two status codes are typically used
- **500 Internal Server Error** - the client's request was valid but the server encounters an issue while processing it.
- **503 Service unavailable** - the server is temporarily unable to accept requests, often used for maintenance periods.
