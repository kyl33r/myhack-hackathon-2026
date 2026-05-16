from __future__ import annotations

import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException

from dependencies import get_firestore_client
from services.firestore import save_startup
from models import StartupCreateResponse, StartupProfile

router = APIRouter()


@router.post("/startups", response_model=StartupCreateResponse, status_code=201)
async def create_startup(
    profile: StartupProfile,
    db=Depends(get_firestore_client),
) -> StartupCreateResponse:
    """Save a startup cofounder profile to Firestore and return the generated startup_id."""
    startup_id = f"startup_{uuid.uuid4().hex[:8]}"
    data = {
        "startup_id": startup_id,
        **profile.model_dump(),
        "created_at": datetime.now(tz=timezone.utc).isoformat(),
    }

    try:
        await save_startup(db, startup_id, data)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to save startup: {exc}") from exc

    return StartupCreateResponse(startup_id=startup_id)
