import sqlite3
from pathlib import Path

from config import get_settings
from services.exceptions import DuplicateDocumentError


def _connect() -> sqlite3.Connection:
    settings = get_settings()
    settings.data_dir.mkdir(parents=True, exist_ok=True)
    connection = sqlite3.connect(settings.database_path)
    connection.row_factory = sqlite3.Row
    return connection


def initialize_database() -> None:
    with _connect() as connection:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS documents (
                id TEXT PRIMARY KEY,
                original_filename TEXT NOT NULL,
                stored_filename TEXT NOT NULL,
                sha256 TEXT NOT NULL UNIQUE,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
            """
        )


def find_by_hash(file_hash: str) -> dict | None:
    with _connect() as connection:
        row = connection.execute(
            "SELECT * FROM documents WHERE sha256 = ?", (file_hash,)
        ).fetchone()
    return dict(row) if row else None


def create_document(
    document_id: str, original_filename: str, stored_filename: str, file_hash: str
) -> None:
    try:
        with _connect() as connection:
            connection.execute(
                """
                INSERT INTO documents (id, original_filename, stored_filename, sha256)
                VALUES (?, ?, ?, ?)
                """,
                (document_id, original_filename, stored_filename, file_hash),
            )
    except sqlite3.IntegrityError as error:
        raise DuplicateDocumentError("This document has already been uploaded.") from error


def list_documents() -> list[dict]:
    with _connect() as connection:
        rows = connection.execute(
            "SELECT id, original_filename, created_at FROM documents ORDER BY created_at DESC"
        ).fetchall()
    return [dict(row) for row in rows]


def has_documents() -> bool:
    with _connect() as connection:
        row = connection.execute("SELECT 1 FROM documents LIMIT 1").fetchone()
    return row is not None


def delete_uploaded_file(path: Path) -> None:
    path.unlink(missing_ok=True)
