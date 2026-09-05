from difflib import SequenceMatcher
from app.database import get_connection

def similarity(a: str, b: str) -> float:
    return round(SequenceMatcher(None, (a or "").lower(), (b or "").lower()).ratio(), 3)

def find_similar_problems(title: str, description: str, limit: int = 5):
    query_text = f"{title} {description}"
    conn = get_connection()
    rows = conn.execute("""
        SELECT problem_id, title, description, domain, district, priority, status
        FROM problems
        ORDER BY id DESC
        LIMIT 1000
    """).fetchall()
    conn.close()

    scored = []
    for row in rows:
        score = similarity(query_text, f"{row['title']} {row['description']}")
        if score >= 0.25:
            scored.append({**dict(row), "similarity": score})

    scored.sort(key=lambda x: x["similarity"], reverse=True)
    return scored[:limit]
