from __future__ import annotations

from typing import Literal

from pydantic import BaseModel

ActorType = Literal["mentor", "programme", "partner"]
PartnerType = Literal["corporate", "investor", "service_provider"]


class StartupProfile(BaseModel):
    cofounder_name: str
    startup_name: str
    industry: str
    stage: str
    problem: str
    needs: list[str]


class StartupCreateResponse(BaseModel):
    startup_id: str


class MatchResult(BaseModel):
    actor_id: str
    actor_name: str
    actor_type: ActorType
    partner_type: PartnerType | None
    match_score: int  # 0-100
    match_reason: str


class MatchResponse(BaseModel):
    mentors: list[MatchResult]
    programmes: list[MatchResult]
    corporate_partners: list[MatchResult]
    investors: list[MatchResult]
    service_providers: list[MatchResult]


class LinkageCreate(BaseModel):
    startup_id: str
    startup_name: str
    actor_type: ActorType
    partner_type: PartnerType | None = None
    actor_id: str
    actor_name: str
    match_score: int
    match_reason: str
    programme_cycle: str | None = None


class Linkage(BaseModel):
    linkage_id: str
    startup_id: str
    startup_name: str
    actor_type: ActorType
    partner_type: PartnerType | None
    actor_id: str
    actor_name: str
    match_score: int
    match_reason: str
    status: str  # "active" | "pending" | "closed"
    programme_cycle: str | None
    created_at: str
    outcome: str | None


class LinkageCreateResponse(BaseModel):
    linkage_id: str
