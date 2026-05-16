from __future__ import annotations

import os

from fastapi import APIRouter, HTTPException

from models import LoginRequest, LoginResponse

router = APIRouter()

# Stub credentials for demo — replace with Firebase Auth in production
_STUB_EMAIL = os.getenv("STAFF_EMAIL", "admin@cradle.com.my")
_STUB_PASSWORD = os.getenv("STAFF_PASSWORD", "cradle2026")


@router.post("/auth/login", response_model=LoginResponse)
async def login(body: LoginRequest) -> LoginResponse:
    if body.email == _STUB_EMAIL and body.password == _STUB_PASSWORD:
        return LoginResponse(success=True, role="admin")
    raise HTTPException(status_code=401, detail="Invalid credentials")
