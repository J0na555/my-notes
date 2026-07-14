---
title: fluentic
tags:
  - project
  - fluentic
  - prd
type: PRD
---
# Fluentic — PRD

> [!note] What this is Fluentic is a voice-first English speaking practice app. You talk, it listens, it responds like a real conversation partner, and it corrects your phrasing without turning into a grammar lecture. The core loop was already validated with a browser demo — this PRD scopes the first real version (v1), built as a React Native app + companion website.

## 1. Problem

People (starting with me) want to get better at _speaking_ English, not reading about grammar rules. Existing options are either:

- Expensive (ElevenLabs-grade voice APIs, paid tutors)
- Passive (apps that quiz vocab/grammar but never make you actually talk)
- Awkward (practicing with a real person means embarrassment risk)

Fluentic closes that gap with a cheap/free stack and a voice loop that feels like talking to a person, not a form.

## 2. Validated so far (demo learnings)

Demo used: single mock-interview scenario, one-screen web MVP, Web Speech API (STT) + browser SpeechSynthesis (TTS) + Groq LLM.

Feedback from first real tester:

> [!quote] What worked
> 
> - Kept talking past the first exchange because responses felt accurate and the conversation was enjoyable.
> - TTS voice felt natural enough to want to respond to — "it actually amazed me."
> - Corrections were seen as helpful — wants _more_, not fewer.
> - Casual scenarios preferred over interview scenario ("she was giving me real advice").
> - Would pay for it the week before something important (interview/visa), if reliable.
> - Natural first distribution instinct: peer-to-peer ("I'd send it to my younger brother").

> [!bug] What broke
> 
> - **Barge-in bug**: tapping the mic while the AI was still talking recorded _her_ voice instead of the user's. This is a core-loop bug, not a polish issue.
> - **STT mishearing**: some corrections were "wrong" only because the recognizer misheard the user, not because the correction logic was bad. Root cause: Web Speech API is unreliable, not the correction model.

These two findings directly shaped the v1 decisions below.

## 3. Goals for v1

- Ship as a real product: React Native mobile app + marketing/waitlist website (not just a demo link).
- Fix the barge-in bug — this is the #1 technical priority, above any new feature.
- Replace Web Speech API with a proper STT pipeline (see Architecture).
- Support multiple modes, not just mock interview (see Features).
- Keep infra cost at $0 or near-$0 for as long as free tiers allow.

## 4. Non-goals for v1

- No accounts/auth, no payments, no progress-tracking dashboard.
- No multi-language support (English only).
- No real-time word-by-word streaming transcription — turn-based is fine.
- No custom voice cloning.
- No Android/iOS-only native features that block a fast RN build (keep it boring where possible).

## 5. Personas

- **Primary**: Non-native English speakers preparing for a specific high-stakes moment — job interview, visa interview, IELTS/TOEFL speaking section, work call. This is the "urgency" segment likely to pay later.
- **Secondary (early adopters / distribution engine)**: Casual learners who just want to practice speaking day-to-day and share the app peer-to-peer (e.g. the "I'd send this to my younger brother" tester).

## 6. Core Loop (all modes share this)

```
User taps mic → speaks → STT transcribes →
LLM responds in character + flags phrasing issues (0–2 per turn) →
TTS speaks response → user can barge in anytime → repeat
```

## 7. Modes / Features

### 7.1 MVP modes (build first)

|Mode|Description|Status|
|---|---|---|
|**Mock Interview**|AI plays interviewer, asks real questions, reacts to answers, flags 1–2 phrasing fixes per turn.|Already validated in demo|
|**Casual Conversation**|Cafe / travel / friends / shopping scenarios. Tester preferred this over interview — promote to equal or higher priority than interview mode.|New priority, validated by feedback|
|**Grammar Correction Mode**|Same conversational loop, but corrections are the point — more frequent, more explicit. Directly requested by tester ("a scenario for people who want to improve and correct their English grammar").|New, tester-requested|

### 7.2 v1.1 modes (build once core loop is solid)

|Mode|Description|
|---|---|
|**Retell Loop**|User rants/speaks freely. AI retells it back in better phrasing. User repeats it. AI corrects again. Loop continues until it's clean.|
|**Tongue Twister / Read-Aloud**|AI gives a tongue twister, or asks a question with the answer shown on screen, and the user has to read it aloud as fast and naturally as possible. Pronunciation/fluency drill, distinct from the conversational modes.|

