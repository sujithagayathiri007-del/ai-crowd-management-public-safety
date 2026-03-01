import sqlite3

conn = sqlite3.connect("crowd.db", check_same_thread=False)
cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS crowd_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    people_count INTEGER,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
)
""")

conn.commit()

def save_count(count: int):
    cursor.execute(
        "INSERT INTO crowd_data (people_count) VALUES (?)",
        (count,)
    )
    conn.commit()