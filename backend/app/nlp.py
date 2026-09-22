"""
MindBridge NLP Engine
Lightweight keyword + TF-IDF concern categorization.
This is an academic prototype — NOT a clinical diagnostic system.
"""
from __future__ import annotations

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# ---------------------------------------------------------------------------
# Category definitions with representative phrases
# ---------------------------------------------------------------------------
CATEGORIES = {
    "Academic Stress": [
        "assignments deadlines workload study pressure behind failing grades overwhelmed coursework",
        "too much work can't keep up falling behind academic performance struggling with studies",
        "homework projects reports submissions due dates academic pressure",
    ],
    "Examination Stress": [
        "exam test finals midterm results marks scared nervous anxious about exams",
        "studying for exams worried about failing tests performance anxiety examinations",
        "cannot concentrate exam stress revision preparing scared results grades",
    ],
    "Loneliness": [
        "lonely alone isolated no friends disconnected no one to talk to",
        "feel left out unwanted excluded socially isolated nobody understands me",
        "missing home homesick far from family no social connections",
    ],
    "Adjustment Difficulties": [
        "adjusting new environment college hostel difficult adapting change transition",
        "finding it hard to fit in new place uncomfortable unfamiliar surroundings",
        "struggling to adjust college life away from home independent",
    ],
    "General Emotional Well-being": [
        "sad anxious depressed hopeless low mood tired exhausted empty numb",
        "feeling down overwhelmed emotionally drained not okay struggling emotionally",
        "stressed worried fearful nervous emotional distress mental health",
    ],
}

# Flatten corpus for vectorizer training
_corpus_labels: list[str] = []
_corpus_texts: list[str] = []
for label, phrases in CATEGORIES.items():
    for phrase in phrases:
        _corpus_labels.append(label)
        _corpus_texts.append(phrase)

_vectorizer = TfidfVectorizer(ngram_range=(1, 2), stop_words="english")
_category_vectors = _vectorizer.fit_transform(_corpus_texts)


def classify_text(text: str) -> dict:
    """
    Returns:
        concern        : str  — category label
        confidence     : float (0–1)
        observed_areas : list[str]
    """
    if not text or not text.strip():
        return {
            "concern": "General Emotional Well-being",
            "confidence": 0.5,
            "observed_areas": ["General emotional state"],
        }

    vec = _vectorizer.transform([text.lower()])
    sims = cosine_similarity(vec, _category_vectors).flatten()
    best_idx = int(np.argmax(sims))
    concern = _corpus_labels[best_idx]
    confidence = float(sims[best_idx])

    observed_areas = _extract_observed_areas(text.lower(), concern)
    return {
        "concern": concern,
        "confidence": round(min(confidence * 1.5, 1.0), 3),
        "observed_areas": observed_areas,
    }


_area_keywords: dict[str, list[str]] = {
    "Academic workload": ["workload", "assignment", "coursework", "homework", "project", "deadline", "report"],
    "Difficulty concentrating": ["concentrate", "focus", "distracted", "attention", "mind wanders", "can't study"],
    "Examination pressure": ["exam", "test", "finals", "midterm", "result", "grade", "mark", "revision"],
    "Social disconnection": ["lonely", "alone", "isolated", "no friends", "disconnected", "left out"],
    "Emotional exhaustion": ["tired", "exhausted", "drained", "burnout", "burnt out", "fatigue"],
    "Sleep difficulties": ["sleep", "insomnia", "awake", "rest", "can't sleep", "sleepless"],
    "Anxiety symptoms": ["anxious", "anxiety", "nervous", "worried", "fear", "panic", "stress"],
    "Low mood": ["sad", "depressed", "hopeless", "empty", "numb", "down", "unhappy"],
    "Homesickness": ["home", "family", "missing", "hostel", "away from"],
    "Adjustment challenges": ["adjusting", "new environment", "college", "fit in", "transition"],
}


def _extract_observed_areas(text: str, concern: str) -> list[str]:
    found = []
    for area, keywords in _area_keywords.items():
        if any(kw in text for kw in keywords):
            found.append(area)

    # Always include at least one area relevant to the concern
    fallbacks = {
        "Academic Stress": ["Academic workload"],
        "Examination Stress": ["Examination pressure"],
        "Loneliness": ["Social disconnection"],
        "Adjustment Difficulties": ["Adjustment challenges"],
        "General Emotional Well-being": ["General emotional state"],
    }
    if not found:
        found = fallbacks.get(concern, ["General emotional state"])

    return found[:4]  # cap at 4
