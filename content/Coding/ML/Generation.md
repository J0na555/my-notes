---
title: Generation
date: 2026-07-11
tags: [ai, rag, ml, vector]
publish: "false"
---
Generation in RAG is where the LLM turns [[Retrieval|retrieved context]] and the user query into a final answer; good generation depends on strong prompt construction, careful context window management, explicit citation requirements, grounded generation instructions, and techniques to reduce hallucinations.

## Prompt construction for RAG

RAG prompts are different from “pure” LLM prompts: they must tell the model to **use only (or primarily) the provided sources**, not its internal knowledge, and to behave predictably under token limits and conflicting information.

## Core components of a RAG prompt

A practical RAG prompt usually has:

1. **System instructions (role + constraints)**  
    Defines the model’s role and non-hallucination rules:
    
    ```text
     You are a precise research assistant. Answer using ONLY the provided sources.
     
		INSTRUCTIONS:
		1. Cite every factual claim with [source_id] immediately after the claim.
		2. If multiple sources support a claim, cite all: [id1][id2].
		3. If sources are insufficient, state: "The provided sources do not contain sufficient information."
		4. When sources disagree, present all viewpoints with citations.
		5. Prioritize more recent sources when dates differ.
    ```

    
    This covers authority (sources > parametric knowledge), scope (what to do when retrieval fails), constraints (format), and fallbacks (conflicts).
    
6. **Available sources block**  
    A structured list of retrieved chunks:

```text
AVAILABLE SOURCES:

[1] Title: "Addis Ababa Health Report 2025"
Section: "Diabetes Prevalence"
Content: "Diabetes prevalence in Addis Ababa is 8.2%..."

[5] Title: "Ethiopia National Survey 2024"
Section: "Metabolic Conditions"
Content: "National diabetes rate is 6.5%..."
```

    
Using IDs and metadata helps the model cite correctly and the system validate citations.
    
7. **User question**  
    Clear, specific query:

    ```text
    Question: What is the diabetes prevalence in Addis Ababa?
    ```
    
8. **Output instructions**  
    Format, tone, length:

```text
    Provide a detailed, cited answer. Use short paragraphs.
```
    

## Design patterns

- **Instructional prompts**: emphasize steps, rules, and structure.
- **Citation-focused prompts**: hard-cite requirements, explicit “no unsourced claims” language.
- **Fallback prompts**: tell the model what to say when retrieval is weak or conflicting.

A strong RAG prompt is more like a **specification** than a casual question: it defines behavior, constraints, and error handling.

## Context windows and placement

Modern LLMs have large context windows, but they still have limits and **attention biases** (e.g., “lost-in-the-middle” where middle content is less attended to)

## Managing context windows

Key decisions:

1. **Max context tokens**  
    Decide how many tokens you allocate to retrieved content vs the rest of the prompt:
    
    - 1000–4000 tokens for context: typical for many RAG systems.
    - More tokens = more info, but higher cost and latency.
        
2. **Document ordering**  
    Models often attend better to content at the **beginning and end** of the context. Strategies:
    
    - **Relevance ordering**: sort by retrieval score.
    - **Sandwich pattern**: put most relevant docs first and second-most-relevant last, middle docs in between.
    - **Chronological ordering**: for time-sensitive domains (legal, news).
        
3. **Truncation strategies**  
    When total tokens exceed the budget:
    
    - **Uniform**: equal token budget per document.
    - **Weighted**: allocate more tokens to higher-scored documents.
    - **Head-only**: truncate each doc to its beginning.
    - **Sliding window / extraction window**: extract a chunk around the most relevant sentence(s).
        
4. **Hierarchical or summarized context**  
    For very large corpora:
    
    - Use summaries of documents + full text of top candidates.
    - Or use multi-hop retrieval: first retrieve, then summarize, then retrieve again on refined queries.

The goal: maximize **relevant information** inside the window while avoiding attention loss and noise.

## Citations and grounding

