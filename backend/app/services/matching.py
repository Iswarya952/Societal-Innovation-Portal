from app.database import get_connection

def match_organizations(domain: str = "", required_expertise: str = "", required_technology: str = "", limit: int = 10):
    conn = get_connection()
    rows = conn.execute("""
        SELECT problem_id, title, domain, subdomain, required_expertise,
               required_technology, suggested_institution_type,
               suggested_department, district, priority
        FROM problems
        WHERE 1=1
        LIMIT 1000
    """).fetchall()
    conn.close()

    def score(row):
        s = 0
        if domain and row["domain"] and domain.lower() == row["domain"].lower():
            s += 4
        if required_expertise and row["required_expertise"] and required_expertise.lower() in row["required_expertise"].lower():
            s += 3
        if required_technology and row["required_technology"] and required_technology.lower() in row["required_technology"].lower():
            s += 3
        if row["suggested_institution_type"]:
            s += 1
        return s

    result = []
    for row in rows:
        item = dict(row)
        item["match_score"] = score(row)
        if item["match_score"] > 0:
            result.append(item)

    result.sort(key=lambda x: x["match_score"], reverse=True)
    return result[:limit]
