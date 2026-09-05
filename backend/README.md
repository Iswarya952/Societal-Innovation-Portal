# Sahaya Tech Backend

This is the backend starter for the Sahaya Tech societal problem-solving platform.

## What is included

- FastAPI REST API
- SQLite database created automatically
- 1,900-row community problem CSV loaded automatically on first run
- Citizen problem submission
- Problem listing/search/filtering
- Domain classification using a lightweight keyword NLP baseline
- Similar/duplicate problem detection
- University problem APIs
- Startup problem APIs
- Basic registration/login API
- CORS enabled for the existing React frontend
- Interactive API documentation

## Project structure

```text
backend/
├── app/
│   ├── main.py
│   ├── database.py
│   ├── models/
│   ├── routes/
│   │   ├── auth.py
│   │   ├── problems.py
│   │   ├── citizens.py
│   │   ├── universities.py
│   │   └── startups.py
│   └── services/
│       ├── classifier.py
│       ├── csv_loader.py
│       ├── duplicate_detection.py
│       └── matching.py
├── data/
│   └── community_problems.csv
├── requirements.txt
├── run.bat
└── run.sh
```

## Run in VS Code on Windows

1. Extract this ZIP.
2. Open the `backend` folder in VS Code.
3. Make sure Python 3.10+ is installed.
4. Open the VS Code terminal.
5. Run:

```powershell
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Or simply double-click `run.bat`.

Backend:
http://127.0.0.1:8000

API documentation:
http://127.0.0.1:8000/docs

Health check:
http://127.0.0.1:8000/api/health

## Important

The CSV contains synthetic training/demo problem statements. It is not an official government complaint database.

The SQLite database (`sahaya.db`) is generated automatically after the first run.

## Main API endpoints

### Problems

GET `/api/problems`

Examples:

```text
/api/problems?domain=Agriculture
/api/problems?district=Ranchi
/api/problems?priority=High
/api/problems?search=irrigation
```

GET `/api/problems/{problem_id}`

POST `/api/problems`

POST `/api/problems/classify?title=Broken canal&description=Water is not reaching farms`

GET `/api/problems/{problem_id}/similar`

PATCH `/api/problems/{problem_id}/status?status=In Progress&solution_status=Pilot`

### Citizen

POST `/api/citizens/problems`

GET `/api/citizens/dashboard`

### University

GET `/api/universities/problems`

GET `/api/universities/implemented`

GET `/api/universities/matches`

### Startup

GET `/api/startups/problems`

GET `/api/startups/implemented`

GET `/api/startups/matches`

### Authentication

POST `/api/auth/register`

POST `/api/auth/login`

## Connecting the existing React frontend

Start this backend first:

```text
http://127.0.0.1:8000
```

Then replace frontend mock-data calls with `fetch()`/Axios calls to this base URL.

Example:

```js
const API = "http://127.0.0.1:8000";

const response = await fetch(`${API}/api/problems?domain=Agriculture`);
const data = await response.json();
```

For citizen submission:

```js
await fetch(`${API}/api/citizens/problems`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    title: "Broken irrigation canal",
    description: "Water is not reaching our fields",
    domain: "Irrigation & Water Management",
    priority: "High",
    district: "Ranchi",
    block: "Ormanjhi",
    village: "Example Village",
    language: "English",
    evidence_type: "Photo"
  })
});
```

## Next production upgrades

This starter deliberately keeps the backend simple for a college/project demonstration. Before production, add:

- JWT authentication and role-based authorization
- PostgreSQL
- Object storage for photos/videos/documents
- Voice-to-text
- Transformer-based multilingual NLP
- ML priority prediction
- Embedding-based duplicate detection
- GIS/map integration
- Admin verification workflow
- Audit logs
- Rate limiting and validation
- Secure password hashing such as Argon2/bcrypt
