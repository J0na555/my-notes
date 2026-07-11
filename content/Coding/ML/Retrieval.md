---
title: Retrieval
date: 2026-07-11
tags: [ai, rag, ml, vector]
publish: "false"
---
Retrieval in RAG is the process of finding the most relevant document chunks for a query using techniques like BM25 (lexical), dense retrieval ([[Embeddings|embedding-based]]), and hybrid search (combining both), often followed by reranking and accelerated with approximate nearest neighbor (ANN) search methods such as HNSW and FAISS.

## BM25: lexical (sparse) retrieval

BM25 (**Best Matching 25**) is a classic ranking function used in keyword search systems.

## How BM25 works (conceptually)

- It treats each document and query as a **bag of tokens** (words).
- For each query term, it computes a score based on:
    
    - **Term frequency (TF)**: how often the term appears in the document.
    - **Inverse document frequency (IDF)**: how rare the term is across the corpus.
    - **Document length normalization**: penalizes very long documents that might just repeat terms.

Simplified idea:

$$\text{score}(d, q) = \sum_{t \in q} \text{IDF}(t) \cdot \frac{f(t, d) \cdot (k_1 + 1)}{f(t, d) + k_1 \cdot \left(1 - b + b \cdot \frac{|d|}{\text{avglen}}\right)}$$

* $f(t, d)$: frequency of term $t$ in document $d$.
* $|d|$: document length.
* $k_1, b$: tuning parameters.
* $\text{avglen}$: average document length.

## Strengths of BM25

- **Fast and simple**: very efficient to compute and index.
- **Excellent for exact matches**: e.g., product codes, names, specific identifiers.
## Weaknesses of BM25

    
- **No semantic understanding**: cannot handle fuzzy queries or intent.
- Struggles with **ambiguous or short queries** without context.

Use BM25 when:

- Your domain has many exact identifiers (codes, IDs, product names).
- You need fast, low-cost retrieval with high precision for exact matches.
- You want a simple, interpretable baseline.

## Dense retrieval: embedding-based search

Dense retrieval uses **neural [[Embeddings|embeddings]]** to represent queries and documents as vectors and finds similar vectors in a high-dimensional space.
## How dense retrieval works

1. Encode query qqq into embedding q using a model (e.g., Sentence‑BERT, E5).
2. Encode each document chunk di​ into di
3. Compute similarity (often **cosine similarity** or dot product) between q and all di​.
4. Return top‑k most similar chunks.

## Strengths of dense retrieval

- **Semantic matching**: finds related meanings even without exact word overlap (“pizza” ↔ “Italian flatbread with toppings”)
- Handles **synonyms**, **vocabulary mismatch**, and **fuzzy queries**.
- Can support **multilingual** search if trained on parallel corpora.

## Weaknesses of dense retrieval

- **Higher cost**: generating embeddings (50–200 ms per doc) + maintaining vector index.
- **Less precise on exact identifiers**: embeddings for “XYZ-1234” are noisy; may match similar codes instead
- **Slower to update**: new documents need embedding generation and vector index updates.

Use dense retrieval when:

- Queries are semantic, fuzzy, or phrased differently from documents.
- You need to capture meaning beyond exact words.
- You can afford the extra compute and operational complexity.

## Hybrid search: combining BM25 and dense retrieval

Hybrid search merges **lexical (BM25)** and **dense (embedding)** retrieval to exploit their complementary strengths.

## Why hybrid?

- BM25: great for exact matches, codes, rare terms.
- Dense: great for semantics, synonyms, intent.
- Together: they cover more query types and reduce failures of each approach.
## Typical hybrid architecture

1. **Parallel retrieval**:
    
    - Run BM25 query → get ranked list Lbm25L_{bm25}Lbm25​.
    - Run dense vector query → get ranked list LdenseL_{dense}Ldense​.

2. **Fusion:**
   * Combine $L_{bm25}$ and $L_{dense}$ into a single ranked list.
   * Common method: **Reciprocal Rank Fusion (RRF):**
     $$\text{score}(d) = \frac{1}{k + \text{rank}_{bm25}(d)} + \frac{1}{k + \text{rank}_{dense}(d)}$$
     where $k$ is typically around 60, and rank is position in each list (1 for top).
   * Optionally, use weighted sums or learned fusion models.

2. **Reranking** (optional):
    - Pass top candidates to a reranker model for more accurate final ordering.

## Practical tips

