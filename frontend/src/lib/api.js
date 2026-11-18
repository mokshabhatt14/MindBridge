// In production (Vercel), set VITE_API_URL to your Render backend URL,
// e.g. https://mindbridge-api.onrender.com
// In local dev, the Vite proxy forwards /api → http://localhost:8000
const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api'

const HEALTH_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/health`
  : '/health'

function getSessionToken() {
  try {
    return JSON.parse(localStorage.getItem('mindbridge-session') || 'null')?.token
  } catch {
    return null
  }
}

async function request(path, options = {}) {
  const token = getSessionToken()
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
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

  getCheckIns: () => request('/checkins'),

  analyze: (text, assessment) =>
    request('/analyze', {
      method: 'POST',
      body: JSON.stringify({ text, assessment: assessment || {} }),
    }),

  getTrends: () => request('/trends'),

  studentSignup: (data) =>
    request('/auth/student/signup', { method: 'POST', body: JSON.stringify(data) }),

  studentLogin: (data) =>
    request('/auth/student/login', { method: 'POST', body: JSON.stringify(data) }),

  adminLogin: (data) =>
    request('/auth/admin/login', { method: 'POST', body: JSON.stringify(data) }),

  createAppointment: (data) =>
    request('/appointments', { method: 'POST', body: JSON.stringify(data) }),

  getAppointments: () => request('/appointments'),

  getMusicPreferences: () => request('/music/preferences'),

  saveMusicPreferences: (data) =>
    request('/music/preferences', { method: 'PUT', body: JSON.stringify(data) }),

  getMusicRecommendations: (data) =>
    request('/music/recommendations', { method: 'POST', body: JSON.stringify(data) }),
}
