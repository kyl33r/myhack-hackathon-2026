from __future__ import annotations

from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException

from dependencies import get_store
from services.store import AbstractStore
from services.firestore import generate_linkage_id
from models import Linkage, LinkageCreate, LinkageCreateResponse, LinkageUpdate

router = APIRouter()


@router.post("/linkages", response_model=LinkageCreateResponse, status_code=201)
async def create_linkage(
    body: LinkageCreate,
    store: AbstractStore = Depends(get_store),
) -> LinkageCreateResponse:
    linkage_id = generate_linkage_id()
    linkage_doc = {
        "linkage_id": linkage_id,
        **body.model_dump(),
        "status": "active",
        "created_at": datetime.now(tz=timezone.utc).isoformat(),
        "outcome": None,
    }
    try:
        await store.save_linkage(linkage_doc)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to save linkage: {exc}") from exc
    return LinkageCreateResponse(linkage_id=linkage_id)


@router.get("/linkages", response_model=list[Linkage])
async def list_linkages(store: AbstractStore = Depends(get_store)) -> list[Linkage]:
    try:
        rows = await store.get_all_linkages()
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to fetch linkages: {exc}") from exc
    return [Linkage(**row) for row in rows]


@router.get("/linkages/{linkage_id}", response_model=Linkage)
async def get_linkage(
    linkage_id: str,
    store: AbstractStore = Depends(get_store),
) -> Linkage:
    try:
        row = await store.get_linkage(linkage_id)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to fetch linkage: {exc}") from exc
    if row is None:
        raise HTTPException(status_code=404, detail=f"Linkage '{linkage_id}' not found")
    return Linkage(**row)


@router.patch("/linkages/{linkage_id}", response_model=Linkage)
async def update_linkage(
    linkage_id: str,
    body: LinkageUpdate,
    store: AbstractStore = Depends(get_store),
) -> Linkage:
    updates = {k: v for k, v in body.model_dump().items() if v is not None}
    if not updates:
        raise HTTPException(status_code=422, detail="No fields to update")
    try:
        updated = await store.update_linkage(linkage_id, updates)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to update linkage: {exc}") from exc
    if updated is None:
        raise HTTPException(status_code=404, detail=f"Linkage '{linkage_id}' not found")
    return Linkage(**updated)
