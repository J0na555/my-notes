---
title: settings.py
tags:
  - channels
  - django
  - intro_to_django
  - websockets
date: 2025-09-22
---

## Frontend Technologies Connected to Django Channels

### 1. WebSocket API (JavaScript)

**Essential for real-time communication:**

```javascript
// Basic WebSocket connection
const chatSocket = new WebSocket(
    'ws://' + window.location.host + '/ws/chat/roomname/'
);

chatSocket.onmessage = function(e) {
    const data = JSON.parse(e.data);
    console.log('Message:', data);
};

chatSocket.onclose = function(e) {
    console.error('Chat socket closed unexpectedly');
};

// Sending data
function sendMessage(message) {
    chatSocket.send(JSON.stringify({
        'message': message
    }));
}
```

### 2. Frontend Frameworks Integration

**React Example:**

```jsx
import React, { useState, useEffect } from 'react';

function ChatApp() {
    const [messages, setMessages] = useState([]);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = new WebSocket('ws://localhost:8000/ws/chat/lobby/');
        
        newSocket.onmessage = (e) => {
            const data = JSON.parse(e.data);
            setMessages(prev => [...prev, data.message]);
        };

        setSocket(newSocket);

        return () => newSocket.close();
    }, []);

    const sendMessage = (message) => {
        socket.send(JSON.stringify({ message }));
    };

    return (
        <div>
            {/* Chat interface */}
        </div>
    );
}
```

**Vue.js Example:**

```vue
<template>
    <div>
        <div v-for="message in messages" :key="message.id">
            {{ message.text }}
        </div>
        <input @keyup.enter="sendMessage" v-model="newMessage">
    </div>
</template>

<script>
export default {
    data() {
        return {
            messages: [],
            newMessage: '',
            socket: null
        };
    },
    mounted() {
        this.socket = new WebSocket('ws://localhost:8000/ws/chat/lobby/');
        this.socket.onmessage = (event) => {
            this.messages.push(JSON.parse(event.data));
        };
    },
    methods: {
        sendMessage() {
            this.socket.send(JSON.stringify({ message: this.newMessage }));
            this.newMessage = '';
        }
    }
};
</script>
```

## Related Backend Technologies

### 1. Redis (Channel Layer Backend)

**Essential for production deployment:**

```python
# settings.py
CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            "hosts": [("redis://:password@127.0.0.1:6379/0")],
            "capacity": 1500,  # default 100
            "expiry": 10,      # default 60
        },
    },
}
```

### 2. Celery (Background Tasks)

**For long-running processes:**

```python
# tasks.py
from celery import shared_task
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

@shared_task
def process_and_notify(data, user_id):
    # Process data
    result = heavy_processing(data)
    
    # Send notification via WebSocket
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f"user_{user_id}",
        {
            "type": "processing.complete",
            "result": result
        }
    )
```

### 3. [[DRF Principles|Django REST Framework (API Integration)]]

**Combining REST APIs with WebSockets:**

```python
# consumers.py
from rest_framework.authtoken.models import Token

class APIConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Get token from query string
        token_key = self.scope['query_string'].decode().split('=')[1]
        try:
            token = await database_sync_to_async(Token.objects.get)(key=token_key)
            self.scope['user'] = token.user
            await self.accept()
        except Token.DoesNotExist:
            await self.close()
```

## Deployment & Infrastructure

### 1. Docker & Docker Compose

**docker-compose.yml example:**

```yaml
version: '3.8'

services:
  redis:
    image: redis:alpine
    ports:
      - "6379:6379"
  
  web:
    build: .
    command: daphne myproject.asgi:application --port 8000 --bind 0.0.0.0
    volumes:
      - .:/app
    ports:
      - "8000:8000"
    depends_on:
      - redis
  
  worker:
    build: .
    command: python manage.py runworker
    volumes:
      - .:/app
    depends_on:
      - redis
      - web
```

### 2. Nginx Configuration

**For WebSocket support:**

```nginx
server {
    listen 80;
    server_name example.com;

    location / {
        proxy_pass http://web:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location /static/ {
        alias /app/staticfiles/;
    }
}
```

## Real-time Patterns & Architectures

### 1. Publish-Subscribe Pattern

```python
# Using Redis pub/sub with Channels
class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add("notifications", self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("notifications", self.channel_name)

    async def user_notification(self, event):
        await self.send(text_data=json.dumps(event["message"]))
```

### 2. Real-time Database Updates

| Command | Description |
|---|---|
| `django-admin startproject <project-name>` | [[Creating Django Project|Create a new Django project]] |
**Using Django Signals with Channels:**

