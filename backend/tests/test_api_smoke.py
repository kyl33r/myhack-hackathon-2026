"""
Smoke tests for every API endpoint.
Runs entirely in-memory using StubStore — no Firebase or Gemini credentials needed.
Gemini calls are patched out so /startups/{id}/matches returns a deterministic response.
"""
from __future__ import annotations

import os
import pytest

# Force stub mode before the app is imported
os.environ["STUB_DB"] = "true"
os.environ.setdefault("GEMINI_API_KEY", "test-key")

from unittest.mock import AsyncMock, patch
from httpx import AsyncClient, ASGITransport

from main import app

STARTUP_PAYLOAD = {
    "cofounder_name": "Jane Lim",
    "startup_name": "PayEase",
    "industry": "fintech",
    "stage": "seed",
    "problem": "Cross-border payments for SMEs",
    "needs": ["mentorship", "funding"],
}

FAKE_MATCH_RESPONSE = {
    "mentors": [{"actor_id": "mentor_001", "actor_name": "Ahmad Razif", "actor_type": "mentor", "partner_type": None, "match_score": 92, "match_reason": "Great fit."}],
    "programmes": [{"actor_id": "prog_001", "actor_name": "CIP Accelerate", "actor_type": "programme", "partner_type": None, "match_score": 90, "match_reason": "Good match."}],
    "corporate_partners": [{"actor_id": "partner_001", "actor_name": "Mastercard", "actor_type": "partner", "partner_type": "corporate", "match_score": 88, "match_reason": "Pilot fit."}],
    "investors": [{"actor_id": "partner_002", "actor_name": "Openspace Ventures", "actor_type": "partner", "partner_type": "investor", "match_score": 86, "match_reason": "SEA focus."}],
    "service_providers": [{"actor_id": "partner_003", "actor_name": "Wong & Partners", "actor_type": "partner", "partner_type": "service_provider", "match_score": 83, "match_reason": "Legal specialists."}],
}


@pytest.fixture
async def client():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as c:
        yield c


# ── Health ─────────────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_health(client: AsyncClient):
    r = await client.get("/health")
    assert r.status_code == 200
    assert r.json() == {"status": "ok"}


# ── Startups ───────────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_create_startup(client: AsyncClient):
    r = await client.post("/startups", json=STARTUP_PAYLOAD)
    assert r.status_code == 201
    assert "startup_id" in r.json()


@pytest.mark.asyncio
async def test_list_startups_empty_then_one(client: AsyncClient):
    r = await client.get("/startups")
    assert r.status_code == 200
    before = len(r.json())

    await client.post("/startups", json=STARTUP_PAYLOAD)

    r = await client.get("/startups")
    assert len(r.json()) == before + 1


@pytest.mark.asyncio
async def test_get_startup(client: AsyncClient):
    created = (await client.post("/startups", json=STARTUP_PAYLOAD)).json()
    startup_id = created["startup_id"]

    r = await client.get(f"/startups/{startup_id}")
    assert r.status_code == 200
    assert r.json()["startup_name"] == "PayEase"


@pytest.mark.asyncio
async def test_get_startup_not_found(client: AsyncClient):
    r = await client.get("/startups/nonexistent")
    assert r.status_code == 404


@pytest.mark.asyncio
async def test_get_startup_matches(client: AsyncClient):
    created = (await client.post("/startups", json=STARTUP_PAYLOAD)).json()
    startup_id = created["startup_id"]

    with patch("routers.startups.get_matches", new=AsyncMock(return_value=FAKE_MATCH_RESPONSE)):
        r = await client.get(f"/startups/{startup_id}/matches")

    assert r.status_code == 200
    body = r.json()
    assert len(body["mentors"]) == 1
    assert body["mentors"][0]["actor_name"] == "Ahmad Razif"
    assert len(body["corporate_partners"]) == 1
    assert len(body["investors"]) == 1
    assert len(body["service_providers"]) == 1


# ── Linkages ───────────────────────────────────────────────────────────────

@pytest.fixture
async def startup_id(client: AsyncClient) -> str:
    r = await client.post("/startups", json=STARTUP_PAYLOAD)
    return r.json()["startup_id"]


