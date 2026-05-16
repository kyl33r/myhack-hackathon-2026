from __future__ import annotations

import json


def build_matching_prompt(
    startup: dict,
    mentors: list,
    programmes: list,
    partners: list,
) -> str:
    """
    Build the full Gemini prompt for matching a startup against seed data.

    Instructs Gemini to return exactly:
      - top 3 mentors
      - top 3 programmes
      - top 2 corporate partners
      - top 2 investors
      - top 2 service providers

    Response must be JSON only — no prose, no markdown fences.
    """
    startup_json = json.dumps(startup, indent=2)
    mentors_json = json.dumps(mentors, indent=2)
    programmes_json = json.dumps(programmes, indent=2)
    partners_json = json.dumps(partners, indent=2)

    return f"""You are an AI matching engine for a startup ecosystem portal.

Given the startup profile below and the available ecosystem actors, identify the best matches.

## Startup Profile
{startup_json}

## Available Mentors
{mentors_json}

## Available Programmes
{programmes_json}

## Available Partners (corporate, investor, service_provider)
{partners_json}

## Instructions

Return ONLY a valid JSON object — no markdown, no code fences, no explanations.

The JSON must have exactly these keys:
- "mentors": array of top 3 mentor matches
- "programmes": array of top 3 programme matches
- "corporate_partners": array of top 2 corporate partner matches
- "investors": array of top 2 investor matches
- "service_providers": array of top 2 service provider matches

Each item in every array must have exactly these fields:
- "actor_id": string — the id field from the source record
- "actor_name": string — the name field from the source record
- "actor_type": one of "mentor", "programme", "partner"
- "partner_type": one of "corporate", "investor", "service_provider", or null (null for mentors and programmes)
- "match_score": integer between 0 and 100 (higher = stronger match)
- "match_reason": string — exactly 2 sentences explaining why this is a strong match for this specific startup

Do not include any text outside the JSON object.
"""