Citations make RAG outputs **auditable**: you can check which source supported each claim. This is critical in legal, medical, and enterprise contexts.

## Citation formats

Common patterns:

- Bracketed IDs: `[1]`, `[doc_addis_report_2025]`.
- Inline footnotes: `...diabetes prevalence is 8.2%<sup>[1]</sup>`.
- Structured JSON: `{claims: [{text, source_ids}]}`.

Prompt-level guidance:

- Require citations **immediately after each factual claim**.
- Allow multiple source IDs: `[1][2]`.
- Enforce: “If no source supports a claim, do not state it as fact.”

## Grounded generation

“Grounded generation” means the model’s claims are **anchored in the retrieved context**, not hallucinated from training data.

Strategies in the prompt:

- Explicitly state: “Do not use knowledge outside the provided sources unless explicitly asked.”
- For uncertain cases: “If the sources do not contain sufficient information, say that clearly.”
- For conflicts: “When sources disagree, show both sides with citations, do not pick one arbitrarily.”

Additional techniques:

- **Answerability detection**: pre-check if the question is answerable from retrieved context; if not, short-circuit and say “I don’t know.”
- **Verification steps**: use a second pass (Chain-of-Verification) to check each claim against sources before final output

## Hallucination control

Hallucinations in RAG come from:

- Weak [[Retrieval|retrieval]] (no relevant context).
- Model ignoring context (preferring parametric knowledge).
- Conflicting or noisy sources.
- Poor prompt instructions (no constraints on citing or grounding).

See [[AI Trainer Study Notes]] for more on detecting and classifying hallucinations in AI outputs.

## Prompt-level controls

- **Authority**: “The provided sources take precedence over your training data.”
- **Scope**: “If the sources do not contain sufficient information, state that explicitly.”
- **Constraints**: “Cite every factual claim; do not make unsourced claims.”
- **Fallbacks**: explicit behavior for “no results” and “conflicting sources”.

## System-level controls

1. **Improve retrieval**
    - Use hybrid search (BM25 + dense).
    - Use rerankers to get better top‑k.
    - Tune chunking and metadata to improve relevance.

2. **Answerability detection**  
    Before generation:
    - Score whether top‑k chunks are actually relevant to the query.
    - If below threshold, skip generation and return a “no answer” message.

3. **Chain-of-Verification**
    - Generate a draft answer.
    - Extract claims.
    - Re-query or re-check each claim against sources.
    - Produce a final, verified answer.
        
4. **Post-generation checks**
    - Filter or flag outputs that contain claims without citations.
    - Use a classifier or small model to detect “unsupported claim” patterns.
       
5. **Strict templates**
    - Force structured output (e.g., JSON with `claim` and `source_ids` fields).
    - This makes it easier to detect and block hallucinated or uncited claims.

## Putting it together: a robust generation flow

A production-style RAG generation pipeline:

1. **[[Retrieval|Retrieve]]** relevant chunks (hybrid search + reranker).
2. **Check answerability**:
    - If retrieval is weak, return “I don’t know / insufficient information”.
3. **Construct prompt**:
    - System instructions (authority, scope, constraints, fallbacks).
    - Ordered and truncated sources block with IDs.
    - Clear user question and output format.
4. **Generate**:
    - LLM produces answer with mandatory citations.
5. **Post-process / verify**:
    - Validate that all factual claims have citations.
    - Optionally run a verification pass or classifier to filter hallucinations.
6. **Return**:
    - Final answer + citations, possibly with metadata (source titles, links).

This design reduces hallucination risk, makes outputs auditable, and keeps the LLM grounded in your actual data rather than its training memory.

## See also
- [[Embeddings]] — vector representations and similarity metrics
- [[Indexing]] — chunking strategies, metadata, and vector databases
- [[Retrieval]] — BM25, dense search, hybrid search, and reranking
- [[AI Trainer Study Notes]] — evaluating hallucinations, accuracy, and completeness

