# Cradle Portal

AI-powered mentor, programme, and partner matching engine for the Cradle ecosystem.

## Quick Start

### Backend

```bash
cd backend
uv run uvicorn main:app --reload
```

Runs on `http://localhost:8000`. Swagger docs at `http://localhost:8000/docs`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:5173`.

## Environment Setup

### Backend (`backend/.env`)

```
GEMINI_API_KEY=your_key_here
STUB_DB=true                          # set to false when Firebase is configured
GOOGLE_APPLICATION_CREDENTIALS=      # path to Firebase service account JSON
STAFF_EMAIL=admin@cradle.com.my       # stub login email
STAFF_PASSWORD=cradle2026             # stub login password
```

### Frontend (`frontend/.env.local`)

```
VITE_USE_STUB=false
VITE_API_BASE_URL=http://localhost:8000
```

## Running Tests

```bash
cd backend
uv run pytest tests/ -v
```
