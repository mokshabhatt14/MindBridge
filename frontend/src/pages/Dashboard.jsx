import { useNavigate } from 'react-router-dom'
import {
  ClipboardList, MessageSquare, TrendingUp, HeartHandshake,
  ArrowRight, Calendar, CheckCircle2
} from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'

const weeklyData = [
  { week: 'Wk 1', wellbeing: 3.1, stress: 3.8 },
  { week: 'Wk 2', wellbeing: 2.8, stress: 4.1 },
  { week: 'Wk 3', wellbeing: 3.4, stress: 3.5 },
  { week: 'Wk 4', wellbeing: 3.7, stress: 3.1 },
]

const recentCheckins = [
  { date: 'Today',       concern: 'Examination Stress',   level: 'Moderate', color: 'text-amber-600 bg-amber-50' },
  { date: '3 days ago',  concern: 'Academic Workload',    level: 'Moderate', color: 'text-amber-600 bg-amber-50' },
  { date: '1 week ago',  concern: 'General Well-being',   level: 'Low',      color: 'text-green-700 bg-green-50' },
]

const supportCards = [
  { title: 'Study Skills Workshop', type: 'Academic Support',  icon: '📚', when: 'Tomorrow, 2 PM' },
  { title: 'Peer Support Group',     type: 'Peer Support',      icon: '🤝', when: 'Thursday, 4 PM' },
  { title: 'Relaxation Techniques',  type: 'Self-Help',         icon: '🧘', when: 'On-demand' },
]

const quickActions = [
  { label: 'Start Check-in',   to: '/checkin',  icon: ClipboardList, color: 'bg-brand-600 hover:bg-brand-700 text-white' },
  { label: 'Talk it Out',      to: '/express',  icon: MessageSquare, color: 'bg-teal-600 hover:bg-teal-700 text-white' },
  { label: 'View My Progress', to: '/progress', icon: TrendingUp,    color: 'bg-white hover:bg-calm-50 text-calm-800 border border-calm-200' },
  { label: 'Support Resources',to: '/support',  icon: HeartHandshake,color: 'bg-white hover:bg-calm-50 text-calm-800 border border-calm-200' },
]

const hour = new Date().getHours()
const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

export default function Dashboard() {
  const navigate = useNavigate()

  return (
    <div className="page-container fade-in">
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-calm-900 mb-1">
          {greeting}, Student 👋
        </h1>
        <p className="text-calm-500">Here's your well-being overview for today.</p>
      </div>

      {/* Today's check-in banner */}
      <div className="card p-5 mb-6 bg-gradient-to-r from-brand-50 to-teal-50 border-brand-100 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Calendar size={15} className="text-brand-500" />
            <span className="text-xs font-medium text-brand-700 uppercase tracking-wide">Today's Check-in</span>
          </div>
          <p className="font-semibold text-calm-900">How are you feeling today?</p>
          <p className="text-sm text-calm-500 mt-0.5">Your last check-in was 3 days ago.</p>
        </div>
        <button onClick={() => navigate('/checkin')} className="btn-primary shrink-0 text-sm">
          Start Check-in <ArrowRight size={15} />
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Check-ins',       value: '12',   sub: 'this month',  color: 'text-brand-600' },
          { label: 'Current Level',   value: 'Mod',  sub: 'support need',color: 'text-amber-600' },
          { label: 'Streak',          value: '3',    sub: 'days',        color: 'text-teal-600'  },
          { label: 'Resources Used',  value: '5',    sub: 'this month',  color: 'text-purple-600' },
        ].map(s => (
          <div key={s.label} className="card p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-calm-500 mt-0.5">{s.label}</p>
            <p className="text-xs text-calm-400">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* Progress chart */}
        <div className="card p-5 lg:col-span-2">
          <h3 className="font-semibold text-calm-900 mb-1">Well-being Trend</h3>
          <p className="text-xs text-calm-400 mb-4">Reported well-being over the past 4 weeks</p>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="week" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis domain={[1, 5]} tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '12px' }}
                formatter={(val, name) => [val.toFixed(1), name === 'wellbeing' ? 'Well-being' : 'Stress Level']}
              />
              <Line type="monotone" dataKey="wellbeing" stroke="#6366f1" strokeWidth={2} dot={{ r: 4, fill: '#6366f1' }} name="wellbeing" />
              <Line type="monotone" dataKey="stress"    stroke="#f59e0b" strokeWidth={2} dot={{ r: 4, fill: '#f59e0b' }} strokeDasharray="4 4" name="stress" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Recent check-ins */}
        <div className="card p-5">
          <h3 className="font-semibold text-calm-900 mb-4">Recent Check-ins</h3>
          <div className="space-y-3">
            {recentCheckins.map((c, i) => (
              <div key={i} className="flex items-start gap-3 pb-3 border-b border-calm-100 last:border-0 last:pb-0">
                <CheckCircle2 size={16} className="text-brand-400 mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-calm-900 truncate">{c.concern}</p>
                  <p className="text-xs text-calm-400">{c.date}</p>
                </div>
                <span className={`badge text-xs ${c.color}`}>{c.level}</span>
              </div>
            ))}
          </div>
          <button onClick={() => navigate('/progress')} className="btn-ghost text-sm w-full mt-3 justify-center">
            View All <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Recommended support */}
      <div className="card p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-calm-900">Recommended for You</h3>
            <p className="text-xs text-calm-400 mt-0.5">Based on your recent check-ins</p>
          </div>
          <button onClick={() => navigate('/support')} className="text-sm text-brand-600 hover:text-brand-700 font-medium">
            View All
          </button>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          {supportCards.map((s, i) => (
            <div key={i} className="p-4 bg-calm-50 rounded-xl hover:bg-calm-100 transition-colors cursor-pointer">
              <div className="text-2xl mb-2">{s.icon}</div>
              <p className="font-medium text-calm-900 text-sm">{s.title}</p>
              <p className="text-xs text-calm-400 mt-0.5">{s.type}</p>
              <p className="text-xs text-brand-500 mt-1 font-medium">{s.when}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div className="card p-5">
        <h3 className="font-semibold text-calm-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickActions.map(a => (
            <button
              key={a.label}
              onClick={() => navigate(a.to)}
              className={`flex flex-col items-center gap-2 px-4 py-4 rounded-xl font-medium text-sm transition-all duration-200 ${a.color}`}
            >
              <a.icon size={20} />
              <span className="text-center leading-tight">{a.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-calm-400 text-center mt-6">
        MindBridge provides support navigation and does not replace professional mental-health care.
      </p>
    </div>
  )
}
