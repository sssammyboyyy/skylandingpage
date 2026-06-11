#!/usr/bin/env python3
"""notebooklm_ingester.py

Spawns the `notebooklm-mcp.exe` MCP server over stdio JSON-RPC, lists all
notebooks, retrieves each notebook's sources, and extracts raw text from each
source.  The extracted text is then chunked (~512 tokens with overlap) and
returned as a list of `Chunk` dicts.

Mirrors the TS reference implementation at
``graphindex/src/context/notebooklm-bridge.ts``.
"""
from __future__ import annotations

import json
import logging
import os
import re
import subprocess
import sys
import threading
from dataclasses import dataclass, field, asdict
from pathlib import Path
from typing import Any, Dict, List, Optional

logger = logging.getLogger("notebooklm_ingester")

# Default install location of the MCP server binary.
DEFAULT_MCP_BIN = (
    r"C:\Users\samue\OneDrive\Documents\projects\AIBoyz\scripts\python\.venv\Scripts"
    r"\notebooklm-mcp.exe"
)

# Approximate tokens-per-word for English text.  Real tokenizers are model
# specific; for chunking purposes a 0.75 ratio is a reasonable middle ground.
WORDS_PER_TOKEN = 0.75

CHUNK_TARGET_TOKENS = 512
CHUNK_OVERLAP_TOKENS = 64


@dataclass
class Chunk:
    text: str
    source_id: str
    notebook_id: str
    chunk_index: int
    metadata: Dict[str, Any] = field(default_factory=dict)


# ── JSON-RPC client (newline-delimited, mirrors TS bridge) ────────────────
class McpClient:
    """Minimal MCP stdio JSON-RPC client."""

    def __init__(self, bin_path: str) -> None:
        self.bin_path = bin_path
        self._proc: Optional[subprocess.Popen] = None
        self._buffer = ""
        self._next_id = 1
        self._pending: Dict[int, "_Pending"] = {}
        self._lock = threading.Lock()
        self._ready = False

    # ── lifecycle ────────────────────────────────────────────────────────
    def start(self) -> None:
        if self._proc is not None:
            return
        if not Path(self.bin_path).exists():
            raise FileNotFoundError(
                f"MCP binary not found at {self.bin_path}. "
                "Set NOTEBOOKLM_MCP_BIN env var to override."
            )
        logger.info("spawning MCP server: %s", self.bin_path)
        env = os.environ.copy()
        env["PYTHONUNBUFFERED"] = "1"
        env["PYTHONUTF8"] = "1"
        self._proc = subprocess.Popen(
            [self.bin_path],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            encoding="utf-8",
            bufsize=1,
            env=env,
        )
        threading.Thread(target=self._drain_stderr, daemon=True).start()
        threading.Thread(target=self._drain_stdout, daemon=True).start()

        # MCP initialize handshake
        init_result = self._request(
            "initialize",
            {
                "protocolVersion": "2024-11-05",
                "capabilities": {},
                "clientInfo": {"name": "knowledge_extraction", "version": "0.1.0"},
            },
        )
        logger.info("MCP initialised: %s", init_result.get("serverInfo"))
        self._notify("notifications/initialized", {})
        self._ready = True

    def stop(self) -> None:
        if self._proc is not None:
            try:
                self._proc.terminate()
            except Exception:  # pragma: no cover - best effort
                pass
            self._proc = None
            self._ready = False

    # ── request/notify plumbing ──────────────────────────────────────────
    def _drain_stderr(self) -> None:
        assert self._proc and self._proc.stderr
        for line in self._proc.stderr:
            line = line.rstrip()
            if line:
                logger.debug("mcp_stderr: %s", line[:400])

    def _drain_stdout(self) -> None:
        assert self._proc and self._proc.stdout
        for raw in self._proc.stdout:
            self._buffer += raw
            while True:
                idx = self._buffer.find("\n")
                if idx < 0:
                    break
                line = self._buffer[:idx].strip()
                self._buffer = self._buffer[idx + 1 :]
                if not line:
                    continue
                try:
                    msg = json.loads(line)
                except json.JSONDecodeError as exc:
                    logger.warning("mcp_parse_error: %s (line=%r)", exc, line[:200])
                    continue
                msg_id = msg.get("id")
                if isinstance(msg_id, int) and msg_id in self._pending:
                    pending = self._pending.pop(msg_id)
                    if "error" in msg:
                        pending.future.set_exception(
                            RuntimeError(json.dumps(msg["error"]))
                        )
                    else:
                        pending.future.set_result(msg.get("result"))

    def _request(self, method: str, params: Dict[str, Any]) -> Dict[str, Any]:
        from concurrent.futures import Future

        if not self._proc or not self._proc.stdin:
            raise RuntimeError("MCP not started")
        with self._lock:
            msg_id = self._next_id
            self._next_id += 1
        fut: "Future[Dict[str, Any]]" = Future()
        self._pending[msg_id] = _Pending(fut)
        payload = {"jsonrpc": "2.0", "id": msg_id, "method": method, "params": params}
        self._proc.stdin.write(json.dumps(payload) + "\n")
        self._proc.stdin.flush()
        return fut.result(timeout=120)

    def _notify(self, method: str, params: Dict[str, Any]) -> None:
        if not self._proc or not self._proc.stdin:
            return
        payload = {"jsonrpc": "2.0", "method": method, "params": params}
        self._proc.stdin.write(json.dumps(payload) + "\n")
        self._proc.stdin.flush()

    # ── high-level helper ────────────────────────────────────────────────
    def call_tool(self, name: str, arguments: Dict[str, Any]) -> Any:
        if not self._ready:
            self.start()
        return self._request("tools/call", {"name": name, "arguments": arguments})


