---
tags:
  - project
  - telegram
  - bot
  - spotify
type: note
status: implementation
date: 2026-07-06
---
---

# Now Playing Bot  Implementation Plan 

## Approach

Skip building/hosting Spotify OAuth myself. Reuse the already-authorized `kittinan/spotify-github-profile` hosted service (`spotify-github-profile.kittinanx.com`) as the data source, since it runs under his registered (grandfathered) Spotify app — my Free account doesn't need its own Client ID this way.

Data flow:

```
Spotify (my account, authorized once via kittinanx.com/api/login)
  → kittinanx.com/api/view?uid=MY_UID (returns SVG)
    → my Vercel function fetches + parses that SVG
      → Telegram Bot API: editMessageMedia on one pinned message
```

## One-Time Setup

- [ ] Go to `https://spotify-github-profile.kittinanx.com/api/login`, connect my Spotify account, grab my `uid`.
- [ ] Confirm the working image URL: `https://spotify-github-profile.kittinanx.com/api/view?uid=MY_UID&cover_image=true&theme=default`
- [ ] Create Telegram bot via @BotFather, get bot token.
- [ ] Add bot as **admin** to my channel (needs: post messages, pin messages permissions).
- [ ] Post one initial placeholder message to the channel manually (via bot), pin it, note the `message_id` + `chat_id`.

## Investigation Step — DONE, results confirmed via curl

Tested both `theme=default` and `theme=spotify-embed` against the live endpoint.

**Confirmed working (both themes):**

- Song name and artist are plain, parseable HTML text — no OCR/extra API calls needed.
    - `default` theme: `<div class="artist">Maroon 5</div>`, `<div class="song">Moves Like Jagger...</div>`
    - `spotify-embed` theme: `<div class="track-name">A Sky Full of Stars</div>`, `<div class="artist-name">Coldplay</div>`, plus a bonus `<span class="status-text">Now playing</span>` and a progress bar (elapsed/remaining time, % width).
- Album art is inlined directly as base64 (`data:image/jpeg;base64,...` or `data:image/png;base64,...`) inside an `<img>` tag — decode it directly to bytes, no second fetch needed.

**Confirmed NOT working — dropped:**

- Clickable track link. In `default` theme, the `<a href="{}">` is a literal unfilled template placeholder (bug on kittinan's end). In `spotify-embed` theme, there's no `<a>` wrapper at all — just a bare `<img>`. Neither theme exposes a usable Spotify track URL. Not pursuing this further — no clickable link in the shipped version.

**Still unconfirmed:** the "offline / last played" markup. `show_offline=true` test still returned live "Now playing" data because music happened to be actively playing at test time — `show_offline` had nothing to override. Need to re-test while nothing is playing to see the actual fallback state (CSS already shows a `.not-play { color: #ff1616 }` class exists for this in the `default` theme — need to confirm exact wording/structure when it actually triggers).

**Decision: use `theme=spotify-embed`.** Reasons: explicit `status-text` field to key state detection off of (rather than inferring from CSS class names alone), and it's closer to the original "card" look wanted. `default` theme remains a simpler fallback if parsing spotify-embed proves fragile.

## Known Limitation (accepted)

No clickable track link in the final product — confirmed unavailable in both tested themes on kittinan's hosted service. Song name will render as plain bold text, not a hyperlink. Not attempting a Spotify-search-URL workaround either, to keep the caption honest (a search link isn't the same as the actual track and could point to the wrong result).

## Vercel Project Structure (TS)

```
/api
  poll.ts        <- cron-triggered function, does the fetch + parse + Telegram update
/lib
  svg-parser.ts  <- extracts song/artist/link (if present) from raw SVG text
  telegram.ts    <- wrapper around editMessageMedia call
vercel.json      <- cron schedule config
.env             <- TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, TELEGRAM_MESSAGE_ID, SPOTIFY_UID
```

## Core Logic (`/api/poll.ts`)

1. Fetch `https://spotify-github-profile.kittinanx.com/api/view?uid=...&theme=spotify-embed` as raw text (not image).
2. Parse out via regex/string extraction:
    - `<div class="track-name">...</div>` → song name
    - `<div class="artist-name">...</div>` → artist
    - `<span class="status-text">...</span>` → "Now playing" vs whatever the offline label turns out to be (still need to confirm exact wording — see Investigation Step notes)
    - base64 payload inside the `<img src="data:image/...;base64,...">` → decode to raw image bytes for the Telegram photo
3. Build Telegram caption (plain text, no link):
    - Header: "🎵 Now Playing" or "Last Played" depending on parsed state
    - Song name (bold, plain text — no hyperlink, confirmed unavailable)
    - Artist name
4. Call Telegram `editMessageMedia`:
    - `media.type = "photo"`
    - `media.media` = upload the decoded base64 image bytes (Telegram supports multipart upload for new media, not just URLs — needed here since there's no hosted image URL, only inline base64)
    - `media.caption` = built caption above, `parse_mode: "Markdown"`
5. Handle errors gracefully (e.g., kittinanx.com temporarily down, malformed SVG, base64 decode failure) — log and skip this cycle rather than crash.

## Scheduling

- Use **Vercel Cron Jobs** (`vercel.json` → `crons` field) set to run `/api/poll` every 2 minutes.
- Note: confirm current Vercel free-tier cron minimum interval allowed before relying on this — check Vercel's docs since limits have changed before.

## Risks / Dependencies to Keep in Mind

- **Third-party dependency risk:** entire pipeline depends on `kittinanx.com` staying up and his app staying within Spotify's grandfathered Development Mode rules. No control over this. If it breaks, bot silently stops updating — worth adding basic alerting (e.g., log to console / a Telegram DM to myself on fetch failure) rather than failing silently.
- **SVG structure could change** if kittinan updates his themes/templates — parsing logic may need occasional adjustment.
- **No guaranteed direct track link** unless the SVG happens to expose one — accepted tradeoff for now.

## Build Order

1. [x] Investigation step — confirmed field names, confirmed no clickable link available, decided on `spotify-embed` theme.
2. [ ] One more quick check: curl the endpoint while NOT playing anything, to confirm exact offline/last-played markup and status-text wording.
3. [ ] Telegram bot setup + one pinned message.
4. [ ] `lib/svg-parser.ts` — pull song/artist/status-text/base64 image out of raw SVG text (field names confirmed above).
5. [ ] `lib/telegram.ts` — `editMessageMedia` wrapper (multipart upload, since media is base64 bytes not a URL).
6. [ ] `api/poll.ts` — glue it together.
7. [ ] `vercel.json` cron config, deploy, confirm the pinned message updates every 2 min.
8. [ ] Tweak caption formatting based on real output.

## Done Criteria

Pinned message in channel updates every ~2 minutes with current (or last-played) track, album art, artist name, song name — no new messages posted, no clutter, no manual intervention needed after deploy.