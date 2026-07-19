#fluentic

### must have 
- **mode selection - home page** :- Mock Interview / Casual Conversation / Grammar Correction
- **conversation screen/ session screen** :- the main product page
- **scenario-sub select** :- only for casual conversation, cafe / travel / shopping / friends, can also be  a simple toggle (doesn't have to be a whole page)
- **permission/mic access prompt** :- first run only, one time
- **Session end state** :- lightweight, just "how'd that feel" or a restart button


**The conversation screen needs to design for _states_, not just layout.**
- **Idle** — waiting for the user to start talking
- **Listening** — user is speaking, needs an obvious "yes I'm hearing you" signal (waveform, pulse, whatever — but something live, not static)
- **Processing** — brief gap while STT/LLM run, needs its own state so it doesn't look frozen
- **AI speaking** — visually distinct from listening, and this is the state where your barge-in fix lives, so the mic needs to _look_ interruptible here (not greyed out if you're going with barge-in-enabled)
- **Correction shown** — however you surface the 1-2 phrasing fixes, needs a treatment that doesn't feel like a red-pen grammar check

**Must-haves regardless of visual style:**
- **Live captions of what the AI is saying, on-screen at all times** — not optional. People practice this in public, on transit, with earbuds in low volume. If your only feedback channel is audio, you lose users the moment they're not in a quiet room alone.
- **A visible text log of the last exchange minimum** — even without a full transcript feature, someone should be able to glance back at what was just said.
- **One unmistakable mic button** — this is the single most-tapped element in the whole app. It should not compete with anything else on screen for attention.