#!/usr/bin/env python3
"""test_pipeline.py

End-to-end validation of the knowledge_extraction pipeline.  Runs each stage
in sequence (or in parallel for the storage stages) and asserts non-empty
output.  Designed to be re-runnable: it truncates the storage tables before
re-ingesting.

Pass ``--synthetic`` to skip the NotebookLM stage and feed inline chunks
through the rest of the pipeline (useful when the MCP server is unavailable
for environment reasons).
"""
from __future__ import annotations

import argparse
import json
import logging
import os
import sys
import time
from concurrent.futures import ThreadPoolExecutor
from dataclasses import asdict
from pathlib import Path
from typing import Any, Dict, List

def _load_env_file(path: Path) -> None:
    if not path.exists():
        return
    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, value = line.partition("=")
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        if key and key not in os.environ:
            os.environ[key] = value

_load_env_file(Path(__file__).resolve().parents[3] / ".env.local")



# Allow running directly: `python test_pipeline.py`
HERE = Path(__file__).resolve().parent
if str(HERE) not in sys.path:
    sys.path.insert(0, str(HERE))

from notebooklm_ingester import (
    IngesterConfig,
    NotebookLMIngester,
    Chunk,
)
from nlp_processor import NLPProcessor, ProcessedChunk
from pgvector_client import PgvectorClient
from neo4j_client import Neo4jClient
from hybrid_search import HybridSearch

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s: %(message)s",
)
log = logging.getLogger("test_pipeline")


def banner(msg: str) -> None:
    bar = "=" * 70
    log.info("\n%s\n  %s\n%s", bar, msg, bar)


SYNTHETIC_CHUNKS: List[Dict[str, Any]] = [
    {
        "text": (
            "Sam Altman is the CEO of OpenAI, which is based in San Francisco. "
            "OpenAI builds advanced AI models such as GPT."
        ),
        "notebook_id": "synth-nb-1",
        "source_id": "synth-src-1",
        "chunk_index": 0,
        "metadata": {"notebook_title": "AI Companies", "source_title": "OpenAI Overview"},
    },
    {
        "text": (
            "Google was founded by Larry Page and Sergey Brin in California. "
            "Google owns YouTube and develops the Android operating system."
        ),
        "notebook_id": "synth-nb-2",
        "source_id": "synth-src-2",
        "chunk_index": 0,
        "metadata": {"notebook_title": "Tech History", "source_title": "Google Founding"},
    },
    {
        "text": (
            "Microsoft acquired GitHub in 2018 for 7.5 billion dollars. "
            "Satya Nadella is the CEO of Microsoft, headquartered in Redmond."
        ),
        "notebook_id": "synth-nb-2",
        "source_id": "synth-src-3",
        "chunk_index": 0,
        "metadata": {"notebook_title": "Tech History", "source_title": "Microsoft Acquisitions"},
    },
]


def stage_ingest(use_synthetic: bool = False) -> List[Chunk]:
    banner("1. NotebookLM ingestion" + (" (synthetic)" if use_synthetic else ""))
    if use_synthetic:
        chunks = [
            Chunk(
                text=c["text"],
                notebook_id=c["notebook_id"],
                source_id=c["source_id"],
                chunk_index=c["chunk_index"],
                metadata=c["metadata"],
            )
            for c in SYNTHETIC_CHUNKS
        ]
        log.info("✓ loaded %d synthetic chunk(s)", len(chunks))
        assert chunks, "synthetic data is empty"
        return chunks

    config = IngesterConfig(
        notebook_limit=int(os.environ.get("TEST_NOTEBOOK_LIMIT", "1")),
        source_limit=int(os.environ.get("TEST_SOURCE_LIMIT", "2")),
        chunk_target_tokens=int(os.environ.get("TEST_CHUNK_TOKENS", "256")),
        chunk_overlap_tokens=int(os.environ.get("TEST_CHUNK_OVERLAP", "32")),
    )
    log.info("ingester config: %s", config)
    with NotebookLMIngester(config) as ing:
        chunks = ing.ingest()
    log.info("✓ ingested %d chunk(s)", len(chunks))
    assert chunks, "ingestion produced no chunks"
    return chunks


