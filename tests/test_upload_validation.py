import pytest

from services.exceptions import InvalidDocumentError
from services.ingestion_service import validate_pdf_upload


def test_rejects_non_pdf_extension() -> None:
    with pytest.raises(InvalidDocumentError, match="Only PDF"):
        validate_pdf_upload("notes.txt", b"%PDF-1.7")


def test_rejects_content_without_pdf_header() -> None:
    with pytest.raises(InvalidDocumentError, match="not a valid PDF"):
        validate_pdf_upload("notes.pdf", b"not a pdf")


def test_accepts_pdf_header() -> None:
    validate_pdf_upload("notes.pdf", b"%PDF-1.7\nexample")
