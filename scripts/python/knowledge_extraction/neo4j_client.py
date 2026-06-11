#!/usr/bin/env python3
"""neo4j_client.py

Stores the entities and relationships produced by ``nlp_processor`` in Neo4j
AuraDB.  The graph is keyed on entity ``id`` (a stable hash of the chunk +
surface form + label) so re-ingestion is idempotent.
"""
from __future__ import annotations

import logging
import os
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional

logger = logging.getLogger("neo4j_client")

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


@dataclass
class GraphHit:
    entity_id: str
    text: str
    label: str
    score: float


class Neo4jClient:
    def __init__(
        self,
        uri: Optional[str] = None,
        user: Optional[str] = None,
        password: Optional[str] = None,
        database: Optional[str] = None,
        trust_all_certs: Optional[bool] = None,
    ) -> None:
        self.uri = uri or os.environ.get("NEO4J_URI")
        if not self.uri:
            raise ValueError("NEO4J_URI is required")
        self.user = user or os.environ.get("NEO4J_USERNAME")
        self.password = password or os.environ.get("NEO4J_PASSWORD")
        if not self.password:
            raise ValueError("NEO4J_PASSWORD is required")
        self.database = database or os.environ.get("NEO4J_DATABASE", "neo4j")
        # Aura free-tier instances present self-signed certificates; the
        # `neo4j+s://` URI scheme requires CA validation which fails.  Allow
        # opt-in trust-all via env var (default off to keep production safe).
        if trust_all_certs is None:
            trust_all_certs = os.environ.get(
                "NEO4J_TRUST_ALL_CERTS", ""
            ).lower() in ("1", "true", "yes")
        self._trust_all_certs = trust_all_certs
        self._driver: Any = None

    # ── driver lifecycle ─────────────────────────────────────────────────
    @property
    def driver(self) -> Any:
        if self._driver is None:
            from neo4j import GraphDatabase

            logger.info("connecting to neo4j %s", self.uri)
            config: Dict[str, Any] = {
                "max_connection_pool_size": 10,
                "connection_timeout": 30,
            }
            uri = self.uri
            if self._trust_all_certs:
                # The driver forbids `trusted_certificates` when the URI
                # already encodes encryption (e.g. `+s`); rewrite the scheme
                # to the self-signed-cert variant so cert verification is
                # skipped at the protocol layer instead.
                uri = self._rewrite_to_ssc(self.uri)
                logger.warning(
                    "NEO4J_TRUST_ALL_CERTS enabled — using %s (self-signed "
                    "cert mode, no CA validation).", uri
                )
            self._driver = GraphDatabase.driver(
                uri,
                auth=(self.user, self.password),
                **config,
            )
        return self._driver

    @staticmethod
    def _rewrite_to_ssc(uri: str) -> str:
        """Translate a `+s` URI to the `+ssc` (self-signed) variant."""
        for variant in ("neo4j+s://", "bolt+s://"):
            if uri.startswith(variant):
                return "neo4j+ssc://" + uri[len(variant):]
        # Already ssc or bolt-only — return as-is.
        return uri

    def close(self) -> None:
        if self._driver is not None:
            self._driver.close()
            self._driver = None

    def __enter__(self) -> "Neo4jClient":
        return self

    def __exit__(self, *exc: Any) -> None:
        self.close()

    # ── schema bootstrap ─────────────────────────────────────────────────
    def init_schema(self) -> None:
        prefix = os.environ.get("NEO4J_CONSTRAINT_PREFIX", "")
        constraints = [
            f"CREATE CONSTRAINT {prefix}entity_id IF NOT EXISTS FOR (n:Entity) REQUIRE n.id IS UNIQUE",
            f"CREATE CONSTRAINT {prefix}person_id IF NOT EXISTS FOR (n:Person) REQUIRE n.id IS UNIQUE",
            f"CREATE CONSTRAINT {prefix}org_id IF NOT EXISTS FOR (n:Organization) REQUIRE n.id IS UNIQUE",
            f"CREATE CONSTRAINT {prefix}place_id IF NOT EXISTS FOR (n:Place) REQUIRE n.id IS UNIQUE",
            f"CREATE CONSTRAINT {prefix}product_id IF NOT EXISTS FOR (n:Product) REQUIRE n.id IS UNIQUE",
            f"CREATE CONSTRAINT {prefix}event_id IF NOT EXISTS FOR (n:Event) REQUIRE n.id IS UNIQUE",
            f"CREATE CONSTRAINT {prefix}work_id IF NOT EXISTS FOR (n:WorkOfArt) REQUIRE n.id IS UNIQUE",
            f"CREATE CONSTRAINT {prefix}law_id IF NOT EXISTS FOR (n:Law) REQUIRE n.id IS UNIQUE",
            f"CREATE CONSTRAINT {prefix}group_id IF NOT EXISTS FOR (n:Group) REQUIRE n.id IS UNIQUE",
            f"CREATE CONSTRAINT {prefix}fac_id IF NOT EXISTS FOR (n:Facility) REQUIRE n.id IS UNIQUE",
        ]
        with self.driver.session(database=self.database) as session:
            for stmt in constraints:
                session.run(stmt)
        logger.info("neo4j constraints ensured")

    # ── ingest helpers ───────────────────────────────────────────────────
    def _cypher_label(self, node_label: str) -> str:
        # Cypher labels are identifier-safe; we already restrict the values
        # in nlp_processor.LABEL_TO_NODE_LABEL, but be defensive.
        safe = "".join(ch for ch in node_label if ch.isalnum() or ch == "_")
        return safe or "Entity"

    def upsert_entities(self, entities: Iterable[Any]) -> int:
        batch: List[Dict[str, Any]] = []
        for e in entities:
            if isinstance(e, dict):
                batch.append(
                    {
                        "id": e["id"],
                        "text": e["text"],
                        "label": e["label"],
                        "node_label": e.get("node_label") or "Entity",
                        "chunk_id": e.get("chunk_id", ""),
                        "notebook_id": e.get("notebook_id", ""),
                        "source_id": e.get("source_id", ""),
                    }
                )
            else:
                batch.append(
                    {
                        "id": e.id,
                        "text": e.text,
                        "label": e.label,
                        "node_label": getattr(e, "node_label", None) or "Entity",
                        "chunk_id": getattr(e, "chunk_id", ""),
                        "notebook_id": getattr(e, "notebook_id", ""),
                        "source_id": getattr(e, "source_id", ""),
                    }
                )
        if not batch:
            return 0
        # Validate labels to avoid Cypher injection on user-supplied values.
        for b in batch:
            b["node_label"] = self._cypher_label(b["node_label"])

        query = """
        UNWIND $rows AS row
        CALL apoc.merge.node(
            [row.node_label, 'Entity'],
            {id: row.id},
            {text: row.text, label: row.label,
             chunk_id: row.chunk_id, notebook_id: row.notebook_id,
             source_id: row.source_id},
            {}
        ) YIELD node
        RETURN count(node) AS n
        """
        # Fall back to plain Cypher if APOC isn't available.
        try:
            with self.driver.session(database=self.database) as session:
                result = session.run(query, rows=batch).single()
                return int(result["n"]) if result else 0
        except Exception as exc:
            logger.warning("apoc path failed (%s); using plain Cypher", exc)
            # Simpler reliable fallback: explicit MERGE per label.
            return self._upsert_entities_plain(batch)

    def _upsert_entities_plain(self, batch: List[Dict[str, Any]]) -> int:
        # Group by node_label so we can do one MERGE per group.
        groups: Dict[str, List[Dict[str, Any]]] = {}
        for b in batch:
            groups.setdefault(b["node_label"], []).append(b)
        total = 0
        with self.driver.session(database=self.database) as session:
            for label, rows in groups.items():
                query = f"""
                UNWIND $rows AS row
                MERGE (e:Entity {{id: row.id}})
                ON CREATE SET e.text = row.text, e.label = row.label,
                              e.chunk_id = row.chunk_id,
                              e.notebook_id = row.notebook_id,
                              e.source_id = row.source_id,
                              e.created_at = timestamp()
                ON MATCH SET  e.text = row.text, e.label = row.label
                WITH e, row
                MERGE (e:`{label}` {{id: row.id}})
                ON CREATE SET e.text = row.text
                RETURN count(e) AS n
                """
                result = session.run(query, rows=rows).single()
                total += int(result["n"]) if result else 0
        return total

    def upsert_relationships(self, rels: Iterable[Any]) -> int:
        batch: List[Dict[str, Any]] = []
        for r in rels:
            if isinstance(r, dict):
                batch.append(
                    {
                        "subj": r["subject_entity_id"],
                        "pred": r["predicate"],
                        "obj": r["object_entity_id"],
                        "chunk_id": r.get("chunk_id", ""),
                        "confidence": float(r.get("confidence", 0.5)),
                    }
                )
            else:
                batch.append(
                    {
                        "subj": r.subject_entity_id,
                        "pred": r.predicate,
                        "obj": r.object_entity_id,
                        "chunk_id": getattr(r, "chunk_id", ""),
                        "confidence": float(getattr(r, "confidence", 0.5)),
                    }
                )
        if not batch:
            return 0

        # Aggregate duplicates by (subj, pred, obj) to use the dynamic
        # relationship type.  Cypher doesn't allow parameterised rel types, so
        # we whitelist predicate characters and group by sanitised type.
        grouped: Dict[str, List[Dict[str, Any]]] = {}
        for b in batch:
            safe = "".join(
                ch if ch.isalnum() or ch == "_" else "_"
                for ch in b["pred"].upper()
            )[:40] or "RELATES"
            grouped.setdefault(safe, []).append({**b, "pred": safe})
        total = 0
        with self.driver.session(database=self.database) as session:
            for rel_type, rows in grouped.items():
                query = f"""
                UNWIND $rows AS row
                MATCH (a:Entity {{id: row.subj}})
                MATCH (b:Entity {{id: row.obj}})
                CALL (a, b, row) {{
                    MERGE (a)-[r:`{rel_type}` {{chunk_id: row.chunk_id}}]->(b)
                    ON CREATE SET r.confidence = row.confidence,
                                  r.created_at = timestamp()
                    ON MATCH SET  r.confidence = row.confidence
                    RETURN r
                }}
                RETURN count(*) AS n
                """
                result = session.run(query, rows=rows).single()
                total += int(result["n"]) if result else 0
        return total

    # ── search ───────────────────────────────────────────────────────────
    def graph_search(
        self,
        query: str | List[str],
        top_k: int = 5,
        depth: int = 1,
    ) -> Dict[str, Any]:
        """Fuzzy match entity text and return the matching subgraph."""
        terms = [query] if isinstance(query, str) else query
        terms = [t.strip().lower() for t in terms if t.strip()]
        if not terms:
            return {"nodes": [], "edges": []}
        with self.driver.session(database=self.database) as session:
            hits = session.run(
                """
                MATCH (e:Entity)
                WHERE toLower(e.text) IN $terms
                RETURN e.id AS id, e.text AS text, e.label AS label
                LIMIT $k
                """,
                terms=terms,
                k=top_k,
            ).data()
            if not hits:
                return {"nodes": [], "edges": []}
            ids = [h["id"] for h in hits]
            # Pull any relationship whose source/target is in the matched set.
            sub = session.run(
                """
                MATCH (e:Entity) WHERE e.id IN $ids
                OPTIONAL MATCH (e)-[r]->(n:Entity)
                WHERE n.id IN $ids
                RETURN e, r, n
                LIMIT 200
                """,
                ids=ids,
            ).data()
        nodes: Dict[str, Dict[str, Any]] = {}
        edges: List[Dict[str, Any]] = []
        for row in sub:
            # Neo4j Python driver returns Row objects; unpack defensively.
            try:
                e, r, n = row["e"], row["r"], row["n"]
            except (KeyError, TypeError):
                e = r = n = None
            if e is None:
                continue
            nodes[e["id"]] = {
                "id": e["id"],
                "text": e.get("text"),
                "label": e.get("label"),
            }
            if r is not None and n is not None:
                nodes[n["id"]] = {
                    "id": n["id"],
                    "text": n.get("text"),
                    "label": n.get("label"),
                }
                edges.append(
                    {
                        "source": e["id"],
                        "target": n["id"],
                        "type": r.type,
                        "confidence": r.get("confidence"),
                    }
                )
        return {"nodes": list(nodes.values()), "edges": edges}


if __name__ == "__main__":  # pragma: no cover - manual smoke
    logging.basicConfig(level=logging.INFO)
    with Neo4jClient() as client:
        client.init_schema()
        print("neo4j schema ready")
