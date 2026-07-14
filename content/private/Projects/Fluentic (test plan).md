---
title: code base on boarder
date: 2026-06-30
tags:
  - project
  - taskgen
  - fluentic
publish: "false"
type: note
status: draft
---
# Voice English Practice App

## The Problem

I want to improve my English speaking. Paid voice models (ElevenLabs etc.) are too expensive for me (Ethiopia, broke solo dev). Tried running local models before — PC is low-end, froze, caused issues, had to abandon it.

## The Idea

A simple loop: talk → AI transcribes → AI responds + gently corrects phrasing → AI speaks the response back → repeat. Cheap/free stack instead of expensive APIs or local models.

Possible stack: Whisper / Faster-Whisper (STT) → Groq free tier (LLM) → Chatterbox or similar (TTS).

Already exists in the wild as proof this works: **Discute** (open source, Whisper + Groq + Kokoro) — worth trying before building further.

## MVP Plan (weekend build)

- One screen, one mic button.
- Single scenario: **mock job interview** (not generic "practice English" — too vague/vitamin-like).
- LLM acts as interviewer: asks real interview questions, reacts to answers, flags 1-2 phrasing fixes per turn (not a grammar essay).
- Voice reply spoken back via TTS.
- No accounts, no scoring dashboard, no multiple scenarios, no payments, no native app — just the loop, on a basic webpage.

## Test Plan

- Build it, deploy as a simple shareable link.
- Send to friends in 2-3 days.
- Ask specifically about the interview-anxiety angle (people who've struggled in English during real interviews/meetings).

### Questions to ask friends

1. Did you keep talking past the first exchange, or stop after one try?
2. Was there a moment it felt broken/confusing? What exactly happened?
3. Did the phrasing corrections feel helpful or annoying? More or less of it?
4. Did the voice reply feel natural enough to keep talking to?
5. Have you struggled in English in a real interview/call/meeting? Would this have helped _that specific moment_?
6. Would you pay for this the week before something important (interview, visa appointment)? Roughly how much?
7. Who's the first person you'd send this to, and why them?

**Note to self:** weight Q1 and Q7 (actual behavior) higher than general enthusiasm — friends are nice by default.

## Monetization Angle (future, not now)

- Don't price for the local market as primary revenue — most won't pay recurring subscriptions (including me).
- Pattern: build/validate locally (cheap users, honest feedback) → price for markets with urgency/ability to pay: diaspora parents, IELTS/TOEFL/visa-interview prep, BPO/call-center job seekers.
- Sell the specific fear, not "improve your English" — e.g. "pass your visa interview," "ace your IELTS speaking band," "stop freezing on English calls at work."
- Go talk to real people (IELTS-prep groups, friends who failed interviews over English) about what they currently pay for and how — don't guess at pricing.

## Future Plans (post-MVP, only if loop validates)

- More scenarios (visa interview, casual conversation, workplace meeting).
- Light progress tracking / feedback summary.
- Better correction UX (maybe optional depth: light touch vs detailed).
- Possibly mobile-friendly PWA.
- Revisit naming/branding once it's more than a test demo.

## Candidate Names (not important yet)

SpeakLoop, TalkBack, MockMic, InterviewTongue, SpeakBack, Fluentic, MouthPiece.

## Key Personal Lesson (carried over from the codebase-onboarder idea)

Build things I'd actually use and pay for myself first. If I wouldn't use/pay for it, that's a signal, not a detail to brush past.

---

## Tasks

- [ ] **fluentic** — try Discute first (Whisper + Groq + Kokoro) to validate the loop exists
- [ ] **fluentic** — build one-screen MVP: mic button + mock interview scenario (not generic practice)
- [ ] **fluentic** — make LLM act as interviewer + flag 1-2 phrasing fixes per turn + TTS voice reply
- [ ] **fluentic** — deploy as shareable link (no accounts, no dashboard)
- [ ] **fluentic** — send to friends in 2-3 days, ask specific questions (Q1-Q7)
- [ ] **fluentic** — analyze feedback, weight actual behavior (Q1, Q7) over general enthusiasm



------
## features that i came up with

- the ai just listens to your rant and then she will retell you how to say that and you will say it back and she will correct you again and you will try again and  the loops goes on
- talk with tongue twisters somehow like she talks to you in a way that it involves tongue twisters or she asks you a question and the answer is on the screen then you have to read it as fast and normal as possible