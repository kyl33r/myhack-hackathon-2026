from __future__ import annotations

import json
from pathlib import Path

from fastapi import APIRouter, HTTPException

router = APIRouter()

DATA_DIR = Path(__file__).parent.parent / "data"


def _read(filename: str) -> list:
    try:
        return json.loads((DATA_DIR / filename).read_text())
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to load {filename}: {exc}") from exc


@router.get("/seed/mentors")
async def get_mentors() -> list:
    return _read("mentors.json")


@router.get("/seed/programmes")
async def get_programmes() -> list:
    return _read("programmes.json")


@router.get("/seed/partners")
async def get_partners() -> list:
    return _read("partners.json")
