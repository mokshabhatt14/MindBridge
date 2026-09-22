# MindBridge

**AI-Powered Mental Health Support Navigation and Early Intervention System for Higher Education Students**

---

## 🚀 Deployment (Vercel + Render)

### Step 1 — Push to GitHub

Make sure your code is pushed to a GitHub repository (e.g. `github.com/yourname/MindBridge`).

---

### Step 2 — Deploy the Backend on Render

1. Go to [render.com](https://render.com) and sign in
2. Click **New → Web Service**
3. Connect your GitHub repo
4. Set these fields:
   - **Root Directory:** `backend`
   - **Runtime:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Click **Create Web Service**
6. Wait for the deploy to finish — note your URL, e.g. `https://mindbridge-api.onrender.com`

> A `render.yaml` is included at the repo root — Render will detect and use it automatically.

---

### Step 3 — Deploy the Frontend on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **Add New → Project**
3. Import your GitHub repo
4. Set **Root Directory** to `frontend`
5. Under **Environment Variables**, add:
   - **Name:** `VITE_API_URL`
   - **Value:** your Render backend URL, e.g. `https://mindbridge-api.onrender.com`
6. Click **Deploy**

> A `vercel.json` is included in `frontend/` — Vercel will detect and use it automatically.

---

### Step 4 — Verify

Once both are deployed:

- Open your Vercel URL — the full app should load
- Visit `https://mindbridge-api.onrender.com/health` — should return `{"status":"ok"}`
- Visit `https://mindbridge-api.onrender.com/docs` — interactive API docs

---

> **Note on Render free tier:** The free instance spins down after inactivity. The first request after a sleep may take ~30 seconds. The frontend handles this gracefully with a fallback demo result.

---

> ⚠️ **Disclaimer:** MindBridge is an academic prototype and provides **support navigation only**. It does **not** diagnose mental-health conditions. If you are in crisis, please contact a professional or crisis helpline immediately.

---

## Overview

MindBridge is a full-stack web application that guides students through a well-being assessment, analyzes their text or voice input using lightweight NLP, and navigates them to appropriate support resources — all with a modern, student-friendly UI.

**Core workflow:**

```
Student → Well-being Assessment → Text / Voice Input → NLP Analysis
       → Concern Categorization → ML Support Level → Support Navigation → Well-being Tracking
```

---

## Tech Stack

| Layer     | Technologies                                      |
|-----------|---------------------------------------------------|
| Frontend  | React 18, Vite, Tailwind CSS, Lucide React, Recharts, React Router |
| Backend   | Python, FastAPI, Pydantic, scikit-learn (TF-IDF NLP) |

---

## Project Structure

```
MindBridge/
├── frontend/          # React + Vite application
│   ├── src/
│   │   ├── pages/     # All page components
│   │   ├── components/# Layout + shared components
│   │   ├── context/   # App state (React context)
│   │   └── lib/       # API client
│   └── package.json
├── backend/           # FastAPI application
│   ├── app/
│   │   ├── main.py    # FastAPI routes
│   │   ├── nlp.py     # TF-IDF concern categorization
│   │   └── ml_model.py# Support level classifier
│   └── requirements.txt
└── README.md
```

---

## Quick Start

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend runs at: **http://localhost:8000**

API docs available at: **http://localhost:8000/docs**

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: **http://localhost:5173**

> The frontend proxies `/api` and `/health` to the backend automatically via Vite config.

---

## API Endpoints

| Method | Path           | Description                        |
|--------|----------------|------------------------------------|
| GET    | `/health`      | Health check                       |
| POST   | `/api/checkin` | Submit well-being assessment       |
| POST   | `/api/analyze` | Analyze text + assessment          |
| GET    | `/api/trends`  | Aggregated anonymized trend data   |

### Example: Analyze

**Request:**
```json
POST /api/analyze
{
  "text": "I've been really stressed about my exams and I'm finding it difficult to concentrate.",
  "assessment": { "mood": 2, "overwhelm": 5, "concentration": 2, "connection": 3, "overall": 2 }
}
```

**Response:**
```json
{
  "concern": "Examination Stress",
  "observed_areas": ["Examination pressure", "Difficulty concentrating"],
  "support_level": "High",
  "well_being_score": 2.4,
  "description": "Your responses suggest you may be experiencing significant challenges...",
  "recommendations": ["Self-help resources", "Academic mentoring", "Peer support groups", "Institutional counseling"],
  "disclaimer": "Your responses suggest areas that may benefit from support. MindBridge does not diagnose mental-health conditions."
}
```

---

## Features

- **Well-being Check-in** — Multi-step assessment with interactive emoji-scale cards
- **Text Input** — Free-text concern entry with character counter
- **Voice Input** — Browser Web Speech API integration with graceful fallback
- **AI Analysis** — TF-IDF + cosine similarity concern categorization + ML support level
- **Support Navigation** — 4 support categories: Self-Help, Peer, Academic, Professional
- **Well-being Tracking** — Recharts line charts showing trends over time
- **Institutional Dashboard** — Anonymized, aggregated insights with pie + line charts
- **Responsive Design** — Desktop and mobile layouts with sidebar navigation

---

## Pages

| Route          | Page                     |
|----------------|--------------------------|
| `/`            | Landing Page             |
| `/dashboard`   | Student Dashboard        |
| `/checkin`     | Well-being Check-in      |
| `/express`     | Text + Voice Input       |
| `/analysis`    | AI Analysis Results      |
| `/support`     | Support Navigation       |
| `/progress`    | Well-being Tracking      |
| `/institution` | Institutional Insights   |

---

## Important Notes

- MindBridge **never** claims a student "has" a mental illness
- All outputs use language like *"Your responses suggest..."* and *"Possible concern identified..."*
- The NLP model uses TF-IDF cosine similarity — it is a prototype, not a clinical system
- The ML support-level model uses weighted scoring — transparent and explainable
- No authentication is implemented (academic prototype)
- The frontend works without a running backend using demo fallback data

---

## Demo Flow

1. Open **http://localhost:5173**
2. Click **Start Check-in** → complete the 5-question assessment
3. On the Express page, type or speak:
   > *"I've been really stressed about my exams and I'm finding it difficult to concentrate."*
4. Click **Analyze My Response**
5. View the concern analysis results (requires backend running)
6. Click **View Support Options** → explore support resources
7. Check **My Progress** for well-being trends
8. Visit **/institution** for the institutional dashboard

---

*Academic Prototype — MindBridge, 2024*
