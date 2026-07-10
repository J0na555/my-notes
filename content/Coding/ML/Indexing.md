---
title: Indexing
date: 2026-07-10
meta: ai · RAG · vector
publish: "false"
---
Indexing in RAG is the process of turning your raw documents into searchable embeddings: you decide how to chunk text, attach metadata, store everything in a vector database, and build an ingestion pipeline that keeps the index up to date

## Why indexing matters in RAG

Good indexing determines:
- **What** the retrieval step can find (quality and coverage).
- **How fast** it can find it (latency and scalability).
- **How well** it handles large, evolving document sets (updates, deletions, re‑indexing).

RAG “lives or dies” by retrieval quality and speed, and the vector database is the core of that.

## Chunking strategies

Chunking splits long documents into smaller pieces that:
- Fit within embedding model and LLM token limits.
- Preserve enough context to be meaningful on their own.

Common strategies:

## 1. Fixed-size (character/ token) chunking

- Split text into chunks of N characters or tokens (e.g., 200–500 tokens).
- Simple and fast, but can cut sentences or break semantic coherence.
- Good for: very large, unstructured text where structure is unknown.

## 2. Delimiter-based chunking

- Split by natural delimiters: newlines (`\n`), section headers, bullets, punctuation.
- Preserves logical boundaries better than raw fixed-size splits
- Good for: meeting notes, outlines, articles with clear sections.

## 3. Section-based / hierarchical chunking

- Use document structure: headings, paragraphs, tables, chapters.
- Chunks align with natural topics (e.g., one chunk per section)
- Good for: reports, books, documentation with consistent structure.
- Often combined with overlap: include some bordering text to avoid cutting context.

## 4. Semantic chunking

- Use NLP or LLMs to detect where meaning changes and split there.
- Each chunk is a coherent idea or topic
- More expensive but often improves retrieval quality.
- Good for: complex documents where topic boundaries matter.
    

## 5. Agentic / adaptive chunking

- Use an LLM or agent to decide chunk boundaries based on content, context windows, and query patterns.
- Can dynamically adjust chunk size and overlap based on downstream performance.
- Good for: production systems where you want to optimize RAG quality over time.

Practical notes:

- Typical chunk sizes: 200–600 tokens for many RAG setups, but tune based on your domain and embedding model.
- Overlap (e.g., 50–100 tokens) between chunks helps avoid losing context at boundaries.    
- For very long documents, consider hierarchical indexing: chunk by section, then sub‑chunk sections if needed.

## Metadata in RAG indexing

Metadata is additional structured information attached to each chunk, used for:
- Filtering (e.g., only from a specific document, date range, or department).
- Ranking and boosting (e.g., prioritize recent or high‑importance documents).
- Debugging and tracing (knowing which document a chunk came from)

Common metadata fields:
- `doc_id`: unique ID of the source document.
- `doc_title`, `doc_type`: title and type (report, email, ticket, etc.).
- `section`, `chapter`, `page`: position in the document.
- `created_at`, `updated_at`: timestamps.
- `author`, `department`, `language`, `tags`.
- Custom flags: `is_public`, `importance`, `audience`.

How metadata is used:
- During query time, you can filter candidates: “only chunks from documents where `department = 'finance'` and `created_at >= 2025-01-01`”.
- Hybrid search: combine vector similarity with metadata filters and keyword matching.
- Post‑retrieval: re‑rank based on metadata (e.g., newer documents get higher score).

A good design:
- Store metadata directly in the vector database record alongside the embedding.
- Ensure field names are consistent and typed (string, number, date) so filters work reliably.
## Vector databases for RAG

Vector databases specialize in storing embeddings and performing similarity search at scale. They differ in:

- Performance (latency, throughput).
- Scalability (single node vs distributed).
- Features: hybrid search, metadata filtering, updates/deletions, multi‑tenancy.
- Licensing: open source vs commercial.

Popular options:
## 1. Pinecone

- Fully managed, cloud service.
- Easy to use, good performance, strong tooling.
- Good for: teams that want low operational overhead and don’t need to self‑host.

## 2. Weaviate

