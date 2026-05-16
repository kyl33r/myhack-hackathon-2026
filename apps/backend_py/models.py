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


class LinkageUpdate(BaseModel):
    status: Literal["active", "pending", "closed"] | None = None
    outcome: str | None = None


class PartnerProfile(BaseModel):
    org_name: str
    contact_name: str
    contact_email: str
    partner_type: PartnerType
    stages: list[str] = []
    # corporate-specific
    industries: list[str] = []
    offers: list[str] = []
    past_initiatives: str | None = None
    # investor-specific
    investor_type: str | None = None
    ticket_min: int | None = None
    ticket_max: int | None = None
    thesis: str | None = None
    portfolio: str | None = None
    # service provider-specific
    service_type: str | None = None
    what_offer: str | None = None
    pricing_model: str | None = None


class LoginRequest(BaseModel):
    email: str
    password: str


class LoginResponse(BaseModel):
    success: bool
    role: str
