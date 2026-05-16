# Project Conventions

## Overview

Cradle Portal — AI-powered mentor/programme/partner matching engine.
Frontend: React + TypeScript (Vite), deployed via Firebase Hosting.
Backend: Python FastAPI that handles Gemini calls and Firestore writes.

## Repository Layout

```
/
├── frontend/          # React + TypeScript (Vite)
├── backend/           # Python FastAPI
├── PLAN.md            # Product spec and data model
└── CONVENTIONS.md     # This file
```

## Naming

- Frontend files: `PascalCase` for components (`MatchCard.tsx`), `camelCase` for everything else (`api.ts`, `useLinkages.ts`)
- Backend files: `snake_case` everywhere (`startup_router.py`, `firestore.py`)
- IDs: `snake_case` strings with a type prefix (e.g. `startup_001`, `mentor_003`, `lnk_20260516_001`)
- Firestore collections: `snake_case` plural nouns (`startups`, `linkages`)

## Data Model

Two Firestore collections — `startups` and `linkages` — defined in PLAN.md.
Seed data (mentors, programmes, partners) is static JSON; never written to Firestore.

## Environment Variables

All secrets live in `backend/.env` (gitignored).
`backend/.env.example` lists required keys — keep it up to date when adding a new secret.
Frontend env vars use the `VITE_` prefix; non-secret values only.

Required backend keys:
- `GEMINI_API_KEY`

Required frontend keys:
- `VITE_USE_STUB` — `"true"` to use local stubs, `"false"` to hit the real backend
- `VITE_API_BASE_URL` — base URL of the FastAPI server

## Actor Types

`actor_type` canonical values: `"mentor"` | `"programme"` | `"partner"`

When `actor_type = "partner"`, the `partner_type` field is required:
`partner_type` canonical values: `"corporate"` | `"investor"` | `"service_provider"`

For all other `actor_type` values, `partner_type` is `null`.

Never abbreviate or vary these strings — they are used as filter keys in Firestore queries and as display labels in the admin dashboard.

## Match Score

An integer 0–100. Gemini is instructed to return this; validate it is an integer in range before persisting.

## Linkage ID Format

`lnk_YYYYMMDD_NNN` — generated at write time using the current UTC date plus a zero-padded counter or random suffix.
