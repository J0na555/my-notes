---
title: Embeddings
date: 2026-07-10
tags: [ai, rag, ml, vector]
publish: "false"
---
Embeddings are numerical(vector) representations of text that capture semantic meaning and in RAG  they let you turn a query and all your documents into points in a high dimensional vector space so you can find "similar" content using similarity measures like cosine similarity.

## What embeddings are
In RAG, an embedding is typical a dense vector (eg. 768 or 1024 numbers)   produced by a model that maps  text (words, sentences, chunks or documents) into a vector space

- Instead of representing text as “bag of words” or exact tokens, embeddings encode meaning: similar ideas map to nearby points, unrelated ideas map far apart.
    
- For example, “king” and “queen” will be close in the embedding space, while “king” and “car” will be far, because the model learns distributional semantics from training data
    
In a RAG pipeline

1. You [[Indexing|chunk your documents]] and compute an embedding for each chunk, storing them in a [[Indexing|vector database]].
2. When a user asks a question, you compute an embedding for the query using the same (or compatible) embedding model
3. You then [[Retrieval|search the vector database]] for chunks whose embeddings are most similar to the query embedding

## Vector spaces and representation

Think of each embedding as a point in a _high-dimensional vector space_:

- Each dimension is a number; a 768‑dimensional embedding lives in a 768‑dimensional space.
- The position of a point reflects the semantic content of the text: texts with similar meanings cluster together; different meanings form separate clusters

Mathematically, if you have two texts A and B, their embeddings are vectors:

$$\mathbf{a} = (a_1, a_2, \dots, a_d), \quad \mathbf{b} = (b_1, b_2, \dots, b_d)$$

where d is   the embedding dimension (768)
the distance or angle between a and b in this space is used to measure how similar the texts are.

## How similarity works in RAG

Once you have query and document embeddings, you need a _similarity function_ to decide which documents are most relevant. Common choices:

- **Cosine similarity** (most common in RAG
- Euclidean distance (sometimes used, but less common for semantic similarity)
- Dot product (often used when embeddings are normalized; closely related to cosine similarity)

In RAG, the system:

1. Computes similarity between the query embedding and every (or many candidate) document embeddings
2. Ranks documents by similarity score.
3. Returns the top‑k most similar chunks as context for the LLM to generate an answer.

The key idea: _semantic similarity_ ≈ _geometric closeness_ in the embedding space.

## Cosine similarity: intuition

Cosine similarity measures the _angle_ between two vectors, not their length. It answers: “If I point these vectors from the origin, how aligned are they?”

- If two vectors point in exactly the same direction, the angle is 0°, cosine similarity = 1.
- If they are orthogonal (90°), cosine similarity = 0.
- If they point in opposite directions (180°), cosine similarity = −1.

For RAG, we usually care about values near 1 (very similar) down to 0 (not similar); negative values are rare with good text embedding models

## Cosine similarity: formula
For vectors a and b in d dimensions:

$$\text{cosine\_similarity}(\mathbf{a}, \mathbf{b}) = \frac{\mathbf{a} \cdot \mathbf{b}}{\|\mathbf{a}\| \|\mathbf{b}\|} = \frac{\sum_{i=1}^{d} a_i b_i}{\sqrt{\sum_{i=1}^{d} a_i^2} \sqrt{\sum_{i=1}^{d} b_i^2}}$$

Where:
* $\mathbf{a} \cdot \mathbf{b} = \sum a_i b_i$ is the dot product.
* $\|\mathbf{a}\| = \sqrt{\sum a_i^2}$ is the Euclidean norm (length).

Properties:

- If both vectors are normalized to length 1, cosine similarity is just the dot product
- It is insensitive to magnitude: a long vector and a short vector can still have high cosine similarity if they point in the same direction

In RAG, this is convenient because embedding models often produce vectors with different scales, but we care about _direction_ (semantic meaning), not absolute size.

## Why cosine similarity fits RAG

Cosine similarity is well-suited for RAG because:

- It captures _directional_ similarity, which aligns with “same meaning” even if wording differs.
- It works well with dense, high-dimensional embeddings from transformer models (e.g., Sentence‑BERT, E5, etc.).
- It is bounded between −1 and 1, making it easy to interpret and threshold.

Example:
- Query: “best restaurants in Addis Ababa”
- Document chunk: “places to eat in Addis”
- Exact keyword match might be weak, but their embeddings will be close → high cosine similarity → retrieved as relevant

## Practical note: how RAG uses embeddings + similarity

Typical RAG flow with embeddings:

1. **[[Indexing]]**:
    - Chunk documents (e.g., by paragraph or fixed token size).
    - Compute embedding for each chunk.
    - Store `(chunk_text, embedding)` in a vector DB (FAISS, Pinecone, Chroma, Weaviate, etc.).
2. **[[Retrieval|Querying]]**:
    - Turn user query into an embedding using the same model.
    - Use a similarity search (often cosine similarity) to find top‑k nearest chunks.
3. **[[Generation]]**:
    - Pass query + retrieved chunks to an LLM.
    - LLM generates an answer grounded in the retrieved context.

Key points to remember:

- Using the _same_ (or compatible) embedding model for queries and documents is crucial; otherwise, the vector spaces don’t align and similarity is meaningless.learn.
- Embedding quality (model choice, domain adaptation) directly affects retrieval quality and thus RAG performance.learn.
- Cosine similarity is the standard similarity metric in most RAG systems because it robustly captures semantic closeness in high-dimensional spaces.

## See also
- [[Indexing]] — chunking strategies, metadata, and vector databases
- [[Retrieval]] — BM25, dense search, hybrid search, and reranking
- [[Generation]] — prompt construction, citations, and hallucination control