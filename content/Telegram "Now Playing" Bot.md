---
title: Telegram "Now Playing" Bot
date:
  "{ date:YYYY-MM-DD }":
tags:
  - project
  - telegram
  - spotify
  - bot
publish: "false"
type: note
status: draft
---

# Telegram "Now Playing" Bot

## Idea
Bring a Discord-style "now playing" status to a Telegram channel, similar to the embedded now-playing widget already built for my [README](https://github.com/J0na555/J0na555). Single-user (my own Spotify account)  not building this for public use.

## Why not Discord-style presence directly

Telegram has no per-user presence system like Discord Rich Presence. No client-level status broadcast exists. Closest achievable equivalent: **a single pinned message in the channel that gets edited on a timer.**

## Core Architecture

- One bot, one channel, one Spotify account (mine).
- Bot is admin in the channel (needs post + pin permissions).
- One message posted once, pinned once, then **edited forever** , never reposted, never deleted. No clutter.

## Update Loop

1. Poll Spotify `currently-playing` endpoint every **2 minutes**.
2. If something is playing → show it.
3. If nothing is playing → fall back to `recently-played`, label it "Last Played" (no placeholder/tape image — just show the last track's real art).

## Message Content

- **Photo:** album art (from `item.album.images` in API response)
- **Caption:**
    - Header: "🎵 Now Playing" or "Last Played" depending on state
    - Song name — Markdown link `[Song Name](spotify_url)`, using `item.external_urls.spotify`
    - Artist name(s) — `item.artists[].name`
    - Small footer line: "via [BotName]"

## Key Technical Decisions

- **Use `editMessageMedia`**, not `editMessageText`/`editMessageCaption`,  needed cause the photo itself changes track-to-track, not just the caption.
- **Don't rely on Telegram's auto link-preview scraping.** Rejected because:
    - Preview data is cached per-URL by Telegram, can go stale on repeat plays.
    - Edited messages don't reliably regenerate previews.
    - We already have the real album art URL straight from Spotify, so no reason to depend on a scraper.
- Pinning is tied to a specific `message_id`. Deleting a message removes its pin,  so never delete/repost. Just edit the one message in place.

## Auth (Single-User Version)

- Register app on Spotify Developer Dashboard → get `client_id` + `client_secret`.
- Run OAuth **Authorization Code flow once**, manually, in browser.
    - Scopes needed: `user-read-currently-playing`, `user-read-playback-state`, `user-read-recently-played`
- Store the resulting **refresh token** securely (env var / local config — never commit to a public repo).
- Bot silently refreshes the **access token** (expires ~1 hour) using the refresh token — fully automatic, no re-login ever needed.

## Explicitly Descoped (for now)

- ❌ Public multi-user version (would need: web server for per-user OAuth redirect, database mapping `telegram_user_id → refresh_token → channel_id → message_id`, and Spotify's 25-user Development Mode cap / Extended Quota review).
- ❌ Discussion group / forwarding workflow — unnecessary once `editMessageMedia` on one pinned message was understood.
- ❌ Placeholder "no music" cover image.

## Build Checklist

- [ ]  Register Spotify app, get client id/secret
- [ ]  Run one-time OAuth flow, capture refresh token
- [ ]  Set up bot in Telegram, make admin in channel
- [ ]  Post + pin initial message
- [ ]  Write poller (2 min interval): currently-playing → fallback recently-played
- [ ]  Format caption (Markdown link + artist)
- [ ]  Call `editMessageMedia` with new photo + caption each cycle
- [ ]  Handle access token refresh automatically

## Next Step

Write the actual bot code (Python or Node) — including token refresh handling and the `editMessageMedia` call.
