import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, ClipboardList, MessageSquare, TrendingUp,
  HeartHandshake, CalendarClock, Menu, X, Activity, LogOut
} from 'lucide-react'
import { useApp } from '../context/AppContext'

const studentNav = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/checkin',   icon: ClipboardList,   label: 'Check-in' },
  { to: '/express',   icon: MessageSquare,   label: 'Express Yourself' },
  { to: '/progress',  icon: TrendingUp,      label: 'My Progress' },
  { to: '/support',   icon: HeartHandshake,  label: 'Support' },
  { to: '/appointments', icon: CalendarClock, label: 'Appointments' },
]

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { state, signOut } = useApp()
  const navigate = useNavigate()
  const handleSignOut = () => {
    signOut()
    navigate('/login', { replace: true })
  }
  const NavItem = ({ item }) => (
    <NavLink
      to={item.to}
      onClick={() => setMobileOpen(false)}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
          isActive
            ? 'bg-brand-50 text-brand-700 shadow-sm'
            : 'text-calm-600 hover:text-calm-900 hover:bg-calm-100'
        }`
      }
    >
      <item.icon size={17} />
      <span>{item.label}</span>
    </NavLink>
  )

  const Sidebar = ({ mobile = false }) => (
    <div className={`${mobile ? 'w-full' : 'w-60'} flex flex-col h-full`}>
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-5 border-b border-calm-100">
        <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
          <Activity size={16} className="text-white" />
        </div>
        <span className="font-semibold text-calm-900 text-base tracking-tight">MindBridge</span>
        {mobile && (
          <button onClick={() => setMobileOpen(false)} className="ml-auto text-calm-500 hover:text-calm-900">
            <X size={20} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-xs font-semibold text-calm-400 uppercase tracking-wider px-3 mb-2">Student</p>
        {studentNav.map(item => <NavItem key={item.to} item={item} />)}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-calm-100">
        <div className="flex items-center gap-3 px-3 py-2.5">
          <div className="w-7 h-7 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-semibold text-xs">
            {state.session?.user?.name?.slice(0, 1)?.toUpperCase() || 'S'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-calm-900 truncate">{state.session?.user?.name || 'Student'}</p>
            <p className="text-xs text-calm-500 truncate">{state.session?.user?.email}</p>
          </div>
          <button onClick={handleSignOut} title="Sign out" className="text-calm-400 hover:text-calm-700">
            <LogOut size={15} />
          </button>
        </div>
        <p className="text-[10px] text-calm-400 px-3 pt-2 leading-relaxed">
          Support navigation only. Not a diagnosis tool.
        </p>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-calm-50 overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col bg-white border-r border-calm-200 shrink-0 w-60">
        <Sidebar />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl z-50 flex flex-col">
            <Sidebar mobile />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile topbar */}
        <header className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-calm-200">
          <button onClick={() => setMobileOpen(true)} className="text-calm-600 hover:text-calm-900 p-1">
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-brand-600 rounded-lg flex items-center justify-center">
              <Activity size={14} className="text-white" />
            </div>
            <span className="font-semibold text-calm-900">MindBridge</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
