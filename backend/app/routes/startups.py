from fastapi import APIRouter
from app.database import get_connection
from app.services.matching import match_organizations

router = APIRouter(prefix="/api/startups", tags=["Startups"])

@router.get("/problems")
def problems_to_implement(domain: str = "", technology: str = "", limit: int = 30):
    conn = get_connection()
    if domain:
        rows = conn.execute("""
            SELECT * FROM problems
            WHERE suggested_institution_type LIKE '%Startup%' AND domain=?
            ORDER BY id DESC LIMIT ?
        """, (domain, limit)).fetchall()
    else:
        rows = conn.execute("""
            SELECT * FROM problems
            WHERE suggested_institution_type LIKE '%Startup%'
            ORDER BY id DESC LIMIT ?
        """, (limit,)).fetchall()
    conn.close()

    items = [dict(r) for r in rows]
    if technology:
        items = [x for x in items if technology.lower() in (x.get("required_technology") or "").lower()]
    return {"items":items}

@router.get("/implemented")
def implemented():
    conn = get_connection()
    rows = conn.execute("""
        SELECT * FROM problems
        WHERE solution_status IN ('Completed','Pilot')
        ORDER BY id DESC LIMIT 100
    """).fetchall()
    conn.close()
    return {"items":[dict(r) for r in rows]}

@router.get("/matches")
def matches(domain: str = "", required_expertise: str = "", required_technology: str = ""):
    return {"items": match_organizations(domain, required_expertise, required_technology)}