- Start with **BM25 alone** as a baseline; add dense retrieval when vocabulary mismatch becomes a problem.
- Tune weights/fusion parameters based on evaluation metrics (recall, precision, NDCG).
- Use **metadata filters** (e.g., document type, date, department) on both branches before fusion.

Hybrid search is now the default in many production RAG systems because it consistently outperforms pure BM25 or pure dense retrieval

## Rerankers: improving final ordering

After retrieval (BM25, dense, or hybrid), you often have a **candidate set** (e.g., top 50–100 chunks). A **reranker** reorders these more precisely.

## What rerankers do

- They take a **query–document pair** and compute a more refined relevance score.
- Unlike retrieval models (which are often bi-encoders: query and doc encoded separately), rerankers are usually **cross-encoders** that jointly process query and doc for better accuracy but higher cost.

## Types of rerankers

- **Neural cross-encoders** (e.g., BERT-based): high quality, more expensive.
- **Lighter models** or rule-based reordering (e.g., boosting by metadata, recency).
- Learned fusion methods that combine BM25 score, dense score, and metadata signals.

## Placement in pipeline

1. Retrieval: BM25 + dense → top‑k candidates.
2. Rerank: cross-encoder or fusion model → final top‑k for LLM.
3. Generation: LLM uses reranked context.

Trade-off:

- Rerankers improve accuracy but add latency.
- Use them when retrieval quality is critical and you can afford the extra compute.

## Approximate Nearest Neighbor (ANN) search

In dense retrieval, you need to find the **nearest neighbors** of a query vector among millions of document vectors. Exact search is too slow; **ANN** algorithms approximate this quickly.

## ANN goal

- Find vectors close to q\mathbf{q}q with high **recall** (most true neighbors) and low **latency**.
- Trade-off: slightly approximate results, but much faster.

Common ANN algorithms:

## 1. HNSW (Hierarchical Navigable Small World)

- Builds a multi-level graph where nodes are vectors.
- Higher levels have fewer nodes and provide coarse navigation; lower levels are detailed.
- Search starts at top, navigates down, finding neighbors efficiently.

Characteristics:

- Very good **recall–latency trade-off**.
- Works well for high-dimensional embeddings.
- Used in many vector DBs (e.g., FAISS, Weaviate, Qdrant).

## 2. IVF (Inverted File Index)

- Clusters vectors into clusters (via KMeans, etc.).
- Each cluster has an “inverted file” of vectors belonging to it.
- For a query:
    
    1. Find closest clusters.
    2. Search only vectors in those clusters.

Characteristics:

- Good for large datasets.
- Can be tuned via number of clusters and number of clusters to probe.
- Also widely used in FAISS and other systems.

## FAISS (Facebook AI Similarity Search)

- A library for fast similarity search and dense vector clustering.
- Implements many ANN algorithms: HNSW, IVF, and variants.
- Supports:
    
    - Dense vectors.
    - Different distance metrics (cosine, Euclidean, etc.).
    - GPU acceleration for large-scale workloads.

In RAG:

- You often store embeddings in a vector DB that internally uses FAISS-like structures (HNSW/IVF) for fast retrieval.
- You configure parameters like:
    - Number of neighbors to return.
    - Search depth / number of candidates.
    - Recall targets vs latency.

## Putting it together: a typical RAG retrieval pipeline

A robust retrieval pipeline often looks like:
1. **Query preprocessing**:
    - Normalize, maybe expand or rewrite query.
2. **Parallel retrieval**:
    - BM25 (lexical) → top‑k candidates.
    - Dense (vector) via ANN (HNSW/IVF in FAISS or similar) → top‑k candidates.
3. **Filtering**:
    - Apply metadata filters (e.g., date range, department) on both sides.
4. **Fusion**:
    - Combine lists using RRF or weighted fusion.
5. **Reranking**:
    - Rerank top N (e.g., 50) with a cross-encoder or learned model.
6. **Final selection**:
    - Take top‑k (e.g., 5–10) as context for [[Generation|LLM generation]].

This design gives you:
- **Precision** from BM25 (exact matches, codes).
- **Recall** from dense retrieval (semantic matches).
- **Accuracy** from reranking.
- **Speed** from ANN (HNSW/IVF) in the vector index.

## See also
- [[Embeddings]] — vector representations and similarity metrics
- [[Indexing]] — chunking strategies, metadata, and vector databases
- [[Generation]] — prompt construction, citations, and hallucination control
