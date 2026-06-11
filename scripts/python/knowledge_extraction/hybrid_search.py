#!/usr/bin/env python3
"""hybrid_search.py

Unified search that merges vector similarity (pgvector) with graph traversal
(Neo4j) to return a single ranked response.
"""
from __future__ import annotations

import logging
from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional

from pgvector_client import PgvectorClient, SearchResult
from neo4j_client import Neo4jClient

logger = logging.getLogger("hybrid_search")


@dataclass
class HybridResponse:
    query: str
    chunks: List[Dict[str, Any]] = field(default_factory=list)
    graph_context: Dict[str, Any] = field(default_factory=dict)
    score: float = 0.0


class HybridSearch:
    """Combine pgvector and Neo4j search into a single response."""

    def __init__(
        self,
        pg: Optional[PgvectorClient] = None,
        neo: Optional[Neo4jClient] = None,
    ) -> None:
        self.pg = pg or PgvectorClient()
        self.neo = neo or Neo4jClient()

    def close(self) -> None:
        self.neo.close()

    def __enter__(self) -> "HybridSearch":
        return self

    def __exit__(self, *exc: Any) -> None:
        self.close()

    def search(self, query: str, top_k: int = 5) -> HybridResponse:
        chunks = self.pg.search(query, top_k=top_k)
        chunk_dicts = [self._serialise_chunk(c) for c in chunks]
        # Pull matching entities from chunks, then expand via Neo4j.
        seed_terms = self._extract_seed_terms(chunks)
        graph = {"nodes": [], "edges": []}
        if seed_terms:
            graph = self.neo.graph_search(seed_terms[:3], top_k=top_k)
        score = self._blend_score(chunks)
        return HybridResponse(
            query=query,
            chunks=chunk_dicts,
            graph_context=graph,
            score=score,
        )

    # ── helpers ──────────────────────────────────────────────────────────
    @staticmethod
    def _serialise_chunk(c: SearchResult) -> Dict[str, Any]:
        return {
            "chunk_id": c.chunk_id,
            "notebook_id": c.notebook_id,
            "source_id": c.source_id,
            "chunk_index": c.chunk_index,
            "text": c.text,
            "metadata": c.metadata,
            "distance": c.distance,
            "relevance": max(0.0, 1.0 - c.distance),
        }

    @staticmethod
    def _extract_seed_terms(chunks: List[SearchResult]) -> List[str]:
        terms: List[str] = []
        seen: set = set()
        for c in chunks:
            for word in c.text.split():
                w = word.strip(".,;:!?'\"()[]{}").lower()
                if len(w) >= 5 and w.isalpha() and w not in seen:
                    seen.add(w)
                    terms.append(w)
                if len(terms) >= 10:
                    break
            if len(terms) >= 10:
                break
        return terms

    @staticmethod
    def _merge_graph(a: Dict[str, Any], b: Dict[str, Any]) -> Dict[str, Any]:
        nodes = {n["id"]: n for n in a.get("nodes", [])}
        edges_key = {
            (e["source"], e["type"], e["target"]) for e in a.get("edges", [])
        }
        merged_edges = list(a.get("edges", []))
        for n in b.get("nodes", []):
            nodes.setdefault(n["id"], n)
        for e in b.get("edges", []):
            key = (e["source"], e["type"], e["target"])
            if key not in edges_key:
                edges_key.add(key)
                merged_edges.append(e)
        return {"nodes": list(nodes.values()), "edges": merged_edges}

    @staticmethod
    def _blend_score(chunks: List[SearchResult]) -> float:
        if not chunks:
            return 0.0
        # Cosine distance: 0 = identical, 2 = opposite.  Normalise to [0, 1].
        sims = [max(0.0, 1.0 - c.distance) for c in chunks]
        return sum(sims) / len(sims)


if __name__ == "__main__":  # pragma: no cover - manual smoke
    logging.basicConfig(level=logging.INFO)
    import json
    import sys

    query = sys.argv[1] if len(sys.argv) > 1 else "test query"
    with HybridSearch() as hs:
        result = hs.search(query)
    json.dump(
        {
            "query": result.query,
            "score": result.score,
            "chunks": result.chunks,
            "graph_context": result.graph_context,
        },
        sys.stdout,
        indent=2,
        default=str,
    )
    sys.stdout.write("\n")
