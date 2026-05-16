from __future__ import annotations

import random
import string
from datetime import datetime, timezone


async def save_startup(client, startup_id: str, data: dict) -> None:
    """Write a startup document to the 'startups' Firestore collection."""
    doc_ref = client.collection("startups").document(startup_id)
    await doc_ref.set(data)


async def save_linkage(client, linkage: dict) -> None:
    """Write a linkage document to the 'linkages' Firestore collection."""
    linkage_id = linkage["linkage_id"]
    doc_ref = client.collection("linkages").document(linkage_id)
    await doc_ref.set(linkage)


async def get_all_linkages(client) -> list[dict]:
    """Fetch all documents from the 'linkages' Firestore collection."""
    docs = client.collection("linkages").stream()
    results: list[dict] = []
    async for doc in docs:
        results.append(doc.to_dict())
    return results


async def get_startup(client, startup_id: str) -> dict | None:
    """Fetch a single startup document by ID. Returns None if not found."""
    doc_ref = client.collection("startups").document(startup_id)
    doc = await doc_ref.get()
    if doc.exists:
        return doc.to_dict()
    return None


def generate_linkage_id() -> str:
    """
    Generate a unique linkage ID in the format lnk_YYYYMMDD_XXX
    where XXX is 3 random hex characters.
    """
    date_part = datetime.now(tz=timezone.utc).strftime("%Y%m%d")
    hex_part = "".join(random.choices(string.hexdigits[:16].lower(), k=3))
    return f"lnk_{date_part}_{hex_part}"
