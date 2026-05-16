# Agent Guide

## Project Brief

Cradle Portal is an AI-powered matching engine for startup linkages:

- Mentor to company matching
- Company to programme eligibility
- Partner to initiative reuse

Frontend: React with Vite and plain CSS, deployed via Firebase Hosting.
Backend: Python with FastAPI, Gemini API, and Firebase Firestore.

Firestore stores only the mutable app records:

- `startups` for cofounder profile submissions
- `linkages` for confirmed matches

Seed data for mentors, programmes, and partners is static JSON and must not be
written to Firestore.

## Source Of Truth

Read this file first. Use the other project docs for details:

- `PLAN.md` — product spec, data model, screens, build phases, and demo script
- `CONVENTIONS.md` — shared naming, canonical values, and data rules
- `frontend/FRONTEND_CONVENTIONS.md` — frontend structure and UI behavior
- `backend/BACKEND_CONVENTIONS.md` — backend structure and API behavior

If these docs conflict, follow `AGENTS.md` first, then the most specific
convention file for the area being changed.

## Agent Operating Rules

- Check the current worktree before editing and preserve unrelated user changes.
- Keep edits focused on the requested behavior; avoid unrelated refactors.
- Prefer existing project conventions over introducing new patterns.
- Use `rg` or `rg --files` for repo searches when available.
- Do not read real secret files, including `backend/.env` and
  `frontend/.env.local`.
- Use `.env.example` files only to identify required variable names.
- Keep example env files current when adding or renaming required variables.

## Repository Layout

```text
/
├── frontend/          # React/Vite frontend
├── backend/           # FastAPI backend
├── PLAN.md            # Product spec and data model
├── CONVENTIONS.md     # Shared project conventions
└── AGENTS.md          # Agent instructions and precedence
```

## Shared Data Rules

- File names use `kebab-case`.
- IDs use `snake_case` strings with a type prefix, such as `startup_001`,
  `mentor_003`, and `lnk_20260516_001`.
- Firestore collections use `snake_case` plural nouns.
- Canonical `actor_type` values are exactly `mentor`, `programme`, and
  `partner`.
- When `actor_type` is `partner`, `partner_type` is required and must be one of
  `corporate`, `investor`, or `service_provider`.
- When `actor_type` is not `partner`, `partner_type` must be `null`.
- Validate `match_score` as an integer from `0` through `100` before
  persisting or returning it.
- Generate linkage IDs in the format `lnk_YYYYMMDD_NNN`.

## Frontend Guardrails

- Follow `frontend/FRONTEND_CONVENTIONS.md` for structure and component
  boundaries.
- Keep data fetching and mutations in `src/services/` or custom hooks, not in
  page or component render logic.
- Route backend calls through `src/services/api.js`.
- Fetch seed data from `/seed/mentors.json`, `/seed/programmes.json`, and
  `/seed/partners.json`; do not import seed JSON directly into components.
- Every async user action must show loading, success, and error states.
- Confirming a linkage should disable that card's button and keep the card
  visible.

## Backend Guardrails

- Follow `backend/BACKEND_CONVENTIONS.md` for module boundaries.
- Define request and response contracts with Pydantic models in `types.py`.
- Keep Gemini prompt templates in `prompts.py`; do not build prompt strings in
  routers or services.
- Request JSON-only Gemini output and parse it with structured JSON parsing.
- Inject Firestore and Gemini clients through dependencies instead of creating
  them inside service functions.
- Services should raise plain Python exceptions; routers should translate them
  into appropriate HTTP status codes.
- Never return HTTP 200 with an error payload.

## Verification

Run targeted checks for the area changed when tooling exists.

- Frontend changes: verify loading, success, and error states for touched flows.
- Backend changes: verify Pydantic validation, HTTP status behavior, Gemini JSON
  parsing, and Firestore document shape for touched endpoints.
- Documentation-only changes do not require automated tests, but verify the docs
  do not expose secrets or contradict this file.
