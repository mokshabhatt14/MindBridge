"""
MindBridge FastAPI Backend
"""

from fastapi import FastAPI, Header, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional
import datetime
import hmac
import os
import re
import sqlite3

from app.nlp import classify_text
from app.ml_model import compute_support_level
from app.auth import create_token, hash_password, read_token, verify_password
from app.database import connection, initialize_database

app = FastAPI(
    title="MindBridge API",
    description="AI-assisted mental health support navigation for higher education students. "
                "This is an academic prototype — NOT a clinical diagnostic system.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Schemas
# ---------------------------------------------------------------------------

class CheckInRequest(BaseModel):
    mood: Optional[float] = 3
    overwhelm: Optional[float] = 3
    concentration: Optional[float] = 3
    connection: Optional[float] = 3
    overall: Optional[float] = 3


class AnalyzeRequest(BaseModel):
    text: str
    assessment: Optional[dict] = {}


class StudentSignupRequest(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: str = Field(min_length=3, max_length=254)
    password: str = Field(min_length=8, max_length=128)


class StudentLoginRequest(BaseModel):
    email: str = Field(min_length=3, max_length=254)
    password: str = Field(min_length=1, max_length=128)


class AdminLoginRequest(BaseModel):
    email: str = Field(min_length=3, max_length=254)
    password: str = Field(min_length=1, max_length=128)


class AppointmentRequest(BaseModel):
    counselor: str = Field(min_length=2, max_length=120)
    preferred_date: str
    preferred_time: str = Field(min_length=1, max_length=40)
    message: str = Field(default="", max_length=2000)


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@app.on_event("startup")
def startup():
    initialize_database()


def current_user(authorization: Optional[str] = Header(default=None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Please sign in to continue.")
    user = read_token(authorization[7:])
    if user is None:
        raise HTTPException(status_code=401, detail="Your session has expired. Please sign in again.")
    return user


def require_role(role):
    def check_role(user=Depends(current_user)):
        if user.get("role") != role:
            raise HTTPException(status_code=403, detail="You do not have permission to access this resource.")
        return user
    return check_role


def user_response(user_id, role, name, email):
    return {
        "token": create_token(user_id, role, name, email),
        "user": {"id": str(user_id), "role": role, "name": name, "email": email},
    }


def normalized_email(email):
    normalized = email.strip().lower()
    if not re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", normalized):
        raise HTTPException(status_code=422, detail="Enter a valid email address.")
    return normalized


@app.get("/health")
def health():
    return {"status": "ok", "timestamp": datetime.datetime.utcnow().isoformat()}


@app.post("/api/auth/student/signup", status_code=201)
def student_signup(data: StudentSignupRequest):
    email = normalized_email(data.email)
    name = data.name.strip()
    if len(name) < 2:
        raise HTTPException(status_code=422, detail="Please enter your name.")
    try:
        with connection() as conn:
            cursor = conn.execute(
                "INSERT INTO students (name, email, password_hash, created_at) VALUES (?, ?, ?, ?)",
                (
                    name,
                    email,
                    hash_password(data.password),
                    datetime.datetime.now(datetime.timezone.utc).isoformat(),
                ),
            )
            user_id = cursor.lastrowid
    except sqlite3.IntegrityError as exc:
        if "UNIQUE constraint failed" in str(exc):
            raise HTTPException(status_code=409, detail="An account with this email already exists.")
        raise
    return user_response(user_id, "student", name, email)


@app.post("/api/auth/student/login")
def student_login(data: StudentLoginRequest):
    with connection() as conn:
        user = conn.execute(
            "SELECT id, name, email, password_hash FROM students WHERE email = ?",
            (normalized_email(data.email),),
        ).fetchone()
    if user is None or not verify_password(data.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Email or password is incorrect.")
    return user_response(user["id"], "student", user["name"], user["email"])


@app.post("/api/auth/admin/login")
def admin_login(data: AdminLoginRequest):
    admin_email = os.environ.get("MINDBRIDGE_ADMIN_EMAIL", "").strip().lower()
    admin_password = os.environ.get("MINDBRIDGE_ADMIN_PASSWORD", "")
    if not admin_email or not admin_password:
        raise HTTPException(status_code=503, detail="Admin login has not been configured.")
    email = normalized_email(data.email)
    if not hmac.compare_digest(email, admin_email) or not hmac.compare_digest(
        data.password, admin_password
    ):
        raise HTTPException(status_code=401, detail="Email or password is incorrect.")
    return user_response("admin", "admin", "Administrator", email)


@app.post("/api/checkin")
def checkin(data: CheckInRequest, user=Depends(require_role("student"))):
    assessment = data.model_dump()
    ml_result = compute_support_level(assessment)
    return {
        "received": assessment,
        **ml_result,
        "message": "Check-in recorded successfully.",
        "disclaimer": "MindBridge does not diagnose mental-health conditions. "
                      "Your responses suggest areas that may benefit from support.",
    }


@app.post("/api/analyze")
def analyze(data: AnalyzeRequest, user=Depends(require_role("student"))):
    nlp_result = classify_text(data.text)
    assessment = data.assessment or {}
    ml_result = compute_support_level(assessment)

    concern = nlp_result["concern"]
    support_level = ml_result["support_level"]

    # Merge recommendations — deduplicate
    seen = set()
    merged_recs = []
    for r in (nlp_result.get("recommendations", []) or []) + ml_result["recommendations"]:
        if r not in seen:
            seen.add(r)
            merged_recs.append(r)

    # Add concern-specific recommendations
    concern_recs = {
        "Academic Stress": ["Academic mentoring", "Study skills resources"],
        "Examination Stress": ["Examination preparation support", "Academic mentoring"],
        "Loneliness": ["Peer support groups", "Campus community events"],
        "Adjustment Difficulties": ["Student orientation resources", "Peer mentoring"],
        "General Emotional Well-being": ["Wellness activities", "Counseling services"],
    }
    for r in concern_recs.get(concern, []):
        if r not in seen:
            seen.add(r)
            merged_recs.append(r)

    return {
        "concern": concern,
        "observed_areas": nlp_result["observed_areas"],
        "support_level": support_level,
        "well_being_score": ml_result["well_being_score"],
        "description": ml_result["description"],
        "recommendations": merged_recs[:6],
        "disclaimer": "Your responses suggest areas that may benefit from support. "
                      "MindBridge does not diagnose mental-health conditions.",
    }


@app.get("/api/trends")
def trends(user=Depends(require_role("admin"))):
    """Returns anonymized, aggregated demo trend data for institutional insights."""
    return {
        "weekly_wellbeing": [
            {"week": "Week 1", "score": 3.1},
            {"week": "Week 2", "score": 2.8},
            {"week": "Week 3", "score": 3.4},
            {"week": "Week 4", "score": 3.7},
        ],
        "concern_distribution": [
            {"concern": "Academic Stress", "percentage": 42},
            {"concern": "Examination Stress", "percentage": 31},
            {"concern": "Loneliness", "percentage": 15},
            {"concern": "Adjustment Difficulties", "percentage": 12},
        ],
        "total_checkins": 248,
        "active_users": 87,
        "common_concern": "Academic Stress",
        "support_navigation_rate": 73,
        "disclaimer": "Aggregated & anonymized insights — no individual student information shown.",
    }


@app.post("/api/appointments", status_code=201)
def create_appointment(data: AppointmentRequest, user=Depends(require_role("student"))):
    try:
        preferred_date = datetime.date.fromisoformat(data.preferred_date)
    except ValueError:
        raise HTTPException(status_code=422, detail="Choose a valid appointment date.")
    if preferred_date < datetime.date.today():
        raise HTTPException(status_code=422, detail="Choose today or a future date.")
    counselor = data.counselor.strip()
    preferred_time = data.preferred_time.strip()
    if not counselor or not preferred_time:
        raise HTTPException(status_code=422, detail="Choose a counsellor and preferred time.")
    with connection() as conn:
        cursor = conn.execute(
            """INSERT INTO appointments
               (student_id, counselor, preferred_date, preferred_time, message, created_at)
               VALUES (?, ?, ?, ?, ?, ?)""",
            (
                int(user["sub"]),
                counselor,
                preferred_date.isoformat(),
                preferred_time,
                data.message.strip(),
                datetime.datetime.now(datetime.timezone.utc).isoformat(),
            ),
        )
        request_id = cursor.lastrowid
    return {"id": request_id, "status": "pending", "message": "Your appointment request has been sent."}


@app.get("/api/appointments")
def list_appointments(user=Depends(current_user)):
    with connection() as conn:
        if user.get("role") == "admin":
            rows = conn.execute(
                """SELECT a.id, s.name AS student_name, s.email AS student_email,
                          a.counselor, a.preferred_date, a.preferred_time,
                          a.message, a.status, a.created_at
                   FROM appointments a JOIN students s ON s.id = a.student_id
                   ORDER BY a.created_at DESC"""
            ).fetchall()
        elif user.get("role") == "student":
            rows = conn.execute(
                """SELECT id, counselor, preferred_date, preferred_time,
                          message, status, created_at
                   FROM appointments WHERE student_id = ? ORDER BY created_at DESC""",
                (int(user["sub"]),),
            ).fetchall()
        else:
            raise HTTPException(status_code=403, detail="You do not have permission to access this resource.")
    return {"appointments": [dict(row) for row in rows]}
