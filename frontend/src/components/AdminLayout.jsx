import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Activity, CalendarCheck, LogOut, Shield } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function AdminLayout() {
  const { state, signOut } = useApp()
  const navigate = useNavigate()

  const handleSignOut = () => {
    signOut()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-calm-50">
      <header className="bg-white border-b border-calm-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center">
              <Activity size={17} className="text-white" />
            </div>
            <div>
              <p className="font-semibold text-calm-900">MindBridge Admin</p>
              <p className="text-xs text-calm-500">Private staff workspace</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <NavLink to="/institution" className="hidden sm:flex items-center gap-2 text-sm text-calm-600 hover:text-brand-700">
              <CalendarCheck size={16} /> Admin dashboard
            </NavLink>
            <span className="hidden md:flex items-center gap-1.5 text-xs text-calm-500">
              <Shield size={14} /> {state.session?.user?.email}
            </span>
            <button onClick={handleSignOut} className="btn-secondary text-sm py-2 px-3">
              <LogOut size={15} /> Sign out
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto">
        <Outlet />
      </main>
    </div>
  )
}
