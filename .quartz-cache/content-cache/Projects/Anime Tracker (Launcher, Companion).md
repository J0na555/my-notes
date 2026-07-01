---
title: anime tracker/launcher/companion
tags:
  - project
  - anime
date: 2026-03-14
type: plan
status: draft
source: chatgpt
---
# the core goal of the app
the app is not anime tracker, but companion + launcher

core responsibilities
- Sync anime list from tracker
- Provide **resume watching**
- Route to working **streaming sites**
- Provide **productivity stats**
- Provide **recommendations**
- Track **weekly releases**
# core architecture
- design in layers
```
Frontend
   │
Backend API
   │
Service Layer
   │
Tracker Adapter Layer
   │
External APIs (AniList / MAL later)
```

- modules
```
auth/
tracker/
streaming/
anime/
productivity/
recommendation/
release_tracker/
```

# Tracker abstraction layer
base interface

```python
class TrackerAdapter:

    def get_user_list(user_token):
        pass

    def update_progress(user_token, anime_id, episode):
        pass

    def search_anime(query):
        pass

    def get_recommendations(anime_id):
        pass
```

implementation
```
tracker/
   base_adapter.py
   anilist_adapter.py
   mal_adapter.py (future)
```

the app only calls
```
tracker.get_user_list()
tracker.update_progress()
```
it never calls the anilist API directly outside the adapter
this guarantees easy MAL support later.

# Database Design
the DB doesn't replace the anilist, it only stores the extra data the app needs.

### User
```
User
---------
id
username
tracker_type
tracker_user_id
access_token
created_at
```

### Anime cache
Cache metadata to avoid repeated API calls.
```
Anime
---------
id
tracker_id
tracker_type
title
episodes
cover_image
genres
slug
```

### UserAnime
User progress snapshot.

```
UserAnime  
---------  
id  
user_id  
anime_id  
watched_episodes  
status  
score  
updated_at
```

This is synced with AniList.

### Streaming Source

```
StreamingSource  
---------------  
id  
name  
base_url  
episode_pattern  
priority  
active
```

Example:

```
HiAnime  
Aniwave  
GogoAnime
```

### AnimeStreamingMapping

Maps anime → streaming slug.

```
AnimeStreamingMapping  
---------------------  
anime_id  
source_id  
slug
```

Example:

```
Attack on Titan  
source: HiAnime  
slug: attack-on-titan-112
```

# Resume watching system
core logic

```
next_episode = watched + 1
```

process
```
User clicks Resume
        ↓
Find anime
        ↓
Get streaming slug
        ↓
Select active source
        ↓
Generate episode URL
        ↓
Open player
```

example generated URL
```
site/watch/{slug}?ep={episode}
```

# streaming router
if streaming sites go down (like hi-anime is gone)
the router handles
```
source_priority = [
    hianime,
    aniwave,
    gogoanime
]
```
algorithm
```
for source in sources:
    if source_online():
        return episode_url
```
test the availability by
```
HEAD request
```
or fallback on failure

# the anime limit system 
user rule
```
max_current_watcging = 5
```
logic
```python
if watching_count > limit:
	warn user
```
optional override

# productivity engine
stats to compute
```
completion_rate
episodes_watched_week
anime_started
anime_completed
current_watching
longest_unfinished
```
example dashboard
```
Started: 42
Completed: 21
Completion Rate: 50%

Watching: 6
Limit: 5 ⚠️
```

# weekly release tracker

using anilist weekly release schedule
display
```
Monday
Frieren ep 22

Thursday
Jujutsu Kaisen ep 18
```
can be marked watched quickly

# recommendation engine

Options:
1. Use AniList recommendations
2. Genre-based filtering
3. Score-based similarity

maybe later
```
collaborative filtering
```

# login system

first version
```
Login with AniList
```
 flow
```
OAuth redirect
↓
Receive token
↓
Store token
↓
Fetch anime list
```

later 
```
Login with MAL
```
uses same architecture.

# frontend pages
minimal UI structure

### Dashboard

