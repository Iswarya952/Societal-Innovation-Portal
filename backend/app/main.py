from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import init_db
from app.services.csv_loader import load_csv_if_empty
from app.routes import auth, problems, citizens, universities, startups

app = FastAPI(
    title="Sahaya Tech API",
    version="1.0.0",
    description="Backend API for the Sahaya Tech societal problem-solving platform."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict this to the frontend URL in production.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup():
    init_db()
    load_csv_if_empty()

@app.get("/")
def root():
    return {
        "project": "Sahaya Tech",
        "message": "Backend is running",
        "docs": "/docs"
    }

@app.get("/api/health")
def health():
    return {"status": "ok", "service": "sahaya-tech-backend"}

app.include_router(auth.router)
app.include_router(problems.router)
app.include_router(citizens.router)
app.include_router(universities.router)
app.include_router(startups.router)
