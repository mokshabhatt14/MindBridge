// In production (Vercel), set VITE_API_URL to your Render backend URL,
// e.g. https://mindbridge-api.onrender.com
// In local dev, the Vite proxy forwards /api → http://localhost:8000
const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api'

const HEALTH_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/health`
  : '/health'

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Unknown error' }))
    throw new Error(err.detail || `HTTP ${res.status}`)
  }
  return res.json()
}

export const api = {
  health: () => fetch(HEALTH_URL).then(r => r.json()),

  submitCheckIn: (data) =>
    request('/checkin', { method: 'POST', body: JSON.stringify(data) }),

  analyze: (text, assessment) =>
    request('/analyze', {
      method: 'POST',
      body: JSON.stringify({ text, assessment: assessment || {} }),
    }),

  getTrends: () => request('/trends'),
}