```
Continue Watching  
------------------  
Vinland Saga → Ep 8  
Frieren → Ep 11
```



### Watching List

```
Currently Watching  
------------------  
Attack on Titan 7/25  
Jujutsu Kaisen 4/24
```



### Plan to Watch

```
Steins;Gate  
Monster
```

### Productivity

```
Charts:

completion rate  
episodes/week
```


### Releases

```
Today's Episodes
```


### Recommendations

```
Because you liked...
```

# Tech Stack

Backend:

```
Django  
PostgreSQL  
Redis (optional cache)
```

Frontend:

```
Django templates  
HTMX or Alpine.js
```

External APIs:

```
AniList GraphQL
```

Later:

```
MAL REST API
```

# Future Plans

```
browser extension auto tracking
discord rich presence
mobile PWA
auto MAL sync
community watchlists
```

# MVP Scope (Very Important)

the **first working version** should only include:
1. AniList login
2. Sync anime list
3. Resume watching
4. Streaming router
5. Episode progress update
6. Watching limit system
7. Basic productivity stats

----

# 1. Goal of the Streaming Match Engine

Input:

```
AniList anime
```

Output:

```
Best streaming page slug
```

Example:

```
Input:
Attack on Titan (AniList ID)

Output:
source: HiAnime
slug: attack-on-titan-112
confidence: 0.92
```

The system should:

1. search streaming site
2. score results
3. pick best match
4. store mapping

After first match → **cached forever**.

---

# 2. Module Structure

Create a separate module.

```
streaming/
    router.py
    matcher.py
    metadata.py
    source_adapters/
        base_source.py
        hianime_source.py
        gogoanime_source.py
```

Responsibilities:

```
router → choose streaming site
matcher → find best anime match
metadata → extract AniList info
source_adapters → talk to streaming sites
```

---

# 3. Metadata Extraction (AniList)

it need normalized metadata first.

Example object:

```python
class AnimeMetadata:
    title_english: str
    title_romaji: str
    year: int
    season: str
    episode_count: int
    studio: str
```

Example fetched from **AniList**.

Use:

```
title.english
title.romaji
seasonYear
episodes
studios
```

---

# 4. Streaming Site Search

Each streaming site adapter implements:

```python
class StreamingSource:

    def search(self, query):
        pass
```

Example return:

```
[
  {
    "title": "Attack on Titan",
    "year": 2013,
    "episodes": 25,
    "url": ".../attack-on-titan-112"
  },
  {
    "title": "Attack on Titan Final Season",
    "year": 2020,
    "episodes": 16,
    "url": ".../attack-on-titan-final"
  }
]
```

---

# 5. Matching Algorithm

Each candidate gets a **score**.

Final score = weighted sum.

```
score =
    title_similarity * 0.5
  + episode_match * 0.2
  + year_match * 0.2
  + studio_match * 0.1
```

Weights can be adjusted later.

---

# 6. Title Similarity

Use fuzzy matching.

Example library:

```
rapidfuzz
```

Example:

```python
score = fuzz.token_sort_ratio(anilist_title, streaming_title)
```

Range:

```
0 – 100
```

Normalize to:

```
0 – 1
```

---

# 7. Episode Match

Logic:

```
difference = abs(anime_episodes - result_episodes)
```

Scoring:

```
0 difference → 1.0
≤3 difference → 0.8
≤10 difference → 0.5
else → 0
```

Why?

Some sites include **OVA episodes**.

---

# 8. Year Match

```
difference = abs(anime_year - result_year)
```

Score:

```
0 difference → 1.0
1 year → 0.8
2 years → 0.5
else → 0
```

---

# 9. Studio Match (Optional)

Many sites don’t include studio.

If available:

```
exact match → 1
else → 0
```

If unavailable:

```
ignore factor
```

---

# 10. Final Candidate Selection

Example results:

```
Candidate A
score = 0.91

Candidate B
score = 0.64

Candidate C
score = 0.45
```

Pick:

```
max(score)
```

If:

```
score > 0.75
```

accept.

Else:

```
mark as uncertain
```

---

# 11. Mapping Storage

