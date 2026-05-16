from __future__ import annotations

import json
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from dependencies import get_firestore_client, get_gemini_client
from prompts import build_matching_prompt
from services.firestore import get_startup
from services.gemini import get_matches
from models import MatchResponse, MatchResult

router = APIRouter()

DATA_DIR = Path(__file__).parent.parent / "data"


class MatchRequest(BaseModel):
    startup_id: str


def _load_seed_data() -> tuple[list, list, list]:
    """Load mentors, programmes, and partners from the data directory."""
    mentors = json.loads((DATA_DIR / "mentors.json").read_text())
    programmes = json.loads((DATA_DIR / "programmes.json").read_text())
    partners = json.loads((DATA_DIR / "partners.json").read_text())
    return mentors, programmes, partners


@router.post("/matches", response_model=MatchResponse)
async def get_startup_matches(
    body: MatchRequest,
    db=Depends(get_firestore_client),
    gemini=Depends(get_gemini_client),
) -> MatchResponse:
    """
    Fetch the startup from Firestore, load seed data, call Gemini for matches,
    and return the structured MatchResponse.
    """
    try:
        startup = await get_startup(db, body.startup_id)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to fetch startup: {exc}") from exc

    if startup is None:
        raise HTTPException(status_code=404, detail=f"Startup '{body.startup_id}' not found")

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
