import csv
from pathlib import Path
from app.database import get_connection

DATA_FILE = Path(__file__).resolve().parent.parent.parent / "data" / "community_problems.csv"

def load_csv_if_empty():
    conn = get_connection()
    count = conn.execute("SELECT COUNT(*) FROM problems").fetchone()[0]
    if count > 0:
        conn.close()
        return count

    with DATA_FILE.open("r", encoding="utf-8-sig", newline="") as f:
        reader = csv.DictReader(f)
        columns = [c for c in reader.fieldnames]
        placeholders = ",".join("?" for _ in columns)
        sql = f"INSERT OR IGNORE INTO problems ({','.join(columns)}) VALUES ({placeholders})"

        rows = []
        for row in reader:
            # Normalize empty strings to None where useful.
            values = [row.get(c) if row.get(c) not in ("", None) else None for c in columns]
            rows.append(values)

        conn.executemany(sql, rows)
        conn.commit()

    new_count = conn.execute("SELECT COUNT(*) FROM problems").fetchone()[0]
    conn.close()
    return new_count
