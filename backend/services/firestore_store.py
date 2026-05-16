from __future__ import annotations

from google.cloud import firestore

from services.store import AbstractStore


class FirestoreStore(AbstractStore):

    def __init__(self, client: firestore.AsyncClient) -> None:
        self._client = client

    async def save_startup(self, startup_id: str, data: dict) -> None:
        await self._client.collection("startups").document(startup_id).set(data)

    async def get_startup(self, startup_id: str) -> dict | None:
        doc = await self._client.collection("startups").document(startup_id).get()
        return doc.to_dict() if doc.exists else None

    async def get_all_startups(self) -> list[dict]:
        results: list[dict] = []
        async for doc in self._client.collection("startups").stream():
            results.append(doc.to_dict())
        return results

    async def save_linkage(self, linkage: dict) -> None:
        linkage_id = linkage["linkage_id"]
        await self._client.collection("linkages").document(linkage_id).set(linkage)

    async def get_linkage(self, linkage_id: str) -> dict | None:
        doc = await self._client.collection("linkages").document(linkage_id).get()
        return doc.to_dict() if doc.exists else None

    async def get_all_linkages(self) -> list[dict]:
        results: list[dict] = []
        async for doc in self._client.collection("linkages").stream():
            results.append(doc.to_dict())
        return results

    async def update_linkage(self, linkage_id: str, updates: dict) -> dict | None:
        ref = self._client.collection("linkages").document(linkage_id)
        doc = await ref.get()
        if not doc.exists:
            return None
        await ref.update(updates)
        updated = await ref.get()
        return updated.to_dict()

    async def save_partner(self, partner_id: str, data: dict) -> None:
        await self._client.collection("partners").document(partner_id).set(data)
