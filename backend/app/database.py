from pathlib import Path
import sqlite3

BASE_DIR = Path(__file__).resolve().parent.parent
DB_PATH = BASE_DIR / "sahaya.db"

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    conn.executescript("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL,
        organization_name TEXT,
        domain TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS problems (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        problem_id TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        domain TEXT,
        subdomain TEXT,
        problem_type TEXT,
        priority TEXT,
        urgency_score INTEGER,
        district TEXT,
        block TEXT,
        village TEXT,
        pincode TEXT,
        latitude REAL,
        longitude REAL,
        affected_population INTEGER,
        affected_households INTEGER,
        affected_service TEXT,
        duration TEXT,
        frequency TEXT,
        seasonal TEXT,
        keywords TEXT,
        language TEXT,
        sentiment TEXT,
        required_expertise TEXT,
        required_technology TEXT,
        suggested_solution_type TEXT,
        suggested_institution_type TEXT,
        suggested_department TEXT,
        evidence_type TEXT,
        has_photo TEXT,
        has_video TEXT,
        has_voice TEXT,
        has_document TEXT,
        duplicate_group_id TEXT,
        similar_problem_ids TEXT,
        status TEXT,
        assigned_to TEXT,
        solution_status TEXT,
        verified TEXT,
        verification_status TEXT,
        required_budget INTEGER,
        estimated_solution_time TEXT,
        licenses_required TEXT,
        certifications_required TEXT,
        submitted_date TEXT,
        resolved_date TEXT,
        source_type TEXT,
        source_url TEXT,
        remarks TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_problem_domain ON problems(domain);
    CREATE INDEX IF NOT EXISTS idx_problem_district ON problems(district);
    CREATE INDEX IF NOT EXISTS idx_problem_priority ON problems(priority);
    """)
    conn.commit()
    conn.close()