```python
# signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .models import Message

@receiver(post_save, sender=Message)
def message_created(sender, instance, created, **kwargs):
    if created:
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f"chat_{instance.room.id}",
            {
                "type": "new_message",
                "message": instance.content,
                "sender": instance.sender.username
            }
        )
```

## Frontend State Management

### 1. Redux with WebSockets

```javascript
// WebSocket middleware for Redux
const websocketMiddleware = (store) => (next) => (action) => {
    if (action.type === 'WS_CONNECT') {
        const socket = new WebSocket(action.payload);
        
        socket.onmessage = (event) => {
            store.dispatch({
                type: 'WS_MESSAGE',
                payload: JSON.parse(event.data)
            });
        };
        
        store.dispatch({
            type: 'WS_SOCKET_SET',
            payload: socket
        });
    }
    
    return next(action);
};
```

### 2. Vuex with WebSockets

```javascript
// Vuex plugin for WebSockets
const websocketPlugin = (store) => {
    const socket = new WebSocket('ws://localhost:8000/ws/data/');
    
    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        store.commit('UPDATE_DATA', data);
    };
    
    store.subscribe((mutation) => {
        if (mutation.type === 'SEND_DATA') {
            socket.send(JSON.stringify(mutation.payload));
        }
    });
};
```

## Testing Strategies

### 1. End-to-End Testing with Cypress

```javascript
// Cypress test for WebSocket functionality
describe('WebSocket Chat', () => {
    it('sends and receives messages', () => {
        cy.visit('/chat');
        cy.get('#message-input').type('Hello World!{enter}');
        cy.contains('.message', 'Hello World!').should('exist');
    });
});
```

### 2. Jest Testing with Mock WebSockets

```javascript
// Mock WebSocket for testing
global.WebSocket = class MockWebSocket {
    constructor(url) {
        this.url = url;
        this.onmessage = null;
    }
    
    send(data) {
        // Mock response
        if (this.onmessage) {
            this.onmessage({ data: JSON.stringify({ echo: data }) });
        }
    }
};
```

## Performance Optimization

### 1. Frontend Debouncing

```javascript
// Debounce WebSocket messages
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

const sendMessage = debounce((message) => {
    websocket.send(JSON.stringify({ message }));
}, 300);
```

### 2. Backend Message Batching

```python
# Batch messages for efficiency
class BatchedConsumer(AsyncWebsocketConsumer):
    def __init__(self):
        super().__init__()
        self.message_buffer = []
        self.batch_task = None

    async def receive(self, text_data):
        self.message_buffer.append(text_data)
        
        if not self.batch_task:
            self.batch_task = asyncio.create_task(self.process_batch())

    async def process_batch(self):
        await asyncio.sleep(0.1)  # Wait for more messages
        if self.message_buffer:
            # Process all buffered messages
            combined_data = self.process_messages(self.message_buffer)
            await self.send(combined_data)
            self.message_buffer.clear()
        self.batch_task = None
```

## Security Considerations

### 1. Frontend Security

```javascript
// Secure WebSocket connections
const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const socket = new WebSocket(`${protocol}//${window.location.host}/ws/chat/`);
```

### 2. Backend Authentication

```python
# JWT authentication with Channels
from channels.middleware import BaseMiddleware
from jwt import decode, InvalidTokenError
from django.conf import settings

class JWTAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        query_string = scope.get('query_string', b'').decode()
        token = None
        
        for part in query_string.split('&'):
            if part.startswith('token='):
                token = part.split('=')[1]
                break
        
        if token:
            try:
                payload = decode(token, settings.SECRET_KEY, algorithms=['HS256'])
                scope['user'] = await get_user(payload['user_id'])
            except InvalidTokenError:
                pass
        
        return await super().__call__(scope, receive, send)
```

## Related Learning Paths

1. **WebSocket Protocol** - Deep understanding of the protocol itself
2. **Redis** - Essential for production channel layers
3. **Asynchronous Python** - async/await, asyncio
4. **Frontend Frameworks** - React, Vue, Angular real-time integration
5. **DevOps** - Deployment, scaling, and monitoring
6. **WebRTC** - For peer-to-peer communication (complementary to WebSockets)
7. **GraphQL Subscriptions** - Alternative real-time approach
8. **Message Brokers** - RabbitMQ, Kafka for larger systems

Django Channels sits at the intersection of these technologies, making it a gateway to learning modern full-stack development with real-time capabilities.

## Related

- [[Django REST Framework Generic API Views - Crash Course]]
- [[Django Concepts]]
- [[Intro to Django]]
- [[Django Channels]]
- [[Django Channels 1]]
- [[Django Authentication]]
- [[Session-Based Authentication]]