Database table:

```
AnimeStreamingMapping
---------------------
anime_id
source_id
slug
confidence_score
verified
```

Example:

```
AOT | hianime | attack-on-titan-112 | 0.92 | true
```

This avoids running the matcher again.

---

# 12. Resume Watching Flow

```
User clicks Resume
        ↓
Check mapping exists
        ↓
YES → generate episode URL
NO  → run Streaming Match Engine
        ↓
store mapping
        ↓
open episode
```

---

# 13. URL Generation

Once slug exists:

```
episode_url = base_url + slug + "?ep=" + next_episode
```

Example:

```
hianime/watch/attack-on-titan-112?ep=8
```

---

# 14. Multi-Source Support

Router logic:

```
for source in priority_list:
    if mapping exists:
        return episode_url
    else:
        run matcher
```

---

# 15. Failure Handling

If matching fails:

```
confidence < threshold
```

Fallback:

```
open search results page
```

Example:

```
site/search?q=attack+on+titan
```

User selects manually → mapping saved.

---

# 16. Performance Strategy

Cache results:

```
AnimeStreamingMapping
```

Only match **once per anime per source**.

---

# 17. Future Improvements

Possible upgrades:

```
ML similarity model
episode title comparison
community verified mappings
crowdsourced corrections
```

But **not needed initially**.

---

# 18. Implementation Order

Build order:

1. AniList metadata fetch
2. Streaming site search adapter
3. Fuzzy title matching
4. Episode/year scoring
5. Mapping database
6. Resume watching integration
    

---


```
login
↓
click resume
↓
anime opens instantly
↓
tracker auto updates
```

---


# 1. System Overview

High-level architecture:

```
Frontend
   │
Backend (Django)
   │
Service Layer
   │
 ├── Tracker Service
 ├── Streaming Service
 ├── Match Engine
 ├── Productivity Service
 └── Recommendation Service
   │
Database
   │
External APIs
   └── AniList (initial)
```

Important rule:

**Services talk to each other — not directly to external APIs.**

---

# 2. Database Schema (Core)

Your DB stores **three types of data**:

1. Users
    
2. Anime metadata cache
    
3. Streaming mappings
    

---

# 3. User Table

Stores authentication and tracker info.

```
User
--------------------------------
id (PK)
username
email
tracker_type
tracker_user_id
access_token
refresh_token
created_at
updated_at
```

Example:

```
id: 1
tracker_type: anilist
tracker_user_id: 543210
```

Later you can add:

```
tracker_type: mal
```

---

# 4. Anime Table (Metadata Cache)

You should cache anime metadata from **AniList** so you don't call the API constantly.

```
Anime
--------------------------------
id (PK)
tracker_id
tracker_type
title_english
title_romaji
title_native
episode_count
release_year
season
studio
cover_image
created_at
updated_at
```

Example:

```
tracker_id: 16498
tracker_type: anilist
title_english: Attack on Titan
episode_count: 25
release_year: 2013
```

---

# 5. UserAnime Table

Stores the user's progress snapshot.

```
UserAnime
--------------------------------
id (PK)
user_id (FK)
anime_id (FK)
watched_episodes
status
score
started_at
completed_at
updated_at
```

Status examples:

```
watching
completed
planned
dropped
paused
```

Important:

This is **synced with AniList**, not the source of truth.

---

# 6. StreamingSource Table

Stores all streaming platforms.

```
StreamingSource
--------------------------------
id (PK)
name
base_url
search_url
episode_pattern
priority
is_active
created_at
```

Example:

```
name: hianime
base_url: https://hianime.to
episode_pattern: /watch/{slug}?ep={episode}
priority: 1
```

---

# 7. AnimeStreamingMapping Table

This is the **result of the match engine**.

```
AnimeStreamingMapping
--------------------------------
id (PK)
anime_id (FK)
source_id (FK)
slug
confidence_score
verified
created_at
updated_at
```

Example:

```
anime_id: 15
source_id: 1
slug: attack-on-titan-112
confidence_score: 0.91
verified: true
```

