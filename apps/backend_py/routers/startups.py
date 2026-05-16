from __future__ import annotations

import json
import uuid
from datetime import datetime, timezone
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException

from dependencies import get_store, get_gemini_client
from services.store import AbstractStore
from services.firestore import generate_linkage_id
from prompts import build_matching_prompt
from services.gemini import get_matches
from models import MatchResponse, MatchResult, StartupCreateResponse, StartupProfile

router = APIRouter()

DATA_DIR = Path(__file__).parent.parent / "data"


def _load_seed_data() -> tuple[list, list, list]:
    mentors = json.loads((DATA_DIR / "mentors.json").read_text())
    programmes = json.loads((DATA_DIR / "programmes.json").read_text())
    partners = json.loads((DATA_DIR / "partners.json").read_text())
    return mentors, programmes, partners


@router.post("/startups", response_model=StartupCreateResponse, status_code=201)
async def create_startup(
    profile: StartupProfile,
    store: AbstractStore = Depends(get_store),
) -> StartupCreateResponse:
    startup_id = f"startup_{uuid.uuid4().hex[:8]}"
    data = {
        "startup_id": startup_id,
        **profile.model_dump(),
        "created_at": datetime.now(tz=timezone.utc).isoformat(),
    }
    try:
        await store.save_startup(startup_id, data)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to save startup: {exc}") from exc
    return StartupCreateResponse(startup_id=startup_id)


@router.get("/startups", response_model=list[dict])
async def list_startups(store: AbstractStore = Depends(get_store)) -> list[dict]:
    try:
        return await store.get_all_startups()
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to fetch startups: {exc}") from exc


@router.get("/startups/{startup_id}", response_model=dict)
async def get_startup(
    startup_id: str,
    store: AbstractStore = Depends(get_store),
) -> dict:
    try:
        startup = await store.get_startup(startup_id)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to fetch startup: {exc}") from exc
    if startup is None:
        raise HTTPException(status_code=404, detail=f"Startup '{startup_id}' not found")
    return startup


@router.get("/startups/{startup_id}/matches", response_model=MatchResponse)
async def get_startup_matches(
    startup_id: str,
    store: AbstractStore = Depends(get_store),
    gemini=Depends(get_gemini_client),
) -> MatchResponse:
    try:
        startup = await store.get_startup(startup_id)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to fetch startup: {exc}") from exc
    if startup is None:
        raise HTTPException(status_code=404, detail=f"Startup '{startup_id}' not found")

    try:
        mentors, programmes, partners = _load_seed_data()
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to load seed data: {exc}") from exc

    prompt = build_matching_prompt(startup, mentors, programmes, partners)

    try:
        raw = await get_matches(gemini, prompt)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=f"Gemini response invalid: {exc}") from exc
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Gemini API error: {exc}") from exc

    def to_results(items: list) -> list[MatchResult]:
        return [MatchResult(**item) for item in items]

    try:
        return MatchResponse(
            mentors=to_results(raw.get("mentors", [])),
            programmes=to_results(raw.get("programmes", [])),
            corporate_partners=to_results(raw.get("corporate_partners", [])),
            investors=to_results(raw.get("investors", [])),
            service_providers=to_results(raw.get("service_providers", [])),
        )
    except Exception as exc:
        raise HTTPException(status_code=422, detail=f"Failed to parse match results: {exc}") from exc
