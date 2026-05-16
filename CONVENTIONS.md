# Project Conventions

## Overview

Cradle Portal — AI-powered mentor/programme/partner matching engine.
Frontend: vanilla HTML/CSS/JS served via Firebase Hosting.
Backend: Python API that handles Gemini calls and Firestore writes.

## Repository Layout

```
/
├── frontend/          # Static HTML/CSS/JS
├── backend/           # Python API
├── PLAN.md            # Product spec and data model
└── CONVENTIONS.md     # This file
```

## Naming

- Files: `kebab-case` everywhere (e.g. `match-results.js`, `startup_router.py`)
- IDs: `snake_case` strings with a type prefix (e.g. `startup_001`, `mentor_003`, `lnk_20260516_001`)
- Firestore collections: `snake_case` plural nouns (`startups`, `linkages`)

## Data Model

Two Firestore collections — `startups` and `linkages` — defined in PLAN.md.
Seed data (mentors, programmes, partners) is static JSON; never written to Firestore.

## Environment Variables

All secrets live in `backend/.env` (gitignored).
`backend/.env.example` lists required keys — keep it up to date when adding a new secret.

Required keys:
- `GEMINI_API_KEY`

## Actor Types

The string values `"mentor"`, `"programme"`, and `"partner"` are the canonical `actor_type` values used in Firestore and in API payloads. Never abbreviate or vary these.

## Match Score

An integer 0–100. Gemini is instructed to return this; validate it is an integer in range before persisting.

## Linkage ID Format

`lnk_YYYYMMDD_NNN` — generated at write time using the current UTC date plus a zero-padded counter or random suffix.
