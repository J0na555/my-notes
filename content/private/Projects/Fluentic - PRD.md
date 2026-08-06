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

**v1 decisions locked (2026-08-06):**
- RN-first (Android-first).
- On-device TTS only.
- Backend text-only.
- Barge-in = stop-and-listen.
- Google Cloud TTS deferred (no card).
- TTS.ai rejected for v1.
- Extra modes (Retell, Tongue Twister) held for v1.1.
- Corrections = structured metadata; spoken + highlighted on screen.
- Website: static + demo video + waitlist form; no live web demo.

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
- No server-side TTS in v1 — voice is on-device.
- No paid voice APIs (ElevenLabs and similar stay out; the $0 constraint covers voice too).
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
|**Grammar Correction Mode**|Same conversational loop, but corrections are the point — more frequent, more explicit; corrections spoken and shown on screen (corrected sentence displayed as text). Directly requested by tester ("a scenario for people who want to improve and correct their English grammar").|New, tester-requested|

### 7.2 v1.1 modes (build once core loop is solid)

|Mode|Description|
|---|---|
|**Retell Loop**|User rants/speaks freely. AI retells it back in better phrasing. User repeats it. AI corrects again. Loop continues until it's clean.|
|**Tongue Twister / Read-Aloud**|AI gives a tongue twister, or asks a question with the answer shown on screen, and the user has to read it aloud as fast and naturally as possible. Pronunciation/fluency drill, distinct from the conversational modes.|

### 7.3 Explicitly out of scope for now

Progress tracking, scoring, multi-scenario dashboards, payments — revisit only after the loop itself is validated at v1 scale.

## 8. Technical Architecture

### 8.1 Client

- **React Native** for the mobile app (iOS + Android from one codebase), built with **Expo**.
- **Android-first**: ship Android first (Play Store one-time $25), defer iOS (Apple $99/yr) until the product is validated.
- Companion **website** for the waitlist/landing page (static, separate from the app itself — see branding plan).

### 8.2 Voice pipeline (the part that changes from the demo)

|Layer|Demo (broken)|v1 (fix)|Why|
|---|---|---|---|
|STT|Web Speech API (browser)|**Groq Whisper Large v3 Turbo** via API|Free tier: 2,000 requests/day, 7,200 audio-seconds/hour, no card. Dramatically more accurate than browser recognition — this fixes the "hears what it wants" bug directly. Not real-time streaming (buffers the full utterance), which is fine for a turn-based loop.|
|LLM|Groq free tier|**Groq free tier** (unchanged)|Already validated, keep it.|
|TTS|Browser SpeechSynthesis|**On-device system TTS** via `expo-speech` (Android Google neural voices / iOS AVSpeechSynthesizer)|Zero infra, zero cost, instant barge-in (killing local playback), works offline. Desktop browser voices were the worst tier and the tester was still "amazed" — quality is already above the validated demo bar.|

> [!note] TTS abstraction from day one
> 
> One interface, multiple implementations — later options (Edge TTS behind the backend, Google Cloud TTS free tier, on-device Kokoro via `react-native-sherpa-onnx`) slot in without a rewrite. Later options are gated on evidence that voice quality is a real drop-off reason — the "don't over-invest in premium voice" discipline stays.

> [!warning] Barge-in fix (do this before anything else)
> 
> Mic state is an explicit machine: `idle → listening → processing → speaking → idle`. Decision made (option a): while in `speaking`, a mic tap immediately stops TTS playback and transitions to `listening` — the mic must visually LOOK interruptible, not greyed out. This was the #1 bug reported and blocks the core loop from feeling conversational.

### 8.3 Backend

