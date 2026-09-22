import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './components/AppLayout'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import CheckIn from './pages/CheckIn'
import Express from './pages/Express'
import Analysis from './pages/Analysis'
import Support from './pages/Support'
import Progress from './pages/Progress'
import Institution from './pages/Institution'
import { AppProvider } from './context/AppContext'
import Toast from './components/Toast'

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Toast />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/checkin" element={<CheckIn />} />
            <Route path="/express" element={<Express />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/support" element={<Support />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/institution" element={<Institution />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  )
}
