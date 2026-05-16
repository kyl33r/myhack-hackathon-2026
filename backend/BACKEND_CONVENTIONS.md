# Backend Conventions

## Stack

Python 3.12 + FastAPI + uv (package manager).
Talks to Gemini API (`google-generativeai`) and Firestore (`google-cloud-firestore`).

## File Layout

```
backend/
├── main.py                 # App entry point — creates FastAPI app, mounts routers
├── dependencies.py         # FastAPI Depends() providers (Firestore client, Gemini client)
├── types.py                # Pydantic models and TypedDicts — all request/response shapes
├── prompts.py              # All Gemini prompt templates — no prompt text anywhere else
├── routers/
│   ├── startups.py         # POST /startups
│   ├── matches.py          # POST /matches
│   └── linkages.py         # POST /linkages  GET /linkages
└── services/
    ├── firestore.py        # Firestore read/write helpers
    └── gemini.py           # Gemini API call + JSON response parsing
```

## Separation of Concerns

| Layer | Responsibility |
|-------|---------------|
| `routers/` | HTTP boundary — validate input, call services, return response |
| `services/` | Business logic and external I/O (Firestore, Gemini) |
| `dependencies.py` | Shared `Depends()` providers |
| `prompts.py` | All prompt strings — no prompt text in service or router files |
| `types.py` | All Pydantic models and TypedDicts — no inline dicts as API contracts |

## Types (`types.py`)

Define a Pydantic model for every request body and every response body.
Use `TypedDict` for internal structures (seed records, Gemini parsed output).

Key models:
- `StartupProfile` — form submission payload
- `MatchResult` — single Gemini match (`actor_id`, `match_score`, `match_reason`, `actor_type`, `partner_type`)
- `MatchResponse` — full Gemini response (`mentors[]`, `programmes[]`, `corporate_partners[]`, `investors[]`, `service_providers[]`)
- `LinkageCreate` — body for confirming a linkage
- `Linkage` — Firestore linkage document shape

## Gemini Integration (`services/gemini.py`)

- Prompt assembled in `prompts.py` and passed in — never build prompt strings in `gemini.py`.
- Always request JSON-only output; parse with `json.loads()`.
- Validate `match_score` is an integer 0–100 before returning; raise `ValueError` otherwise.
- Model: `gemini-1.5-flash`.

## Firestore Integration (`services/firestore.py`)

- Client injected via `dependencies.py` — never instantiate inside a service function.
- Linkage IDs generated here: `lnk_YYYYMMDD_NNN`.
- Use the async Firestore client throughout.

## Error Handling

- Services raise plain Python exceptions (`ValueError`, `RuntimeError`).
- Routers catch and map to HTTP status codes (`422`, `502`, `500`).
- Never return 200 with an error body — use proper HTTP status codes.

## CORS

Allow `http://localhost:5173` (Vite dev server) in development.
Tighten to the Firebase Hosting domain before deploying.

## Package Management

Use `uv` for all dependency management:
- Add a dep: `uv add <package>`
- Run the server: `uv run uvicorn main:app --reload`

## Environment

Secrets loaded via `python-dotenv` in `main.py`.
Access via `os.getenv()`; raise a clear error on startup if a required key is missing.
Never read from `.env` directly in service or router files — use injected config or `os.getenv()`.