def _linkage_payload(startup_id: str) -> dict:
    return {
        "startup_id": startup_id,
        "startup_name": "PayEase",
        "actor_type": "mentor",
        "partner_type": None,
        "actor_id": "mentor_001",
        "actor_name": "Ahmad Razif",
        "match_score": 92,
        "match_reason": "Great fit.",
    }


@pytest.mark.asyncio
async def test_create_linkage(client: AsyncClient, startup_id: str):
    r = await client.post("/linkages", json=_linkage_payload(startup_id))
    assert r.status_code == 201
    assert r.json()["linkage_id"].startswith("lnk_")


@pytest.mark.asyncio
async def test_list_linkages(client: AsyncClient):
    r = await client.get("/linkages")
    assert r.status_code == 200
    assert isinstance(r.json(), list)


@pytest.mark.asyncio
async def test_get_linkage(client: AsyncClient, startup_id: str):
    linkage_id = (await client.post("/linkages", json=_linkage_payload(startup_id))).json()["linkage_id"]

    r = await client.get(f"/linkages/{linkage_id}")
    assert r.status_code == 200
    assert r.json()["linkage_id"] == linkage_id


@pytest.mark.asyncio
async def test_get_linkage_not_found(client: AsyncClient):
    r = await client.get("/linkages/nonexistent")
    assert r.status_code == 404


@pytest.mark.asyncio
async def test_update_linkage_status(client: AsyncClient, startup_id: str):
    linkage_id = (await client.post("/linkages", json=_linkage_payload(startup_id))).json()["linkage_id"]

    r = await client.patch(f"/linkages/{linkage_id}", json={"status": "closed", "outcome": "Mentor matched"})
    assert r.status_code == 200
    assert r.json()["status"] == "closed"
    assert r.json()["outcome"] == "Mentor matched"


@pytest.mark.asyncio
async def test_update_linkage_not_found(client: AsyncClient):
    r = await client.patch("/linkages/nonexistent", json={"status": "closed"})
    assert r.status_code == 404


# ── Partners ───────────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_register_corporate_partner(client: AsyncClient):
    r = await client.post("/partners", json={
        "org_name": "Mastercard", "contact_name": "Sarah Lee",
        "contact_email": "sarah@mastercard.com", "partner_type": "corporate",
        "industries": ["fintech"], "offers": ["pilot"], "stages": ["seed"],
    })
    assert r.status_code == 201
    assert r.json()["status"] == "pending_review"


@pytest.mark.asyncio
async def test_register_investor(client: AsyncClient):
    r = await client.post("/partners", json={
        "org_name": "Openspace Ventures", "contact_name": "Marcus Lim",
        "contact_email": "marcus@openspace.vc", "partner_type": "investor",
        "thesis": "B2B tech SEA", "stages": ["seed", "series-a"],
    })
    assert r.status_code == 201


@pytest.mark.asyncio
async def test_register_service_provider(client: AsyncClient):
    r = await client.post("/partners", json={
        "org_name": "Wong & Partners", "contact_name": "David Wong",
        "contact_email": "david@wongpartners.com", "partner_type": "service_provider",
        "service_type": "legal", "what_offer": "Incorporation, term sheets",
        "pricing_model": "discounted", "stages": ["pre-seed", "seed"],
    })
    assert r.status_code == 201


# ── Auth ───────────────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_staff_login_success(client: AsyncClient):
    r = await client.post("/auth/login", json={
        "email": "admin@cradle.com.my",
        "password": "cradle2026",
    })
    assert r.status_code == 200
    assert r.json()["success"] is True
    assert r.json()["role"] == "admin"


@pytest.mark.asyncio
async def test_staff_login_wrong_password(client: AsyncClient):
    r = await client.post("/auth/login", json={
        "email": "admin@cradle.com.my",
        "password": "wrongpassword",
    })
    assert r.status_code == 401


# ── Seed data ──────────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_get_seed_mentors(client: AsyncClient):
    r = await client.get("/seed/mentors")
    assert r.status_code == 200
    assert isinstance(r.json(), list)
    assert len(r.json()) > 0


@pytest.mark.asyncio
async def test_get_seed_programmes(client: AsyncClient):
    r = await client.get("/seed/programmes")
    assert r.status_code == 200
    assert len(r.json()) > 0


@pytest.mark.asyncio
async def test_get_seed_partners(client: AsyncClient):
    r = await client.get("/seed/partners")
    assert r.status_code == 200
    assert len(r.json()) > 0