@dataclass
class _Pending:
    from concurrent.futures import Future

    future: "Future"


# ── response text extraction (mirrors TS `r.content` parsing) ─────────────
def _extract_text(result: Any) -> str:
    """Pull the joined ``text`` payload out of an MCP tool result.

    The shape is ``{content: [{type: "text", text: "<string>"}, ...]}``.
    """
    content = (result or {}).get("content")
    if not isinstance(content, list):
        return ""
    parts = []
    for item in content:
        if isinstance(item, dict) and isinstance(item.get("text"), str):
            parts.append(item["text"])
    return "\n".join(parts)


# ── notebook / source listing (handles JSON array *or* line-list) ────────
def parse_notebook_list(result: Any) -> List[Dict[str, str]]:
    """Return a list of ``{id, title}`` dicts from a ``notebook_list`` result.

    Handles two response shapes:

    * JSON array of notebook objects (``[{id, title, ...}, ...]``)
    * Newline-delimited ``"Title  <id>"`` text list (fallback)
    """
    text = _extract_text(result)
    if not text:
        return []
    # Try JSON first
    try:
        parsed = json.loads(text)
        if isinstance(parsed, list):
            return [
                {
                    "id": str(n.get("id") or n.get("notebook_id") or ""),
                    "title": str(n.get("title") or n.get("name") or "(untitled)"),
                }
                for n in parsed
            ]
    except json.JSONDecodeError:
        pass
    # Fall back to line-list parsing
    out: List[Dict[str, str]] = []
    for raw in text.splitlines():
        line = raw.strip()
        if not line:
            continue
        m = re.match(r"^(.+?)\s+([0-9a-fA-F-]{8,})\s*$", line)
        if m:
            out.append({"title": m.group(1).strip(), "id": m.group(2).strip()})
        else:
            out.append({"title": line, "id": ""})
    return out


def parse_source_list(result: Any) -> List[Dict[str, str]]:
    """Return ``[{"id": ..., "title": ...}]`` from a ``notebook_get`` result."""
    text = _extract_text(result)
    if not text:
        return []
    # Try JSON
    try:
        parsed = json.loads(text)
        if isinstance(parsed, dict):
            sources = parsed.get("sources") or parsed.get("data") or []
        elif isinstance(parsed, list):
            sources = parsed
        else:
            sources = []
        if sources:
            return [
                {
                    "id": str(s.get("id") or s.get("source_id") or ""),
                    "title": str(s.get("title") or s.get("name") or "(source)"),
                }
                for s in sources
            ]
    except json.JSONDecodeError:
        pass
    # Fall back to line parsing
    out: List[Dict[str, str]] = []
    for raw in text.splitlines():
        line = raw.strip()
        if not line:
            continue
        m = re.match(r"^(.+?)\s+([0-9a-fA-F-]{8,})\s*$", line)
        if m:
            out.append({"title": m.group(1).strip(), "id": m.group(2).strip()})
        else:
            out.append({"title": line, "id": ""})
    return out


# ── text chunking (~512 tokens, sliding-window overlap) ───────────────────
def _word_count(text: str) -> int:
    return len(text.split())


