---
title: simple API rate limiter
date: 2026-08-01
tags:
  - backend
  - ratelimiter
  - nodejs
type: note
status: draft
source: https://medium.com/@ignatovich.dm/creating-a-simple-api-rate-limiter-with-node-a834d03bad7a
publish: "false"
---
API rate limiting is an essential technique to prevent abuse and ensure the smooth operation of a server by restricting the number of requests a client can make in a given timeframe. It is commonly used to protect public APIs, prevent brute-force attacks, and reduce server load.

### What is Rate limiting?
Rate limiting controls the rate at which users can access a service by limiting the number of allowed requests within a specific period. It's often implemented by monitoring the client's IP address or user account and blocking further requests after reaching limit.

### Using express-rate-limit
express-rate-limit is a popular library that simplifies the implementation of rate limiting in express applications. 

here is the implementation
```javascript
const express = require('express');
const rateLimit = require('express-rate-limit);
const app = express();

// set up rate limiter, max of 100 req per 15 min per IP
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 min
	max: 100, // limit each IP to 100 req per 'window' (15 min)
	message: "Too many requests from this IP, please try again after 15 minutes",
});

// apply the rate limiter to all req
app.use(limiter);

app.get('/', (req, res) => {
	res.send('Hello World');
});

app.listen(3000, () => {
	console.log('Server running on http://localhost:3000');
});

```

explanation
- windowMs: the time window wher the req are conted (the 15 mins)
- max: max number req allowed with in the window
- message: custom message return to the rate limit abuser

### building your own Rate limiting Middleware
building from scratch cause its *based*

##### Custom In-Memory Rate Limiter
The simplest implementation is to store the req counts in memory. This method is effective for small applications but it doesnot scale well across multiple instances. Here's basic example

```javascript
const express = require('express');
const app = express();

// store req counts per IP
const reqCounts = {};

// cutom rate limiter middleware
const rateLimiter = (req, res, next) => {
const ip = req.ip;
const now = Date.now()

if(!reqCounts[ip]) {
	reqCounts[ip] = { count:1, lastRequest: now};
} else {
	const timeSinceLastRequest = now - reqCounts[ip].lastRequest;
	const timelimit = 15 * 60 * 1000; //15 min
	
	if (timeSinceLastRequest < timelimit) {
		reqCounts[ip].count += 1;
	} else {
		reqCounts[ip] = { count: 1, lastrequest: now}; // reset after time window
	}
}

const maxReq = 100;
if (reqCounts[ip].count > maxReq) {
	return res.status(429).json({message: 'Too many requests'});
}

reqCounts[ip].lastRequest = now;
next();
};

// apply the custom rate limiter
app.use(rateLimiter);

app.get('/', (req, res) => {
	res.send('welcome to the new rate limiter');
})

app.listen(3000, () => {
console.log('server running on http://localhost:3000');
});

```

- the middleware keeps track of each IP address's req count and the time of the last req, if the count exceeds 100 in 15 min the middleware blocks further req by returning 429 too many req status code. The count rests after the window has passed.
**pros**: full  control over logic
**cons**: In-memory storage is not scalable for distributed systems or multiple server instances

##### Storing Request Counts in Redis
 For larger apps, storing req counts in Redis is a more scalable soln.

```javascript
const express = require('express');  
const Redis = require('ioredis');  
const app = express();  
  
const redis = new Redis();  
  
// Rate limiter using Redis  
const rateLimiter = async (req, res, next) => {  
  const ip = req.ip;  
  const currentTime = Date.now();  
  const key = `rate-limit:${ip}`;  
  
  const limit = 100; // Max requests  
  const windowTime = 15 * 60; // 15 minutes in seconds  
  
  const requests = await redis.incr(key);  
  
  if (requests === 1) {  
    // Set the expiration of the key to the time window on first request  
    await redis.expire(key, windowTime);  
  }  
  
  if (requests > limit) {  
    return res.status(429).json({ message: 'Too many requests, try again later.' });  
  }  
  
  next();  
};  
  
// Apply the rate limiter to API routes  
app.use('/api', rateLimiter);  
  
app.get('/api', (req, res) => {  
  res.send('Rate-limited API');  
});  
  
app.listen(3000, () => {  
  console.log('Server running on http://localhost:3000');  
});
```

- The redis key is the user's IP address. Redis increments the req count each time an API call is made from that IP
### Use Cases for Rate Limiting

• Protecting Public APIs: Public APIs are highly susceptible to abuse and may experience heavy traffic from unauthorized or malicious users. Rate limiting helps ensure fair usage and prevents a single user from consuming excessive resources.

• Reducing Server Load: By limiting the number of requests a client can make, you can protect your server from being overwhelmed by too many requests, which could degrade the performance for other users.

• Preventing Brute-Force Attacks: Rate limiting is effective in slowing down brute-force login attempts by restricting the number of login attempts within a short period.