### 7.3 Explicitly out of scope for now

Progress tracking, scoring, multi-scenario dashboards, payments — revisit only after the loop itself is validated at v1 scale.

## 8. Technical Architecture

### 8.1 Client

- **React Native** for the mobile app (iOS + Android from one codebase).
- Companion **website** for the waitlist/landing page (static, separate from the app itself — see branding plan).

### 8.2 Voice pipeline (the part that changes from the demo)

|Layer|Demo (broken)|v1 (fix)|Why|
|---|---|---|---|
|STT|Web Speech API (browser)|**Groq Whisper Large v3 Turbo** via API|Free tier: 2,000 requests/day, 7,200 audio-seconds/hour, no card. Dramatically more accurate than browser recognition — this fixes the "hears what it wants" bug directly. Not real-time streaming (buffers the full utterance), which is fine for a turn-based loop.|
|LLM|Groq free tier|**Groq free tier** (unchanged)|Already validated, keep it.|
|TTS|Browser SpeechSynthesis|**Edge TTS** (free, unlimited, no key) as default; evaluate **Google Cloud TTS** (1M chars/month free on Neural2/WaveNet voices) if voice selection is too limited|Tester already said the current voice level was "natural enough" / "amazed" — don't over-invest in premium voice APIs (ElevenLabs etc.) until there's evidence realism is the bottleneck, not just STT accuracy.|

> [!warning] Barge-in fix (do this before anything else) Mic state needs an explicit machine: `idle → listening → processing → speaking → idle`. While in `speaking`, mic tap should either (a) immediately stop TTS playback and transition to `listening`, or (b) be visually disabled until `speaking` ends. Pick one — don't build both. This was the #1 bug reported and blocks the core loop from feeling conversational.

### 8.3 Backend

- All STT/LLM/TTS calls happen server-side (not directly from client), so API keys aren't exposed in the RN app and so both mobile + web share one pipeline.
- Keep it a simple monolith — one backend service handling: receive audio → Whisper → LLM (with mode-specific system prompt) → TTS → return audio + correction metadata. No microservices needed at this scale.

### 8.4 State / data

- No accounts in v1 → no persistent user data beyond the current session.
- Conversation history kept in-memory / client-side for the duration of a session only.

## 9. Scaling considerations (for later, not today)

- Groq free tier limits (LLM + Whisper) are per-organization, not per-user — at real usage this becomes the first bottleneck, not the TTS side. Watch this before watching TTS costs.
- Edge TTS / Google TTS free tiers are generous enough that voice cost isn't the near-term constraint.
- If/when scaling past free tiers: Groq's paid tier is still cheap (Whisper Turbo ~$0.04/hour of audio) — cost isn't the risk, rate limits are.
- Revisit ElevenLabs (or similar) only if user feedback specifically flags voice realism as a drop-off reason — not proactively.

## 10. Open questions

- [ ] Retell Loop and Tongue Twister modes: build in v1 or hold for v1.1? (Not hard to build, but don't let them delay the barge-in fix and mode expansion.)
- [ ] Does Grammar Correction Mode need a different LLM system prompt only, or a different UI treatment too (e.g. showing corrections inline as text, not just spoken)?
- [ ] Website vs in-app-only: is the website purely a waitlist/marketing page, or does it need to run the demo loop too?

## 11. Branding / Distribution (tracked separately, noted here for context)

- Name: **Fluentic**.
- Distribution instinct validated by feedback: peer-to-peer sharing + TikTok/Reels, not paid acquisition — matches the "who would you send this to" answer (a peer, not a professional context).
- Monetization angle (not v1): don't price for the local/home market as primary revenue. Validate cheaply and honestly here, then price for urgency-driven markets — diaspora parents, IELTS/TOEFL/visa-interview prep, BPO/call-center job seekers. Sell the specific fear ("pass your visa interview," "stop freezing on English calls"), not generic "improve your English."

## 12. Milestones

1. Fix barge-in bug (mic state machine).
2. Swap STT to Groq Whisper.
3. Swap TTS to Edge TTS (or Google Cloud TTS).
4. Build Mock Interview + Casual Conversation + Grammar Correction as three selectable modes on top of the fixed loop.
5. Port to React Native (mobile) + rebuild landing/waitlist as separate static site.
6. Re-test with a small group (aim for behavior signals — did they keep talking, did they share it — over general enthusiasm).
7. Only then: consider Retell Loop, Tongue Twister mode, and any monetization experiments.