This prevents running the matcher again.

---

# 8. UserSettings Table

For productivity features and limits.

```
UserSettings
--------------------------------
id (PK)
user_id (FK)
max_watching_limit
auto_update_tracker
preferred_source
created_at
```

Example:

```
max_watching_limit: 5
```

---

# 9. AnimeStats Table (Optional Cache)

For productivity analytics.

```
AnimeStats
--------------------------------
id (PK)
user_id
episodes_watched_total
episodes_watched_week
anime_started
anime_completed
completion_rate
last_updated
```

This can also be computed dynamically if you prefer.

---

# 10. Service Layer (Critical Design)

You should structure backend logic like this:

```
services/
    auth_service.py
    tracker_service.py
    anime_service.py
    streaming_service.py
    match_service.py
    productivity_service.py
    recommendation_service.py
```

Each service has **clear responsibility**.

---

# 11. Tracker Service

Handles communication with **AniList**.

Responsibilities:

```
login
fetch_user_list
update_episode_progress
fetch_anime_metadata
fetch_recommendations
```

Later you plug in:

```
MalTrackerAdapter
```

for **MyAnimeList**.

---

# 12. Anime Service

Handles anime metadata.

Responsibilities:

```
get_or_create_anime
update_anime_cache
fetch_from_tracker_if_missing
```

Prevents duplicate API calls.

---

# 13. Match Service

Implements the **matching algorithm** we discussed.

Responsibilities:

```
search_streaming_sites
score_candidates
select_best_match
store_mapping
```

Uses:

```
title similarity
episode count
release year
studio
```

---

# 14. Streaming Service

Handles launching episodes.

Responsibilities:

```
resume_watching
generate_episode_url
select_best_source
check_source_availability
```

Flow:

```
user clicks resume
↓
get watched episodes
↓
calculate next episode
↓
get slug mapping
↓
generate streaming URL
```

---

# 15. Productivity Service

Calculates stats.

Responsibilities:

```
calculate_completion_rate
count_current_watching
episodes_watched_week
detect_limit_exceeded
```

---

# 16. Recommendation Service

Initially simple.

Sources:

```
AniList recommendations
genre similarity
user scores
```

Later you could implement:

```
collaborative filtering
```

---

# 17. API Endpoints (Backend)

Example REST endpoints:

```
GET  /api/dashboard
GET  /api/anime/watching
POST /api/anime/update-progress
GET  /api/anime/resume/{anime_id}
GET  /api/recommendations
GET  /api/releases/today
```

---

# 18. Resume Watching Full Flow

```
User clicks Resume
        ↓
Streaming Service
        ↓
UserAnime → get watched episodes
        ↓
next_episode = watched + 1
        ↓
check AnimeStreamingMapping
        ↓
if mapping missing
     run Match Service
        ↓
generate episode URL
        ↓
redirect user
```

---

# 19. Performance Strategy

Cache aggressively:

```
anime metadata
streaming mappings
user stats
```

Avoid unnecessary calls to **AniList**.

---

# 20. MVP Implementation Order

Do NOT build everything at once.

Phase 1:

```
AniList login
fetch user anime list
store anime metadata
```

Phase 2:

```
resume watching
streaming router
match engine
```

Phase 3:

```
productivity stats
anime limit system
```

Phase 4:

```
recommendations
release tracker
```

Phase 5:

```
add MAL support
```


---

---

# 2. Django Project Layout

Your project should separate **apps (features)** from **services (logic)**.

Structure:

