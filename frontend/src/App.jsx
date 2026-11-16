import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import AppLayout from './components/AppLayout'
import AdminLayout from './components/AdminLayout'
import LandingPage from './pages/LandingPage'
import AuthPage from './pages/AuthPage'
import AppointmentRequest from './pages/AppointmentRequest'
import Dashboard from './pages/Dashboard'
import CheckIn from './pages/CheckIn'
import Express from './pages/Express'
import Analysis from './pages/Analysis'
import Support from './pages/Support'
import Progress from './pages/Progress'
import Institution from './pages/Institution'
import { AppProvider } from './context/AppContext'
import { useApp } from './context/AppContext'
import Toast from './components/Toast'

function ProtectedRoute({ role, children }) {
  const { state } = useApp()
  const location = useLocation()
  if (!state.session) {
    return <Navigate to={role === 'admin' ? '/admin/login' : '/login'} replace state={{ from: location }} />
  }
  if (state.session.user?.role !== role) {
    return <Navigate to={state.session.user?.role === 'admin' ? '/institution' : '/dashboard'} replace />
  }
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Toast />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/admin/login" element={<AuthPage admin />} />
          <Route element={<ProtectedRoute role="student"><AppLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/checkin" element={<CheckIn />} />
            <Route path="/express" element={<Express />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/support" element={<Support />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/appointments" element={<AppointmentRequest />} />
          </Route>
          <Route element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
            <Route path="/institution" element={<Institution />} />
            <Route path="/admin" element={<Navigate to="/institution" replace />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  )
}
