## The "Why" Behind Every Line

Let's break down that `test_protected` view line by line, but with the **decision tree** that leads to each choice:

### The Mental Process (What You're Missing)

**Step 1: "What do I actually want this endpoint to do?"**

- I need a protected endpoint to test my auth
- It should return some user info to prove auth is working
- Keep it simple - just say "hello" with username

**Step 2: "How does Django REST handle simple endpoints?"**

- I remember `@api_view` decorator for function-based [[DRF principles|views]]
- Need to specify HTTP methods it accepts
- This is just a GET request

**Step 3: "Who can access this?"**

- Only authenticated users
- Django REST has `[[DRF principles|IsAuthenticated]]` permission class
- Need `@permission_classes` decorator

**Step 4: "What does success look like?"**

- Return JSON with message and username
- Use Django REST's `Response` class
- Pull username from `request.user`

### Now the Code (With Decision Context)

```python
# Decision: "I want a simple function-based view, not a class-based one"
# Why: Easier to understand for testing, less boilerplate
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

# Decision: "This function represents one specific API endpoint"
# Why: Each function = one clear responsibility
@api_view(['GET'])  # Decision: "Only allow GET requests"
                    # Why: This endpoint just retrieves info, doesn't modify
@permission_classes([IsAuthenticated])  # Decision: "Only logged-in users"
                                        # Why: Testing auth protection
def test_protected(request):  # Decision: "Standard Django view function signature"
                              # Why: DRF automatically parses request, adds auth
    # Decision: "I need the current user's username"
    # Why: To prove the auth is working and I can access user data
    username = request.user.username
    
    # Decision: "Return JSON response with user info"
    # Why: REST APIs return JSON, DRF Response handles serialization
    return Response({
        'message': 'Hello authenticated user!',  # Decision: "Friendly success message"
        'user': username  # Decision: "Include actual user data to verify"
    })
```

## The Paper/Excalidraw Workflow (Your New Best Friend)

**YES, absolutely do this!** Here's exactly how:

### Step 1: The "Endpoint Card" Method

For each endpoint, write a 3x5 card (or digital equivalent):

```
🔒 PROTECTED USER TEST
-----------
WHAT: Prove auth is working
WHO: Authenticated users only
HOW: GET request
RETURNS: {message: "hello", user: "username"}

DECISIONS:
- Use @api_view(['GET']) - simple read operation
- @permission_classes([IsAuthenticated]) - auth check
- request.user.username - get current user
- Response() - JSON response
```

### Step 2: The Decision Tree Sketch

Draw this before coding:

```
I need a protected endpoint
    └── What HTTP method? 
        └── GET (just reading info)
            └── Who can access?
                └── Authenticated users only
                    └── How to enforce?
                        └── @permission_classes([IsAuthenticated])
                            └── What data to return?
                                └── User info to prove it works
                                    └── request.user.username
                                        └── Wrap in Response()
```

### Step 3: The "Code Skeleton" Pass

Write the structure first, comments only:

```python
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def test_protected(request):
    # TODO: Get current user info
    # TODO: Return success response
    pass
```

### Step 4: Fill in the Blanks

Now add one line at a time, testing each:

```python
# First: Just return something
return Response({'message': 'It works!'})

# Then: Add user info
username = request.user.username
return Response({'message': 'Hello!', 'user': username})
```

## The Mental Model Shift

**Instead of "What code do I write?"**
Ask: **"What decision am I making right now?"**

For every line of code, there should be a clear "why" that maps back to your endpoint card.

## Your New Workflow for Messages Endpoint

Let's apply this to your next endpoint. **Grab paper now** and do this:

### 1. Write the Endpoint Card

```
💬 SEND MESSAGE
-----------
WHAT: Create new chat message
WHO: Authenticated users only
HOW: POST request
INPUT: {text: "hello", room_id: 1}
RETURNS: {id: 5, text: "hello", user: "john", timestamp: "..."}

DECISIONS:
- POST method - creating new resource
- Need Message model with text, user, room, timestamp
- Validate input (text not empty, room exists)
- Save to database
- Return created message
- Handle errors (invalid room, empty text)
```

### 2. Sketch the Decision Flow

```
POST /api/messages/
    └── Get data from request
        └── text, room_id from request.data
            └── Validate inputs
                └── text not empty?
                └── room exists?
                    └── Get current user from request.user
                        └── Create Message object
                            └── Save to database
                                └── Return 201 with message data
                                    └── Or return 400 with errors
```

### 3. Code Skeleton

```python
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Message, Room

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_message(request):
    # TODO: Extract and validate input
    # TODO: Create and save message
    # TODO: Return success or error
    pass
```

### 4. Fill Line by Line

**Line 1**: Extract data

```python
text = request.data.get('text')
room_id = request.data.get('room_id')
```

**Line 2**: Validate

```python
if not text or not text.strip():
    return Response({'error': 'Message cannot be empty'}, status=status.HTTP_400_BAD_REQUEST)
```

**Line 3**: Check room exists

```python
try:
    room = Room.objects.get(id=room_id)
except Room.DoesNotExist:
    return Response({'error': 'Room not found'}, status=status.HTTP_400_BAD_REQUEST)
```

**Line 4**: Create message

```python
message = Message.objects.create(
    text=text.strip(),
    user=request.user,
    room=room
)
```

**Line 5**: Return success

```python
return Response({
    'id': message.id,
    'text': message.text,
    'user': message.user.username,
    'timestamp': message.created_at
}, status=status.HTTP_201_CREATED)
```

## The Magic Happens Here

**After doing this 3-4 times**, you'll start seeing patterns:

- `@api_view` for simple endpoints
- `@permission_classes` for auth
- `request.data.get()` for input
- `Response(..., status=...)` for outputs
- Try/except for validation

Suddenly, writing the **next** endpoint becomes: "Oh, it's like the last one, but with different validation."

**Grab a notebook and do this for the messages endpoint:**

1. Write the endpoint card (5 minutes)
2. Sketch the decision tree (5 minutes)  
3. Write the code skeleton (5 minutes)
4. Fill in one section at a time, testing in Postman after each

**Pro tip**: Keep a "Decision Journal" - one page per endpoint with your card + final code. In a month, you'll have a cheat sheet for every common pattern.