```
aniflow/
│
├── manage.py
│
├── config/              # Django project settings
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   ├── asgi.py
│   └── wsgi.py
│
├── apps/
│   │
│   ├── users/
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   ├── admin.py
│   │   └── serializers.py
│   │
│   ├── anime/
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   ├── services.py
│   │   └── admin.py
│   │
│   ├── streaming/
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── router.py
│   │   ├── matcher.py
│   │   └── sources/
│   │       ├── base_source.py
│   │       ├── hianime.py
│   │       └── gogoanime.py
│   │
│   ├── tracker/
│   │   ├── adapters/
│   │   │   ├── base_adapter.py
│   │   │   ├── anilist_adapter.py
│   │   │   └── mal_adapter.py
│   │   │
│   │   ├── services.py
│   │   └── views.py
│   │
│   ├── productivity/
│   │   ├── services.py
│   │   ├── views.py
│   │   └── models.py
│   │
│   └── recommendations/
│       ├── services.py
│       └── views.py
│
├── services/             # global reusable services
│   ├── cache_service.py
│   ├── http_client.py
│   └── utils.py
│
├── templates/
│
├── static/
│
└── requirements.txt
```

---

# 3. Core Django Apps

### users

Handles:

- login
    
- tracker OAuth
    
- user settings
    

Models:

```
User
UserSettings
```

---

### anime

Handles:

- anime metadata
    
- user progress
    

Models:

```
Anime
UserAnime
```

---

### tracker

Handles communication with trackers.

Adapters:

```
base_adapter
anilist_adapter
mal_adapter (future)
```

Responsibilities:

```
fetch_user_list
update_progress
fetch_anime_metadata
```

---

### streaming

Handles:

- streaming sources
    
- slug matching
    
- resume watching
    

Files:

```
router.py
matcher.py
sources/
```

Models:

```
StreamingSource
AnimeStreamingMapping
```

---

### productivity

Handles:

```
completion rate
watching limit
episodes per week
```

---

### recommendations

Handles:

```
genre recommendations
tracker recommendations
```

---

# 4. Streaming Sources Plugin System

This makes adding new sites easy.

```
sources/
    base_source.py
    hianime.py
    gogoanime.py
```

Example base interface:

```python
class StreamingSource:

    def search(self, title):
        pass

    def build_episode_url(self, slug, episode):
        pass
```

Every site just implements this.

So adding a new site later is literally:

```
create new file
implement interface
register source
```

---

# 5. Match Engine Location

```
apps/streaming/matcher.py
```

Responsibilities:

```
title fuzzy matching
episode comparison
year comparison
score calculation
```

---

# 6. Resume Watching Logic

Location:

```
apps/streaming/router.py
```

Flow:

```
get anime
get watched episodes
next_episode = watched + 1
check slug mapping
if missing → run matcher
generate episode URL
redirect user
```

---

# 7. Service Pattern

Inside each app:

```
services.py
```

Example:

```
anime/services.py
tracker/services.py
productivity/services.py
```

Views should **call services**, not contain logic.

---

# 8. Database Models (Core)

You will implement these models first:

```
User
UserSettings
Anime
UserAnime
StreamingSource
AnimeStreamingMapping
```

Everything else builds on top.

---

# 9. Development Phases

### Phase 1

```
AniList OAuth
fetch user anime list
store Anime + UserAnime
```

---

### Phase 2

```
streaming sources
match engine
resume watching
```

---

### Phase 3

```
productivity stats
watch limit
dashboard
```

---

### Phase 4

```
recommendations
weekly releases
```

---

### Phase 5

```
MAL adapter
multi-tracker support
```

---

# 1. Custom User Model

You should **extend Django's AbstractUser** so you can add tracker fields.

`apps/users/models.py`

