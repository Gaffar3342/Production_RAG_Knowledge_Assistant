from pathlib import Path

from config import get_settings
from services import document_repository


def test_document_repository_persists_metadata(tmp_path: Path, monkeypatch) -> None:
    settings = get_settings()
    monkeypatch.setattr(type(settings), "data_dir", property(lambda _: tmp_path))
    document_repository.initialize_database()
    document_repository.create_document("doc-1", "guide.pdf", "doc-1.pdf", "hash-1")

    documents = document_repository.list_documents()

    assert documents[0]["id"] == "doc-1"
    assert documents[0]["original_filename"] == "guide.pdf"
