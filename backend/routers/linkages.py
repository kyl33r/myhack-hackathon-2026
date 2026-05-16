from __future__ import annotations

from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException

from dependencies import get_firestore_client
from services.firestore import generate_linkage_id, get_all_linkages, save_linkage
from models import Linkage, LinkageCreate, LinkageCreateResponse

router = APIRouter()


@router.post("/linkages", response_model=LinkageCreateResponse, status_code=201)
async def create_linkage(
    body: LinkageCreate,
    db=Depends(get_firestore_client),
) -> LinkageCreateResponse:
    """Confirm a match by writing a linkage document to Firestore."""
    linkage_id = generate_linkage_id()
    linkage_doc = {
        "linkage_id": linkage_id,
        **body.model_dump(),
        "status": "active",
        "created_at": datetime.now(tz=timezone.utc).isoformat(),
        "outcome": None,
    }

    try:
        await save_linkage(db, linkage_doc)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to save linkage: {exc}") from exc

    return LinkageCreateResponse(linkage_id=linkage_id)


@router.get("/linkages", response_model=list[Linkage])
async def list_linkages(db=Depends(get_firestore_client)) -> list[Linkage]:
    """Return all linkages from Firestore."""
    try:
        rows = await get_all_linkages(db)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to fetch linkages: {exc}") from exc

    return [Linkage(**row) for row in rows]