```python
from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):

    TRACKER_CHOICES = [
        ("anilist", "AniList"),
        ("mal", "MyAnimeList"),
    ]

    tracker_type = models.CharField(
        max_length=20,
        choices=TRACKER_CHOICES,
        default="anilist"
    )

    tracker_user_id = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

    access_token = models.TextField(
        blank=True,
        null=True
    )

    refresh_token = models.TextField(
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

Important setting:

```python
AUTH_USER_MODEL = "users.User"
```

---

# 2. UserSettings Model

Stores personal configuration like **watching limits**.

```python
class UserSettings(models.Model):

    user = models.OneToOneField(
        "users.User",
        on_delete=models.CASCADE,
        related_name="settings"
    )

    max_watching_limit = models.PositiveIntegerField(
        default=5
    )

    auto_update_tracker = models.BooleanField(
        default=True
    )

    preferred_source = models.ForeignKey(
        "streaming.StreamingSource",
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)
```

Relationship:

```
User 1 ─── 1 UserSettings
```

---

# 3. Anime Model

Stores cached metadata from **AniList**.

`apps/anime/models.py`

```python
class Anime(models.Model):

    TRACKER_CHOICES = [
        ("anilist", "AniList"),
        ("mal", "MyAnimeList"),
    ]

    tracker_id = models.CharField(
        max_length=100
    )

    tracker_type = models.CharField(
        max_length=20,
        choices=TRACKER_CHOICES
    )

    title_english = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    title_romaji = models.CharField(
        max_length=255
    )

    title_native = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    episode_count = models.PositiveIntegerField(
        blank=True,
        null=True
    )

    release_year = models.PositiveIntegerField(
        blank=True,
        null=True
    )

    season = models.CharField(
        max_length=50,
        blank=True,
        null=True
    )

    studio = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    cover_image = models.URLField(
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

Important rule:

```
tracker_id + tracker_type must be unique
```

Add this:

```python
class Meta:
    unique_together = ("tracker_id", "tracker_type")
```

---

# 4. UserAnime Model

Stores **user progress**.

```python
class UserAnime(models.Model):

    STATUS_CHOICES = [
        ("watching", "Watching"),
        ("completed", "Completed"),
        ("planned", "Plan To Watch"),
        ("dropped", "Dropped"),
        ("paused", "Paused"),
    ]

    user = models.ForeignKey(
        "users.User",
        on_delete=models.CASCADE,
        related_name="anime_list"
    )

    anime = models.ForeignKey(
        "anime.Anime",
        on_delete=models.CASCADE,
        related_name="user_entries"
    )

    watched_episodes = models.PositiveIntegerField(
        default=0
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="planned"
    )

    score = models.PositiveIntegerField(
        blank=True,
        null=True
    )

    started_at = models.DateField(
        blank=True,
        null=True
    )

    completed_at = models.DateField(
        blank=True,
        null=True
    )

    updated_at = models.DateTimeField(auto_now=True)
```

Relationship:

```
User ─── many UserAnime
Anime ─── many UserAnime
```

---

# 5. StreamingSource Model

`apps/streaming/models.py`

Stores streaming platforms.

```python
class StreamingSource(models.Model):

    name = models.CharField(
        max_length=100,
        unique=True
    )

    base_url = models.URLField()

    search_url = models.URLField()

    episode_pattern = models.CharField(
        max_length=255
    )

    priority = models.IntegerField(
        default=1
    )

    is_active = models.BooleanField(
        default=True
    )

    created_at = models.DateTimeField(auto_now_add=True)
```

Example record:

```
name: hianime
base_url: https://hianime.to
search_url: https://hianime.to/search?q=
episode_pattern: /watch/{slug}?ep={episode}
```

---

# 6. AnimeStreamingMapping Model

Stores result of the **match engine**.

```python
class AnimeStreamingMapping(models.Model):

    anime = models.ForeignKey(
        "anime.Anime",
        on_delete=models.CASCADE,
        related_name="streaming_mappings"
    )

    source = models.ForeignKey(
        "streaming.StreamingSource",
        on_delete=models.CASCADE,
        related_name="anime_mappings"
    )

    slug = models.CharField(
        max_length=255
    )

    confidence_score = models.FloatField(
        default=0
    )

    verified = models.BooleanField(
        default=False
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

Constraint:

```python
class Meta:
    unique_together = ("anime", "source")
```

Meaning:

```
1 anime → 1 slug per streaming source
```

---

# Final Database Relationships

```
User
 │
 ├── UserSettings (1:1)
 │
 └── UserAnime (1:N)
          │
          ▼
        Anime
          │
          └── AnimeStreamingMapping (1:N)
                         │
                         ▼
                  StreamingSource
```

---

# First Migration Plan

Your **first commit** should include:

```
users app
anime app
streaming app
```

Then run:

```
python manage.py makemigrations
python manage.py migrate
```

After that your **database foundation is complete**.

---