- All STT/LLM calls happen server-side (not directly from client), so API keys are never exposed in the RN app and both mobile + web share one pipeline.
- In v1 the backend returns **text only** — STT + LLM happen server-side, keys never in the client; TTS runs on-device, so there is no TTS server in v1. If a server-side TTS layer (Edge TTS / Google Cloud TTS) is added later, it goes behind this same backend proxy (keeps keys server-side, which TTS vendors' ToS require).
- Keep it a simple monolith — one backend service handling: receive audio → Whisper → LLM (with mode-specific system prompt) → return text + correction metadata. The LLM's phrasing corrections come back as **structured metadata** (original phrase + corrected phrase), not just prose, so the client can speak them and highlight them in captions without parsing text. No microservices needed at this scale.

### 8.4 State / data

- No accounts in v1 → no persistent user data beyond the current session.
- Conversation history kept in-memory / client-side for the duration of a session only.

## 9. Scaling considerations (for later, not today)

- Groq free tier limits (LLM + Whisper) are per-organization, not per-user — at real usage this becomes the first bottleneck, not the TTS side. Watch this before watching TTS costs.
- Edge TTS (the unofficial edge-tts endpoint) is flaky in 2026: intermittent failures, IP blocking, no SLA; its own author warns against commercial reliance. Never build on it as the only path.
- Google Cloud TTS free tier is generous (1M chars/month Neural2 + 4M WaveNet, permanent, commercial use OK) but requires a billing-enabled account with a payment card — deferred until a card is available.
- Groq added TTS (Jan 2026, Orpheus-based) but the free quota is tiny (~100 requests/day) — demo layer, not a path.
- TTS.ai (hosted open-weight models) was evaluated: a real service, but 15K chars is a one-time bonus with only 10K chars/month recurring, the free tier is non-commercial, ToS bans client-side keys, and it's a ~5-month-old solo-vendor service — rejected for v1; useful only as a measuring instrument to A/B Kokoro quality.
- The better long-term open-weight path: Kokoro runs on-device in React Native via `react-native-sherpa-onnx` (Apache 2.0, ~realtime on midrange phones, ~100MB model) — same quality as hosted Kokoro with no quota/vendor risk.
- If/when scaling past free tiers: Groq's paid tier is still cheap (Whisper Turbo ~$0.04/hour of audio) — cost isn't the risk, rate limits are.
- Revisit ElevenLabs (or similar) only if user feedback specifically flags voice realism as a drop-off reason — not proactively.

## 10. Open questions — all resolved 2026-08-06

- [x] **Retell Loop and Tongue Twister** — held for v1.1, NOT v1. Retell is cheap (same loop, new prompt, round counter) but validates nothing the three v1 modes don't; it can slip in as a bonus if the loop lands early. Tongue Twister needs new UI/state (on-screen text, read-aloud timing) — genuinely v1.1.
- [x] **Grammar Correction Mode** — same conversational loop as other modes; the LLM returns corrections as structured metadata (original phrase + corrected phrase) from day one; corrections are spoken AND shown — the client highlights the corrected phrase in the on-screen caption; in Grammar mode the corrected sentence is also shown as text. No separate UI screen, no red-pen treatment, no new state machine.
- [x] **Website** — purely a static landing page — no live web demo loop in v1. It hosts: value prop, a 30-60s demo video (screen recording of the real app), a waitlist email form (plain form, not an account system), and a small test-build download section (APK / Play internal track) for the milestone-6 test group. A live web demo would re-implement the abandoned browser audio platform.

## 11. Branding / Distribution (tracked separately, noted here for context)

- Name: **Fluentic**.
- Distribution instinct validated by feedback: peer-to-peer sharing + TikTok/Reels, not paid acquisition — matches the "who would you send this to" answer (a peer, not a professional context).
- Monetization angle (not v1): don't price for the local/home market as primary revenue. Validate cheaply and honestly here, then price for urgency-driven markets — diaspora parents, IELTS/TOEFL/visa-interview prep, BPO/call-center job seekers. Sell the specific fear ("pass your visa interview," "stop freezing on English calls"), not generic "improve your English."
- Website: static landing page — value prop for urgency personas + 30-60s demo video (real app screen recording) + waitlist email form + test-build download page for the milestone-6 group. No live web demo loop in v1.

## 12. Milestones

1. Fix barge-in bug (mic state machine, stop-and-listen) — built directly in the RN app.
2. Swap STT to Groq Whisper (server-side).
3. On-device TTS via `expo-speech` with the abstracted layer + poor-voice detection/fallback.
4. Build Mock Interview + Casual Conversation + Grammar Correction as three selectable modes on the fixed loop.
5. Build the static landing/waitlist website (value prop, demo video, waitlist form, test-build download page).
6. Re-test with a small group (behavior signals: did they keep talking, did they share it).
7. Only then: consider Retell Loop, Tongue Twister, monetization experiments, iOS shipping, and any TTS quality layer (only if voice is a measured drop-off).