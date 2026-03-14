---
title: anime tracker/launcher/companion
tags:
  - project
  - anime
date: 2026-03-14
type: plan
status: draft
source:
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
