import hashlib
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from app.database import get_connection

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

class RegisterRequest(BaseModel):
    username: str
    email: EmailStr
    password: str
    role: str
    organization_name: str | None = None
    domain: str | None = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

def hash_password(password):
    return hashlib.sha256(password.encode("utf-8")).hexdigest()

@router.post("/register")
def register(data: RegisterRequest):
    if data.role not in {"citizen", "student", "university", "startup", "community_head", "government"}:
        raise HTTPException(status_code=400, detail="Invalid role")

    conn = get_connection()
    try:
        conn.execute("""
            INSERT INTO users (username, email, password_hash, role, organization_name, domain)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (data.username, str(data.email), hash_password(data.password), data.role, data.organization_name, data.domain))
        conn.commit()
        user_id = conn.execute("SELECT last_insert_rowid()").fetchone()[0]
    except Exception as e:
        conn.close()
        raise HTTPException(status_code=409, detail="Username or email already exists")
    conn.close()

    return {"message": "Registration successful", "user_id": user_id, "role": data.role}

@router.post("/login")
def login(data: LoginRequest):
    conn = get_connection()
    row = conn.execute(
        "SELECT id, username, email, role, organization_name, domain FROM users WHERE email=? AND password_hash=?",
        (str(data.email), hash_password(data.password))
    ).fetchone()
    conn.close()

    if not row:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    return {"message": "Login successful", "user": dict(row)}
