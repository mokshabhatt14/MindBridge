import os
import secrets
import sqlite3
from contextlib import contextmanager


DATABASE_PATH = os.environ.get(
    "MINDBRIDGE_DB_PATH",
    os.path.join(os.path.dirname(__file__), "..", "mindbridge.sqlite3"),
)


@contextmanager
def connection():
    directory = os.path.dirname(os.path.abspath(DATABASE_PATH))
    os.makedirs(directory, exist_ok=True)
    conn = sqlite3.connect(DATABASE_PATH, timeout=10)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def initialize_database():
    with connection() as conn:
        conn.executescript(
            """
            CREATE TABLE IF NOT EXISTS app_config (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS students (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                password_hash TEXT NOT NULL,
                created_at TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS appointments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                student_id INTEGER NOT NULL REFERENCES students(id),
                counselor TEXT NOT NULL,
                preferred_date TEXT NOT NULL,
                preferred_time TEXT NOT NULL,
                message TEXT NOT NULL DEFAULT '',
                status TEXT NOT NULL DEFAULT 'pending',
                created_at TEXT NOT NULL,
                FOREIGN KEY(student_id) REFERENCES students(id)
            );
            """
        )
        conn.execute(
            "INSERT OR IGNORE INTO app_config (key, value) VALUES (?, ?)",
            ("token_secret", secrets.token_urlsafe(48)),
        )


def token_secret():
    with connection() as conn:
        row = conn.execute(
            "SELECT value FROM app_config WHERE key = ?", ("token_secret",)
        ).fetchone()
    if row is None:
        raise RuntimeError("Database is not initialized.")
    return row["value"]
