from __future__ import annotations

from datetime import datetime, timezone

from services.store import AbstractStore


class StubStore(AbstractStore):
    """In-memory store for local development without Firebase credentials."""

    def __init__(self) -> None:
        self._startups: dict[str, dict] = {}
        self._linkages: dict[str, dict] = _default_linkages()
        self._partners: dict[str, dict] = {}

    async def save_startup(self, startup_id: str, data: dict) -> None:
        self._startups[startup_id] = data

    async def get_startup(self, startup_id: str) -> dict | None:
        return self._startups.get(startup_id)

    async def get_all_startups(self) -> list[dict]:
        return list(self._startups.values())

    async def save_linkage(self, linkage: dict) -> None:
        self._linkages[linkage["linkage_id"]] = linkage

    async def get_linkage(self, linkage_id: str) -> dict | None:
        return self._linkages.get(linkage_id)

    async def get_all_linkages(self) -> list[dict]:
        return list(self._linkages.values())

    async def update_linkage(self, linkage_id: str, updates: dict) -> dict | None:
        if linkage_id not in self._linkages:
            return None
        self._linkages[linkage_id].update(updates)
        return self._linkages[linkage_id]

    async def save_partner(self, partner_id: str, data: dict) -> None:
        self._partners[partner_id] = data


def _default_linkages() -> dict[str, dict]:
    now = datetime.now(tz=timezone.utc).isoformat()
    rows = [
        {"linkage_id": "lnk_20260516_001", "startup_id": "startup_001", "startup_name": "PayEase",   "actor_type": "mentor",    "partner_type": None,              "actor_id": "mentor_001",  "actor_name": "Ahmad Razif",        "match_score": 92, "match_reason": "Fintech expertise at seed stage.",         "status": "active",  "programme_cycle": None,      "created_at": now, "outcome": None},
        {"linkage_id": "lnk_20260516_002", "startup_id": "startup_001", "startup_name": "PayEase",   "actor_type": "programme", "partner_type": None,              "actor_id": "prog_001",    "actor_name": "CIP Accelerate",     "match_score": 90, "match_reason": "Targets fintech seed-stage startups.",      "status": "active",  "programme_cycle": "Q3 2026", "created_at": now, "outcome": None},
        {"linkage_id": "lnk_20260516_003", "startup_id": "startup_001", "startup_name": "PayEase",   "actor_type": "partner",   "partner_type": "corporate",       "actor_id": "partner_001", "actor_name": "Mastercard",         "match_score": 88, "match_reason": "Fintech pilot programme.",                  "status": "pending", "programme_cycle": None,      "created_at": now, "outcome": None},
        {"linkage_id": "lnk_20260516_004", "startup_id": "startup_001", "startup_name": "PayEase",   "actor_type": "partner",   "partner_type": "investor",        "actor_id": "partner_002", "actor_name": "Openspace Ventures", "match_score": 86, "match_reason": "B2B tech SEA focus.",                       "status": "active",  "programme_cycle": None,      "created_at": now, "outcome": None},
        {"linkage_id": "lnk_20260516_005", "startup_id": "startup_001", "startup_name": "PayEase",   "actor_type": "partner",   "partner_type": "service_provider","actor_id": "partner_003", "actor_name": "Wong & Partners",    "match_score": 83, "match_reason": "Fintech legal specialists.",                "status": "active",  "programme_cycle": None,      "created_at": now, "outcome": None},
        {"linkage_id": "lnk_20260515_001", "startup_id": "startup_002", "startup_name": "MediTrack", "actor_type": "mentor",    "partner_type": None,              "actor_id": "mentor_002",  "actor_name": "Priya Nair",         "match_score": 85, "match_reason": "B2B SaaS GTM experience.",                 "status": "active",  "programme_cycle": None,      "created_at": now, "outcome": None},
        {"linkage_id": "lnk_20260514_001", "startup_id": "startup_002", "startup_name": "MediTrack", "actor_type": "programme", "partner_type": None,              "actor_id": "prog_002",    "actor_name": "GAIN Grant",         "match_score": 76, "match_reason": "Commercialisation grant match.",            "status": "closed",  "programme_cycle": None,      "created_at": now, "outcome": "Not selected"},
    ]
    return {r["linkage_id"]: r for r in rows}
