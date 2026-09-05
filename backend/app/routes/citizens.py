from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from app.routes.problems import ProblemCreate
from app.services.classifier import classify_problem

router = APIRouter(prefix="/api/citizens", tags=["Citizens"])

class CitizenSubmission(ProblemCreate):
    citizen_username: Optional[str] = None

@router.post("/problems")
def submit_problem(data: CitizenSubmission):
    # Reuse the problem API contract while keeping a citizen-specific endpoint.
    from app.database import get_connection
    import uuid

    classification = classify_problem(f"{data.title} {data.description}")
    domain = data.domain or classification["domain"]
    problem_id = "CIT-" + uuid.uuid4().hex[:8].upper()

    conn = get_connection()
    conn.execute("""
        INSERT INTO problems
        (problem_id,title,description,domain,subdomain,priority,district,block,village,
         latitude,longitude,language,evidence_type,affected_population,urgency_score,
         status,source_type,solution_status,verification_status)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    """, (
        problem_id,data.title,data.description,domain,data.subdomain,data.priority,
        data.district,data.block,data.village,data.latitude,data.longitude,
        data.language,data.evidence_type,data.affected_population,
        {"Low":2,"Medium":5,"High":8,"Critical":10}.get(data.priority,5),
        "Submitted","Citizen","Not Started","Pending"
    ))
    conn.commit()
    conn.close()

    return {"message":"Citizen problem submitted","problem_id":problem_id,"classification":classification}

@router.get("/dashboard")
def citizen_dashboard():
    from app.database import get_connection
    conn = get_connection()
    rows = conn.execute("""
        SELECT status, COUNT(*) as count FROM problems
        WHERE source_type='Citizen' GROUP BY status
    """).fetchall()
    conn.close()
    return {"status_summary": [dict(r) for r in rows]}
