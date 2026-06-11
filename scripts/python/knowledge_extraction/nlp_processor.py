#!/usr/bin/env python3
"""nlp_processor.py

Wraps spaCy's ``en_core_web_sm`` to extract named entities and lightweight
subject-verb-object / preposition-based relation triples from text chunks.
"""
from __future__ import annotations

import hashlib
import logging
import re
from dataclasses import dataclass, field, asdict
from typing import Any, Dict, Iterable, List, Tuple

logger = logging.getLogger("nlp_processor")

ENTITY_LABELS = {
    "PERSON",
    "ORG",
    "GPE",
    "PRODUCT",
    "EVENT",
    "WORK_OF_ART",
    "LAW",
    "LOC",
    "NORP",
    "FAC",
}

# Mapping spaCy NER label → graph node label suffix (kept readable for
# downstream Cypher queries; multi-word labels are normalised by spaCy too).
LABEL_TO_NODE_LABEL = {
    "PERSON": "Person",
    "ORG": "Organization",
    "GPE": "Place",
    "PRODUCT": "Product",
    "EVENT": "Event",
    "WORK_OF_ART": "WorkOfArt",
    "LAW": "Law",
    "LOC": "Place",
    "NORP": "Group",
    "FAC": "Facility",
}


@dataclass
class Entity:
    id: str
    text: str
    label: str
    chunk_id: str
    notebook_id: str
    source_id: str
    node_label: str = ""


@dataclass
class Relationship:
    subject_entity_id: str
    predicate: str
    object_entity_id: str
    chunk_id: str
    confidence: float = 0.5


@dataclass
class ProcessedChunk:
    chunk_id: str
    notebook_id: str
    source_id: str
    text: str
    entities: List[Entity] = field(default_factory=list)
    relationships: List[Relationship] = field(default_factory=list)


# ── chunk ID helper ───────────────────────────────────────────────────────
def make_chunk_id(notebook_id: str, source_id: str, chunk_index: int) -> str:
    raw = f"{notebook_id}:{source_id}:{chunk_index}"
    return hashlib.sha1(raw.encode("utf-8")).hexdigest()[:16]


def _entity_id(chunk_id: str, text: str, label: str, span_start: int) -> str:
    raw = f"{chunk_id}:{label}:{text.lower()}:{span_start}"
    return hashlib.sha1(raw.encode("utf-8")).hexdigest()[:16]


