#!/usr/bin/env python3
"""pgvector_client.py

PostgreSQL + pgvector storage for text chunks and their sentence-transformer
embeddings.  Schema is created on first connect.
"""
from __future__ import annotations

import logging
import os
from contextlib import contextmanager
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict, Iterable, Iterator, List, Optional

logger = logging.getLogger("pgvector_client")

# ── embedding model (384-dim) ─────────────────────────────────────────────
EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"
EMBEDDING_DIM = 384


def _load_env_file(path: Path) -> None:
    """Tiny ``.env`` loader so we don't require python-dotenv at import time."""
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


@dataclass
class SearchResult:
    chunk_id: int
    notebook_id: str
    source_id: str
    chunk_index: int
    text: str
    metadata: Dict[str, Any]
    distance: float


class PgvectorClient:
    """Thin wrapper over psycopg2 + pgvector + sentence-transformers."""

    def __init__(
        self,
        connection_string: Optional[str] = None,
        embedding_model: str = EMBEDDING_MODEL,
    ) -> None:
        self.connection_string = connection_string or os.environ.get("PGVECTOR_CONNECTION")
        if not self.connection_string:
            raise ValueError("PGVECTOR_CONNECTION is required")
        self.embedding_model_name = embedding_model
        self._model: Any = None
        self._pool: Any = None

    # ── helpers ──────────────────────────────────────────────────────────
    @contextmanager
    def _conn(self) -> Iterator[Any]:
        import psycopg2
        from psycopg2.extras import RealDictCursor
        from psycopg2.pool import ThreadedConnectionPool

        if self._pool is None:
            self._pool = ThreadedConnectionPool(1, 10, self.connection_string)

        conn = self._pool.getconn()
        try:
            yield conn
        finally:
            self._pool.putconn(conn)

    @property
    def model(self) -> Any:
        if self._model is None:
            from sentence_transformers import SentenceTransformer

            logger.info("loading embedding model: %s", self.embedding_model_name)
            self._model = SentenceTransformer(self.embedding_model_name)
        return self._model

    def embed(self, texts: List[str]) -> List[List[float]]:
        if not texts:
            return []
        vectors = self.model.encode(texts, convert_to_numpy=True, show_progress_bar=False)
        return [v.tolist() for v in vectors]

    # ── schema ───────────────────────────────────────────────────────────
    def init_schema(self) -> None:
        with self._conn() as conn:
            with conn.cursor() as cur:
                cur.execute("CREATE EXTENSION IF NOT EXISTS vector;")
                cur.execute(
                    """
                    CREATE TABLE IF NOT EXISTS chunks (
                        id SERIAL PRIMARY KEY,
                        notebook_id TEXT,
                        source_id TEXT,
                        chunk_index INTEGER,
                        text TEXT NOT NULL,
                        metadata JSONB,
                        embedding vector(%s),
                        created_at TIMESTAMP DEFAULT NOW()
                    );
                    """,
                    (EMBEDDING_DIM,),
                )
                # ANN index — HNSW is robust for both small and large corpora
                # (IVFFlat needs training data and a lists count that scales
                # with row count, which makes it brittle for dev workloads).
                cur.execute(
                    """
                    CREATE INDEX IF NOT EXISTS chunks_embedding_hnsw
                        ON chunks USING hnsw (embedding vector_cosine_ops);
                    """
                )
            conn.commit()
        logger.info("pgvector schema ready (%d-dim, HNSW index)", EMBEDDING_DIM)

    # ── insert ───────────────────────────────────────────────────────────
    def insert_chunks(self, chunks: Iterable[Any]) -> int:
        """Insert ``Chunk`` dataclasses/dicts.  Returns the number of rows."""
        rows: List[tuple] = []
        texts: List[str] = []
        for ch in chunks:
            if isinstance(ch, dict):
                txt = ch["text"]
                nb = ch.get("notebook_id", "")
                src = ch.get("source_id", "")
                idx = ch.get("chunk_index", 0)
                meta = ch.get("metadata") or {}
            else:
                txt = getattr(ch, "text")
                nb = getattr(ch, "notebook_id", "")
                src = getattr(ch, "source_id", "")
                idx = getattr(ch, "chunk_index", 0)
                meta = getattr(ch, "metadata", None) or {}
            texts.append(txt)
            rows.append((nb, src, idx, txt, _json_dumps(meta)))
        if not rows:
            return 0

        EMBED_BATCH_SIZE = 128
        embeddings = []
        for i in range(0, len(texts), EMBED_BATCH_SIZE):
            batch_texts = texts[i:i + EMBED_BATCH_SIZE]
            embeddings.extend(self.embed(batch_texts))
        if len(embeddings) != len(rows):
            raise RuntimeError("embedding count mismatch")

        import psycopg2.extras

        with self._conn() as conn:
            with conn.cursor() as cur:
                psycopg2.extras.execute_values(
                    cur,
                    """
                    INSERT INTO chunks
                        (notebook_id, source_id, chunk_index, text, metadata, embedding)
                    VALUES %s
                    """,
                    [
                        (nb, src, idx, txt, meta, emb)
                        for (nb, src, idx, txt, meta), emb in zip(rows, embeddings)
                    ],
                    template="(%s, %s, %s, %s, %s::jsonb, %s::vector)",
                )
            conn.commit()
        logger.info("inserted %d chunk(s)", len(rows))
        return len(rows)

    # ── search ───────────────────────────────────────────────────────────
    def search(self, query: str, top_k: int = 5) -> List[SearchResult]:
        if not query.strip():
            return []
        qvec = self.embed([query])[0]
        with self._conn() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT id, notebook_id, source_id, chunk_index, text, metadata,
                           embedding <=> %s::vector AS distance
                    FROM chunks
                    ORDER BY embedding <=> %s::vector
                    LIMIT %s;
                    """,
                    (qvec, qvec, top_k),
                )
                rows = cur.fetchall()
        return [
            SearchResult(
                chunk_id=r[0],
                notebook_id=r[1] or "",
                source_id=r[2] or "",
                chunk_index=r[3] or 0,
                text=r[4] or "",
                metadata=_json_loads(r[5]),
                distance=float(r[6] or 0.0),
            )
            for r in rows
        ]

    # ── maintenance ──────────────────────────────────────────────────────
    def truncate(self) -> None:
        with self._conn() as conn:
            with conn.cursor() as cur:
                cur.execute("TRUNCATE TABLE chunks RESTART IDENTITY;")
            conn.commit()


def _json_dumps(obj: Any) -> str:
    import json

    return json.dumps(obj, ensure_ascii=False, default=str)


def _json_loads(value: Any) -> Dict[str, Any]:
    import json

    if value is None:
        return {}
    if isinstance(value, dict):
        return value
    if isinstance(value, (bytes, bytearray)):
        value = value.decode("utf-8")
    try:
        return json.loads(value)
    except (TypeError, ValueError):
        return {}


if __name__ == "__main__":  # pragma: no cover - manual smoke
    logging.basicConfig(level=logging.INFO)
    client = PgvectorClient()
    client.init_schema()
    print("schema ready")
