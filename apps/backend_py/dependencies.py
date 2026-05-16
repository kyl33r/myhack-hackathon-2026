from __future__ import annotations

import os

import google.generativeai as genai
from google.cloud import firestore

from services.store import AbstractStore
from services.stub_store import StubStore
from services.firestore_store import FirestoreStore

_STUB_DB = os.getenv("STUB_DB", "false").lower() == "true"

# Singletons — instantiated once at startup
_stub_store: StubStore | None = None


def get_store() -> AbstractStore:
    global _stub_store
    if _STUB_DB:
        if _stub_store is None:
            _stub_store = StubStore()
        return _stub_store
    return FirestoreStore(firestore.AsyncClient())


def get_gemini_client() -> genai.GenerativeModel:
    api_key = os.getenv("GEMINI_API_KEY")
    genai.configure(api_key=api_key)
    return genai.GenerativeModel("gemini-1.5-flash")
