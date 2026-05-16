from __future__ import annotations

import os

import google.generativeai as genai
from google.cloud import firestore


def get_firestore_client() -> firestore.AsyncClient:
    """Lazily instantiate and return an async Firestore client."""
    return firestore.AsyncClient()


def get_gemini_client() -> genai.GenerativeModel:
    """Lazily instantiate and return a Gemini GenerativeModel client."""
    api_key = os.getenv("GEMINI_API_KEY")
    genai.configure(api_key=api_key)
    return genai.GenerativeModel("gemini-1.5-flash")
