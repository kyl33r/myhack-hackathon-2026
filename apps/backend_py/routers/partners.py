from __future__ import annotations

import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException

from dependencies import get_store
from services.store import AbstractStore
from models import PartnerProfile

router = APIRouter()


@router.post("/partners", status_code=201)
async def register_partner(
    profile: PartnerProfile,
    store: AbstractStore = Depends(get_store),
) -> dict:
    partner_id = f"partner_{uuid.uuid4().hex[:8]}"
    data = {
        "partner_id": partner_id,
        **profile.model_dump(),
        "status": "pending_review",
        "created_at": datetime.now(tz=timezone.utc).isoformat(),
    }
    try:
        await store.save_partner(partner_id, data)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to save partner: {exc}") from exc
    return {"partner_id": partner_id, "status": "pending_review"}
