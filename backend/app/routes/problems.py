from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field
from typing import Optional

from app.database import get_connection
from app.services.classifier import classify_problem
from app.services.duplicate_detection import find_similar_problems


router = APIRouter(
    prefix="/api/problems",
    tags=["Problems"]
)


class ProblemCreate(BaseModel):

    title: str = Field(min_length=3)

    description: str = Field(min_length=5)

    domain: Optional[str] = None
    subdomain: Optional[str] = None

    priority: Optional[str] = "Medium"

    district: Optional[str] = None
    block: Optional[str] = None
    village: Optional[str] = None

    latitude: Optional[float] = None
    longitude: Optional[float] = None

    language: Optional[str] = "English"

    evidence_type: Optional[str] = "Text only"

    affected_population: Optional[int] = 0


# =========================================================
# GET ALL PROBLEMS
# =========================================================

@router.get("")
def list_problems(

    domain: Optional[str] = None,

    district: Optional[str] = None,

    priority: Optional[str] = None,

    status: Optional[str] = None,

    search: Optional[str] = None,

    page: int = Query(
        1,
        ge=1
    ),

    limit: int = Query(
        20,
        ge=1,
        le=100
    )
):

    conn = get_connection()

    clauses = []
    params = []

    if domain:

        clauses.append(
            "domain = ?"
        )

        params.append(domain)

    if district:

        clauses.append(
            "district = ?"
        )

        params.append(district)

    if priority:

        clauses.append(
            "priority = ?"
        )

        params.append(priority)

    if status:

        clauses.append(
            "status = ?"
        )

        params.append(status)

    if search:

        clauses.append(
            """
            (
                title LIKE ?
                OR description LIKE ?
                OR keywords LIKE ?
            )
            """
        )

        q = f"%{search}%"

        params.extend([
            q,
            q,
            q
        ])

    where = ""

    if clauses:

        where = (
            " WHERE "
            + " AND ".join(clauses)
        )

    total = conn.execute(
        f"""
        SELECT COUNT(*)
        FROM problems
        {where}
        """,
        params
    ).fetchone()[0]

    offset = (
        (page - 1)
        * limit
    )

    rows = conn.execute(
        f"""
        SELECT *
        FROM problems
        {where}
        ORDER BY id DESC
        LIMIT ?
        OFFSET ?
        """,
        params + [
            limit,
            offset
        ]
    ).fetchall()

    conn.close()

    return {

        "items": [
            dict(row)
            for row in rows
        ],

        "page": page,

        "limit": limit,

        "total": total,

        "pages": (
            (total + limit - 1)
            // limit
        )
    }


# =========================================================
# GET ONE PROBLEM
# =========================================================

@router.get("/{problem_id}")
def get_problem(problem_id: str):

    conn = get_connection()

    row = conn.execute(
        """
        SELECT *
        FROM problems
        WHERE problem_id = ?
        """,
        (problem_id,)
    ).fetchone()

    conn.close()

    if not row:

        raise HTTPException(
            status_code=404,
            detail="Problem not found"
        )

    return dict(row)


# =========================================================
# CREATE PROBLEM
# =========================================================

@router.post("")
def create_problem(
    problem: ProblemCreate
):

    # ---------------------------------------------
    # AI / NLP classification
    # ---------------------------------------------

    classification = classify_problem(
        problem.title,
        problem.description
    )

    # If user manually selects a domain,
    # use that domain.
    #
    # Otherwise use AI classification.
    domain = (
        problem.domain
        or classification["domain"]
    )

    # ---------------------------------------------
    # Database
    # ---------------------------------------------

    conn = get_connection()

    next_num = conn.execute(
        """
        SELECT COALESCE(MAX(id), 0) + 1
        FROM problems
        """
    ).fetchone()[0]

    problem_id = (
        f"CIT{next_num:05d}"
    )

    # ---------------------------------------------
    # Priority score
    # ---------------------------------------------

    urgency_score = {

        "Low": 2,

        "Medium": 5,

        "High": 8,

        "Critical": 10

    }.get(
        problem.priority,
        5
    )

    # ---------------------------------------------
    # Insert
    # ---------------------------------------------

    conn.execute(
        """
        INSERT INTO problems
        (
            problem_id,
            title,
            description,
            domain,
            subdomain,
            priority,
            district,
            block,
            village,
            latitude,
            longitude,
            language,
            evidence_type,
            affected_population,
            urgency_score,
            status,
            source_type,
            solution_status,
            verification_status
        )

        VALUES
        (
            ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?, ?, ?
        )
        """,
        (

            problem_id,

            problem.title,

            problem.description,

            domain,

            problem.subdomain,

            problem.priority,

            problem.district,

            problem.block,

            problem.village,

            problem.latitude,

            problem.longitude,

            problem.language,

            problem.evidence_type,

            problem.affected_population,

            urgency_score,

            "Submitted",

            "Citizen",

            "Not Started",

            "Pending"
        )
    )

    conn.commit()

    conn.close()

    # ---------------------------------------------
    # Duplicate detection
    # ---------------------------------------------

    similar = find_similar_problems(

        problem.title,

        problem.description
    )

    # ---------------------------------------------
    # Response
    # ---------------------------------------------

    return {

        "problem_id": problem_id,

        "message": (
            "Problem submitted successfully"
        ),

        "classification": {

            "domain": classification["domain"],

            "confidence": classification["confidence"],

            "scores": classification["scores"]

        },

        "possible_duplicates": (
            similar[:3]
        )
    }


# =========================================================
# CLASSIFY PROBLEM
# =========================================================

@router.post("/classify")
def classify(

    title: str = "",

    description: str = ""
):

    if not title and not description:

        raise HTTPException(

            status_code=400,

            detail=(
                "Title or description "
                "is required"
            )
        )

    result = classify_problem(

        title,

        description
    )

    return result


# =========================================================
# FIND SIMILAR PROBLEMS
# =========================================================

@router.get("/{problem_id}/similar")
def similar(problem_id: str):

    conn = get_connection()

    row = conn.execute(
        """
        SELECT title, description
        FROM problems
        WHERE problem_id = ?
        """,
        (problem_id,)
    ).fetchone()

    conn.close()

    if not row:

        raise HTTPException(

            status_code=404,

            detail="Problem not found"
        )

    results = find_similar_problems(

        row["title"],

        row["description"]
    )

    return {
        "items": results
    }


# =========================================================
# UPDATE PROBLEM STATUS
# =========================================================

@router.patch("/{problem_id}/status")
def update_status(

    problem_id: str,

    status: str,

    solution_status: Optional[str] = None
):

    conn = get_connection()

    row = conn.execute(
        """
        SELECT problem_id
        FROM problems
        WHERE problem_id = ?
        """,
        (problem_id,)
    ).fetchone()

    if not row:

        conn.close()

        raise HTTPException(

            status_code=404,

            detail="Problem not found"
        )

    if solution_status:

        conn.execute(

            """
            UPDATE problems

            SET
                status = ?,
                solution_status = ?

            WHERE problem_id = ?
            """,

            (
                status,

                solution_status,

                problem_id
            )
        )

    else:

        conn.execute(

            """
            UPDATE problems

            SET status = ?

            WHERE problem_id = ?
            """,

            (
                status,

                problem_id
            )
        )

    conn.commit()

    conn.close()

    return {

        "message": "Status updated",

        "problem_id": problem_id,

        "status": status,

        "solution_status": solution_status
    }