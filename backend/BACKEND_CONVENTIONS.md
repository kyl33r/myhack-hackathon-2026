# Backend Conventions

## Stack

Python + FastAPI. Talks to Gemini API and Firestore.
Runs locally with `uvicorn`; deployed behind Firebase Hosting rewrites or standalone.

## File Layout

```
backend/
├── main.py                 # App entry point — mounts routers
├── dependencies.py         # FastAPI dependencies (Firestore client, Gemini client)
├── types.py                # Pydantic models and TypedDicts
├── prompts.py              # All Gemini prompt templates
├── routers/
│   ├── startups.py         # POST /startups
│   ├── matches.py          # POST /matches
│   └── linkages.py         # POST /linkages, GET /linkages
└── services/
    ├── firestore.py        # Firestore read/write helpers
    └── gemini.py           # Gemini API call + response parsing
```

## Separation of Concerns

| Layer | Responsibility |
|-------|---------------|
| `routers/` | HTTP boundary — validate input, call services, return response |
| `services/` | Business logic and external I/O (Firestore, Gemini) |
| `dependencies.py` | Shared FastAPI `Depends()` providers |
| `prompts.py` | All prompt strings — no prompt text inside service or router files |
| `types.py` | All Pydantic models and TypedDicts — no inline dicts as API contracts |

## Types

Define a Pydantic model for every request body and every response body.
Use `TypedDict` for internal data structures (seed records, Gemini parsed output).

Key models (defined in `types.py`):
- `StartupProfile` — form submission payload
- `MatchResult` — single Gemini match (actor_id, match_score, match_reason)
- `MatchResponse` — full Gemini response (mentors[], programmes[], partners[])
- `LinkageCreate` — body for confirming a linkage
- `Linkage` — Firestore linkage document shape

## Gemini Integration (`services/gemini.py`)

- The prompt is assembled in `prompts.py` and passed in — never build prompt strings in `gemini.py`.
- Always request JSON-only output from Gemini; parse with `json.loads()`.
- Validate `match_score` is an integer 0–100 before returning; raise `ValueError` otherwise.
- Use `gemini-1.5-flash` by default.

## Firestore Integration (`services/firestore.py`)

- Client is injected via `dependencies.py` — never instantiate inside a service function.
- Linkage IDs are generated here using the format `lnk_YYYYMMDD_NNN`.
- All writes are `await`-ed; use the async Firestore client.

## Error Handling

- Services raise plain Python exceptions (`ValueError`, `RuntimeError`).
- Routers catch and convert to appropriate HTTP status codes (`422`, `502`, `500`).
- Never return a 200 with an error payload — use proper HTTP status codes.

## Environment

Secrets loaded from `.env` via `python-dotenv` at startup in `main.py`.
Access via `os.getenv()`; fail fast with a clear message if a required key is missing.