def chunk_text(
    text: str,
    target_tokens: int = CHUNK_TARGET_TOKENS,
    overlap_tokens: int = CHUNK_OVERLAP_TOKENS,
) -> List[str]:
    """Split ``text`` into overlapping word-based chunks."""
    if not text:
        return []
    target_words = max(1, int(target_tokens * WORDS_PER_TOKEN))
    overlap_words = max(0, int(overlap_tokens * WORDS_PER_TOKEN))
    words = text.split()
    if len(words) <= target_words:
        return [text.strip()] if text.strip() else []
    step = max(1, target_words - overlap_words)
    chunks: List[str] = []
    for start in range(0, len(words), step):
        piece = words[start : start + target_words]
        if not piece:
            break
        joined = " ".join(piece).strip()
        if joined:
            chunks.append(joined)
        if start + target_words >= len(words):
            break
    return chunks


# ── high-level ingester ───────────────────────────────────────────────────
@dataclass
class IngesterConfig:
    mcp_bin: str = os.environ.get("NOTEBOOKLM_MCP_BIN", DEFAULT_MCP_BIN)
    notebook_limit: Optional[int] = None  # for testing
    source_limit: Optional[int] = None    # for testing
    chunk_target_tokens: int = CHUNK_TARGET_TOKENS
    chunk_overlap_tokens: int = CHUNK_OVERLAP_TOKENS


class NotebookLMIngester:
    """End-to-end ingester: notebooks → sources → text → chunks."""

    def __init__(self, config: Optional[IngesterConfig] = None) -> None:
        self.config = config or IngesterConfig()
        self._client = McpClient(self.config.mcp_bin)

    def __enter__(self) -> "NotebookLMIngester":
        self._client.start()
        return self

    def __exit__(self, *exc: Any) -> None:
        self._client.stop()

    # ── public API ───────────────────────────────────────────────────────
    def list_notebooks(self) -> List[Dict[str, str]]:
        result = self._client.call_tool(
            "notebook_list", {"max_results": 100}
        )
        return parse_notebook_list(result)

    def list_sources(self, notebook_id: str) -> List[Dict[str, str]]:
        result = self._client.call_tool(
            "notebook_get", {"notebook_id": notebook_id}
        )
        return parse_source_list(result)

    def get_source_text(self, source_id: str) -> str:
        result = self._client.call_tool(
            "source_get_content", {"source_id": source_id}
        )
        return _extract_text(result)

    def ingest(self) -> List[Chunk]:
        """Run the full ingestion pipeline and return the list of chunks."""
        notebooks = self.list_notebooks()
        if self.config.notebook_limit is not None:
            notebooks = notebooks[: self.config.notebook_limit]
        logger.info("ingesting %d notebook(s)", len(notebooks))

        chunks: List[Chunk] = []
        for nb in notebooks:
            nb_id = nb["id"]
            nb_title = nb["title"]
            try:
                sources = self.list_sources(nb_id)
            except Exception as exc:
                logger.warning("notebook_get failed for %s: %s", nb_id, exc)
                continue
            if self.config.source_limit is not None:
                sources = sources[: self.config.source_limit]
            logger.info(
                "notebook %s (%s) → %d source(s)", nb_id, nb_title, len(sources)
            )
            from concurrent.futures import ThreadPoolExecutor, as_completed

            def _process_source(src: Dict[str, str]) -> List[Chunk]:
                src_id = src["id"]
                if not src_id:
                    return []
                try:
                    text = self.get_source_text(src_id)
                except Exception as exc:
                    logger.warning("source_get_content failed for %s: %s", src_id, exc)
                    return []
                res = []
                for idx, piece in enumerate(
                    chunk_text(
                        text,
                        target_tokens=self.config.chunk_target_tokens,
                        overlap_tokens=self.config.chunk_overlap_tokens,
                    )
                ):
                    res.append(
                        Chunk(
                            text=piece,
                            source_id=src_id,
                            notebook_id=nb_id,
                            chunk_index=idx,
                            metadata={
                                "notebook_title": nb_title,
                                "source_title": src["title"],
                            },
                        )
                    )
                return res

            with ThreadPoolExecutor(max_workers=4) as ex:
                futures = [ex.submit(_process_source, src) for src in sources]
                for fut in as_completed(futures):
                    try:
                        chunks.extend(fut.result())
                    except Exception as exc:
                        logger.warning("source processing failed: %s", exc)
        logger.info("ingest complete: %d chunk(s)", len(chunks))
        return chunks


# ── CLI entry ─────────────────────────────────────────────────────────────
def main() -> int:
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s %(levelname)s %(name)s: %(message)s",
    )
    ingester = NotebookLMIngester()
    try:
        with ingester:
            chunks = ingester.ingest()
    except Exception as exc:
        logger.error("ingest failed: %s", exc)
        return 1
    json.dump(
        [asdict(c) for c in chunks],
        sys.stdout,
        ensure_ascii=False,
        indent=2,
    )
    sys.stdout.write("\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
