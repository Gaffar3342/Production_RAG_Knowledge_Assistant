class DuplicateDocumentError(Exception):
    """Raised when an identical document is uploaded again."""


class InvalidDocumentError(Exception):
    """Raised when a file is not a usable text PDF."""


class KnowledgeBaseEmptyError(Exception):
    """Raised when a question is asked before any document is available."""
