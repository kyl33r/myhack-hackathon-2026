from __future__ import annotations

import os
import sys

from dotenv import load_dotenv

load_dotenv()

# Validate required env vars at startup before importing anything that uses them
_REQUIRED_ENV_VARS = ["GEMINI_API_KEY"]

def _check_env() -> None:
    missing = [key for key in _REQUIRED_ENV_VARS if not os.getenv(key)]
    if missing:
        print(f"ERROR: Missing required environment variables: {', '.join(missing)}", file=sys.stderr)
        sys.exit(1)

_check_env()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import auth, linkages, partners, seed, startups

app = FastAPI(
    title="Cradle Portal API",
    description="AI-powered startup matching and linkage management for Cradle.",
    version="0.1.0",
)

_CORS_ORIGINS = [
    "http://localhost:5173",  # Vite dev server
    "http://localhost:4173",  # Vite preview
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(startups.router, tags=["startups"])
app.include_router(linkages.router, tags=["linkages"])
app.include_router(partners.router, tags=["partners"])
app.include_router(auth.router,     tags=["auth"])
app.include_router(seed.router,     tags=["seed"])


@app.get("/health")
async def health() -> dict:
    return {"status": "ok"}
