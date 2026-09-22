"""
MindBridge FastAPI Backend
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import datetime

from app.nlp import classify_text
from app.ml_model import compute_support_level

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


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@app.get("/health")
def health():
    return {"status": "ok", "timestamp": datetime.datetime.utcnow().isoformat()}


@app.post("/api/checkin")
def checkin(data: CheckInRequest):
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
def analyze(data: AnalyzeRequest):
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
def trends():
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
