"""
MindBridge ML Engine
Simple rule-based + weighted scoring model for support-level classification.
Academic prototype — NOT a clinical prediction system.
"""

import numpy as np


def compute_support_level(assessment: dict) -> dict:
    """
    assessment keys (1–5 scale):
        mood            — How have you been feeling lately?
        overwhelm       — How overwhelmed by academic workload?
        concentration   — How well can you concentrate?
        connection      — How connected do you feel?
        overall         — Overall well-being rating

    Higher score = more positive (better well-being).
    Support level: Low | Moderate | High
    """
    keys = ["mood", "overwhelm", "concentration", "connection", "overall"]

    # Provide defaults for missing keys
    values = []
    for k in keys:
        v = assessment.get(k, 3)
        # overwhelm is inverted (high overwhelm = worse)
        if k == "overwhelm":
            v = 6 - v
        values.append(float(v))

    mean_score = float(np.mean(values))

    # Thresholds (scale 1–5, higher = better)
    if mean_score >= 3.8:
        level = "Low"
        description = "Your responses suggest a generally positive well-being. Maintaining healthy habits is encouraged."
    elif mean_score >= 2.5:
        level = "Moderate"
        description = "Your responses suggest some areas that may benefit from additional support and resources."
    else:
        level = "High"
        description = "Your responses suggest you may be experiencing significant challenges. Connecting with support is recommended."

    recommendations = _get_recommendations(level)
    return {
        "support_level": level,
        "description": description,
        "recommendations": recommendations,
        "well_being_score": round(mean_score, 2),
    }


def _get_recommendations(level: str) -> list[str]:
    base = ["Self-help resources", "Well-being check-ins"]
    if level == "Low":
        return base + ["Wellness tips and practices"]
    elif level == "Moderate":
        return base + ["Academic mentoring", "Peer support groups"]
    else:
        return base + ["Academic mentoring", "Peer support groups", "Institutional counseling"]