- Open source, with cloud option.
- Strong feature set: hybrid search, metadata filters, re‑ranking, GraphQL API.
- Good for: production RAG with flexible querying and open source preferences

## 3. Qdrant

- Open source, high performance.
- Emphasizes filtering, scalability, and hybrid search.
- Good for: large-scale, high‑throughput RAG systems.
## 4. Milvus

- Open source, distributed.
- Strong for large clusters and high concurrency.
- Good for: enterprise-grade, highly scalable deployments.

## 5. pgvector (PostgreSQL extension)

- Adds vector search to PostgreSQL.
- Uses existing DB infrastructure, simple for teams already using Postgres.
- Good for: moderate-scale RAG where you want to stay in one database.

## 6. Chroma

- Lightweight, developer-friendly.
- Great for prototypes and small apps.
- Less suited for massive scale or complex production features

## 7. Vespa / Redis / Others

- Redis: fast, good for small to medium sets with simple queries.
- Vespa: powerful, multi‑modal, hybrid search, but more complex.
- Use when you have specific needs (caching, real‑time updates, etc.).

Choosing a vector DB:

- Start simple: if you’re prototyping, Chroma or pgvector can be enough.
- For production, consider performance, filtering, hybrid search, and operational cost.
- Always evaluate with your own data and queries (recall, latency) rather than just benchmarks

## Ingestion pipelines

An ingestion pipeline is the end‑to‑end process that:

1. Reads raw documents.
2. Cleans and preprocesses them.
3. Splits into chunks.
4. Adds metadata.
5. Generates embeddings.
6. Stores them in the vector database

Key components:

## 1. Document loading

- Sources: files (PDF, DOCX, TXT), databases, APIs, web pages.
- Use parsers that handle format-specific details (e.g., extract tables and headings from PDFs).

## 2. Preprocessing

- Normalize text: encoding, whitespace, remove noise.
- Strip non‑text elements (images, footers) unless they’re relevant.
- Optionally detect language, extract structure (headings, sections).

## 3. Chunking

- Apply your chosen strategy (fixed, delimiter, section, semantic, etc.).
- Add chunk-level metadata: `chunk_id`, `doc_id`, `section`, `page`, etc.
- Decide overlap and size based on your domain and models.

## 4. Embedding generation

- Use an embedding model (e.g., Sentence‑BERT, E5, etc.).
- Ensure consistency: same model (or compatible) for indexing and querying.
- Batch embeddings for efficiency.

## 5. Storage in vector DB

- Insert records: `(embedding, chunk_text, metadata)`.
- Configure indexes (e.g., HNSW, IVF) for fast similarity search.
- Set up metadata filters and indexing on filter fields if supported.

## 6. Updates, deletions, re‑indexing

- Handle:
    - New documents: append new chunks.
    - Edited documents: re‑index affected chunks (delete old, insert new).
    - Deleted documents: remove all related chunks.
- Design IDs (`doc_id`, `chunk_id`) so you can efficiently find and update/delete records.

## 7. Monitoring and evaluation

- Measure:
    
    - Retrieval quality: recall, precision on sample queries.
    - Latency: time from query to top‑k results.
    - Coverage: do all important documents get indexed?
- Track failures: missing documents, parsing errors, embedding errors.

A simple pipeline pattern (conceptual):

```text
[Document Sources] 
  → [Loader + Parser] 
  → [Preprocessor] 
  → [Chunker + Metadata Enricher] 
  → [Embedding Model] 
  → [Vector DB Writer] 
  → [Vector DB + Index]
```
## Designing a robust indexing strategy

Practical guidelines:

- Start with **section-based or delimiter-based chunking** with small overlap; refine later
- Attach **rich but consistent metadata**: at least `doc_id`, `doc_title`, `created_at`, and any filters you’ll use at query time.
- Choose a **vector DB** that matches your scale and operational constraints; don’t over-engineer early.
- Build your **ingestion pipeline** as modular steps so you can swap chunking, preprocessing, or embedding models without rewriting everything.
- Continuously **evaluate** retrieval quality with real queries and adjust chunk size, overlap, and metadata usage accordingly.