# ── core processor ────────────────────────────────────────────────────────
class NLPProcessor:
    """spaCy-based NER + relation extraction."""

    def __init__(self, model: str = "en_core_web_sm") -> None:
        try:
            import spacy
        except ImportError as exc:  # pragma: no cover
            raise RuntimeError(
                "spaCy is not installed.  Run `pip install spacy` and "
                "`python -m spacy download en_core_web_sm`."
            ) from exc
        try:
            self.nlp = spacy.load(model)
        except OSError as exc:
            raise RuntimeError(
                f"spaCy model '{model}' not found.  Install it with "
                f"`python -m spacy download {model}`."
            ) from exc
        # Use the full default pipeline — disabling pipes (e.g. the
        # lemmatizer) has been observed to break the parser, so we keep the
        # canonical English pipeline intact.

    # ── public API ───────────────────────────────────────────────────────
    def process(
        self,
        chunks: Iterable[Any],
    ) -> List[ProcessedChunk]:
        """Process a list of Chunk dicts (or Chunk dataclasses)."""
        chunks_list = list(chunks)
        texts = []
        meta = []
        for ch in chunks_list:
            chunk_id, nb_id, src_id, text, _ = self._normalise_chunk(ch)
            texts.append(text)
            meta.append((chunk_id, nb_id, src_id, text))

        out: List[ProcessedChunk] = []
        docs = self.nlp.pipe(texts, batch_size=50)
        for doc, (chunk_id, nb_id, src_id, text) in zip(docs, meta):
            if not text.strip():
                out.append(ProcessedChunk(
                    chunk_id=chunk_id,
                    notebook_id=nb_id,
                    source_id=src_id,
                    text=text,
                ))
                continue
            entities = self._extract_entities(doc, chunk_id, nb_id, src_id)
            relationships = self._extract_relations(doc, entities, chunk_id)
            out.append(ProcessedChunk(
                chunk_id=chunk_id,
                notebook_id=nb_id,
                source_id=src_id,
                text=text,
                entities=entities,
                relationships=relationships,
            ))
        return out

    # ── internals ────────────────────────────────────────────────────────
    def _normalise_chunk(self, ch: Any) -> Tuple[str, str, str, str, int]:
        """Return (chunk_id, notebook_id, source_id, text, chunk_index)."""
        if isinstance(ch, dict):
            text = ch.get("text", "")
            notebook_id = ch.get("notebook_id", "")
            source_id = ch.get("source_id", "")
            idx = ch.get("chunk_index", 0)
        else:
            text = getattr(ch, "text", "")
            notebook_id = getattr(ch, "notebook_id", "")
            source_id = getattr(ch, "source_id", "")
            idx = getattr(ch, "chunk_index", 0)
        chunk_id = make_chunk_id(notebook_id, source_id, idx)
        return chunk_id, notebook_id, source_id, text, idx

    def _extract_entities(
        self,
        doc: Any,
        chunk_id: str,
        nb_id: str,
        src_id: str,
    ) -> List[Entity]:
        entities: List[Entity] = []
        seen: Dict[Tuple[str, int], Entity] = {}
        for ent in doc.ents:
            if ent.label_ not in ENTITY_LABELS:
                continue
            clean = _normalise_entity_text(ent.text)
            if not clean:
                continue
            key = (clean.lower(), ent.start_char)
            if key in seen:
                continue
            ent_id = _entity_id(chunk_id, clean, ent.label_, ent.start_char)
            node_label = LABEL_TO_NODE_LABEL.get(ent.label_, "Entity")
            ent_obj = Entity(
                id=ent_id,
                text=clean,
                label=ent.label_,
                chunk_id=chunk_id,
                notebook_id=nb_id,
                source_id=src_id,
                node_label=node_label,
            )
            seen[key] = ent_obj
            entities.append(ent_obj)
        return entities

    def _extract_relations(
        self,
        doc: Any,
        entities: List[Entity],
        chunk_id: str,
    ) -> List[Relationship]:
        if not entities:
            return []
        # Index entities by all of their tokens (multi-word entities like
        # "San Francisco" need their head token to be reachable for SVO).
        token_index: Dict[int, Entity] = {}
        text_to_ent: Dict[str, Entity] = {}
        for ent in entities:
            words = ent.text.split()
            if not words:
                continue
            text_to_ent[words[0].lower()] = ent
            text_to_ent[words[-1].lower()] = ent
            
        for tok in doc:
            tok_text = tok.text.lower()
            if tok_text in text_to_ent:
                token_index[tok.i] = text_to_ent[tok_text]
        if not token_index:
            return []

        rels: List[Relationship] = []
        seen: set = set()

        def add_rel(subj: Entity, pred: str, obj: Entity, conf: float) -> None:
            if subj.id == obj.id:
                return
            key = (subj.id, pred.lower(), obj.id)
            if key in seen:
                return
            seen.add(key)
            rels.append(
                Relationship(
                    subject_entity_id=subj.id,
                    predicate=pred,
                    object_entity_id=obj.id,
                    chunk_id=chunk_id,
                    confidence=conf,
                )
            )

        for tok in doc:
            if tok.dep_ not in ("nsubj", "nsubjpass"):
                continue
            subj = token_index.get(tok.i)
            if subj is None:
                continue
            head = tok.head
            if head is None or head.pos_ not in ("VERB", "AUX"):
                continue
            # Direct object / predicative complement
            for child in head.children:
                if child.dep_ in ("dobj", "attr", "oprd"):
                    obj = token_index.get(child.i)
                    if obj is not None and obj.id != subj.id:
                        add_rel(subj, head.lemma_.lower(), obj, 0.7)
                elif child.dep_ == "prep":
                    for grand in child.children:
                        if grand.dep_ in ("pobj", "conj"):
                            obj = token_index.get(grand.i)
                            if obj is not None and obj.id != subj.id:
                                pred = f"{head.lemma_.lower()}_{child.text.lower()}"
                                add_rel(subj, pred, obj, 0.5)
        return rels


def _normalise_entity_text(text: str) -> str:
    """Trim punctuation/whitespace and strip leading articles."""
    if not text:
        return ""
    cleaned = re.sub(r"\s+", " ", text).strip(" .,;:!?'\"()[]{}")
    return cleaned


# ── CLI entry ─────────────────────────────────────────────────────────────
def main() -> int:
    import json
    import sys
    from notebooklm_ingester import NotebookLMIngester

    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s %(levelname)s %(name)s: %(message)s",
    )
    with NotebookLMIngester() as ing:
        chunks = ing.ingest()
    proc = NLPProcessor()
    processed = proc.process(chunks)
    json.dump(
        [
            {
                "chunk_id": pc.chunk_id,
                "notebook_id": pc.notebook_id,
                "source_id": pc.source_id,
                "text": pc.text[:120],
                "entities": [asdict(e) for e in pc.entities],
                "relationships": [asdict(r) for r in pc.relationships],
            }
            for pc in processed
        ],
        sys.stdout,
        ensure_ascii=False,
        indent=2,
    )
    sys.stdout.write("\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