def stage_nlp(chunks: List[Chunk]) -> List[ProcessedChunk]:
    banner("2. NLP processing (spaCy NER + relations)")
    proc = NLPProcessor()
    processed = proc.process(chunks)
    total_entities = sum(len(p.entities) for p in processed)
    total_relations = sum(len(p.relationships) for p in processed)
    log.info(
        "✓ processed %d chunk(s) → %d entity/ies, %d relation(s)",
        len(processed),
        total_entities,
        total_relations,
    )
    assert processed, "NLP processing produced nothing"
    return processed


def _flatten_entities(processed: List[ProcessedChunk]) -> List[Dict[str, Any]]:
    out: List[Dict[str, Any]] = []
    for p in processed:
        for e in p.entities:
            out.append(asdict(e))
    return out


def _flatten_relations(processed: List[ProcessedChunk]) -> List[Dict[str, Any]]:
    out: List[Dict[str, Any]] = []
    for p in processed:
        for r in p.relationships:
            out.append(asdict(r))
    return out


def stage_pgvector(chunks: List[Chunk], yes_truncate: bool = False) -> int:
    banner("3. pgvector storage")
    pg = PgvectorClient()
    pg.init_schema()
    if yes_truncate:
        pg.truncate()
    inserted = pg.insert_chunks(chunks)
    log.info("✓ inserted %d chunk(s) into pgvector", inserted)
    assert inserted > 0
    return inserted


def stage_neo4j(processed: List[ProcessedChunk]) -> Dict[str, int]:
    banner("4. Neo4j storage (parallel with pgvector)")
    neo = Neo4jClient(trust_all_certs=True)
    neo.init_schema()
    entities = _flatten_entities(processed)
    rels = _flatten_relations(processed)
    e_count = neo.upsert_entities(entities)
    r_count = neo.upsert_relationships(rels)
    log.info("✓ inserted %d entity/ies, %d relationship(s)", e_count, r_count)
    neo.close()
    return {"entities": e_count, "relationships": r_count}


def stage_hybrid(query: str) -> Dict[str, Any]:
    banner(f"5. Hybrid search (query={query!r})")
    neo = Neo4jClient(trust_all_certs=True)
    with HybridSearch(neo=neo) as hs:
        result = hs.search(query, top_k=5)
    payload = {
        "query": result.query,
        "score": result.score,
        "chunks": result.chunks,
        "graph_context": result.graph_context,
    }
    log.info("✓ hybrid search returned %d chunk(s), %d graph node(s)",
             len(result.chunks), len(result.graph_context.get("nodes", [])))
    return payload


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--synthetic",
        action="store_true",
        help="Skip the NotebookLM stage and feed inline synthetic chunks.",
    )
    parser.add_argument(
        "--yes-truncate",
        action="store_true",
        help="Truncate the storage tables before ingesting.",
    )
    args = parser.parse_args()

    t0 = time.time()
    try:
        chunks = stage_ingest(use_synthetic=args.synthetic)
    except Exception as exc:
        log.error("ingestion stage failed: %s", exc)
        if not args.synthetic:
            log.error(
                "Re-run with --synthetic to validate stages 2-5 against "
                "inline data without requiring the NotebookLM MCP server."
            )
        return 1
    processed = stage_nlp(chunks)
    # Steps 3 + 4 in parallel (independent DBs, same input).
    with ThreadPoolExecutor(max_workers=2) as ex:
        f_pg = ex.submit(stage_pgvector, chunks, args.yes_truncate)
        f_neo = ex.submit(stage_neo4j, processed)
        pg_inserted = f_pg.result()
        neo_stats = f_neo.result()

    # Pick a query from the first chunk to make the demo query topical.
    sample_text = chunks[0].text if chunks else ""
    query = os.environ.get("TEST_QUERY") or " ".join(sample_text.split()[:8])
    payload = stage_hybrid(query)

    banner("Summary")
    summary = {
        "duration_sec": round(time.time() - t0, 2),
        "synthetic": args.synthetic,
        "chunks": len(chunks),
        "entities": neo_stats["entities"],
        "relationships": neo_stats["relationships"],
        "pg_inserted": pg_inserted,
        "hybrid_query": query,
        "hybrid_score": payload["score"],
        "hybrid_chunks": len(payload["chunks"]),
        "hybrid_graph_nodes": len(payload["graph_context"].get("nodes", [])),
    }
    print(json.dumps(summary, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
