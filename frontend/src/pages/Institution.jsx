import { useState } from 'react'
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  LineChart, Line, XAxis, YAxis, CartesianGrid
} from 'recharts'
import { Users, ClipboardList, HeartHandshake, TrendingUp, Shield, RefreshCw } from 'lucide-react'
import { api } from '../lib/api'

const COLORS = ['#6366f1', '#f59e0b', '#14b8a6', '#8b5cf6']

const demoTrends = {
  weekly_wellbeing: [
    { week: 'Week 1', score: 3.1 },
    { week: 'Week 2', score: 2.8 },
    { week: 'Week 3', score: 3.4 },
    { week: 'Week 4', score: 3.7 },
  ],
  concern_distribution: [
    { concern: 'Academic Stress',       percentage: 42 },
    { concern: 'Examination Stress',    percentage: 31 },
    { concern: 'Loneliness',            percentage: 15 },
    { concern: 'Adjustment Difficulties', percentage: 12 },
  ],
  total_checkins: 248,
  active_users: 87,
  common_concern: 'Academic Stress',
  support_navigation_rate: 73,
}

export default function Institution() {
  const [data, setData] = useState(demoTrends)
  const [loading, setLoading] = useState(false)

  const refresh = () => {
    setLoading(true)
    api.getTrends()
      .then(d => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  const stats = [
    { label: 'Total Check-ins',        value: data.total_checkins,           icon: ClipboardList, color: 'text-brand-600' },
    { label: 'Common Concern',         value: data.common_concern,            icon: TrendingUp,    color: 'text-amber-600' },
    { label: 'Support Navigation',     value: `${data.support_navigation_rate}%`, icon: HeartHandshake, color: 'text-teal-600' },
    { label: 'Active Students',        value: data.active_users,              icon: Users,         color: 'text-purple-600' },
  ]

  return (
    <div className="page-container">
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-xs font-medium px-3 py-1.5 rounded-full mb-3">
            <Shield size={12} /> Aggregated &amp; anonymized — no individual data shown
          </div>
          <h1 className="section-title mb-1">Student Well-being Insights</h1>
          <p className="text-calm-500 text-sm">Institutional-level overview of student well-being trends.</p>
        </div>
        <button
          onClick={refresh}
          disabled={loading}
          className="btn-secondary text-sm py-2"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {stats.map(s => (
          <div key={s.label} className="card p-5">
            <s.icon size={18} className={`${s.color} mb-2`} />
            <p className={`text-2xl font-bold ${s.color} mb-0.5`}>{s.value}</p>
            <p className="text-xs text-calm-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Well-being trend line chart */}
        <div className="card p-6">
          <h3 className="font-semibold text-calm-900 mb-1">Avg Well-being Score</h3>
          <p className="text-xs text-calm-400 mb-4">Aggregated across all students (scale 1–5)</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data.weekly_wellbeing}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis domain={[1, 5]} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '12px' }}
                formatter={v => [v.toFixed(1), 'Avg Well-being']}
              />
              <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 5, fill: '#6366f1' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Concern distribution pie */}
        <div className="card p-6">
          <h3 className="font-semibold text-calm-900 mb-1">Concern Distribution</h3>
          <p className="text-xs text-calm-400 mb-4">Categorized concerns across student check-ins</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data.concern_distribution}
                dataKey="percentage"
                nameKey="concern"
                cx="50%"
                cy="50%"
                outerRadius={75}
                innerRadius={40}
                paddingAngle={3}
              >
                {data.concern_distribution.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(val, name) => [`${val}%`, name]}
                contentStyle={{ border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Concern breakdown table */}
      <div className="card p-6 mb-6">
        <h3 className="font-semibold text-calm-900 mb-4">Concern Breakdown</h3>
        <div className="space-y-3">
          {data.concern_distribution.map((c, i) => (
            <div key={c.concern} className="flex items-center gap-4">
              <div className="w-3 h-3 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
              <span className="text-sm text-calm-800 flex-1">{c.concern}</span>
              <div className="flex items-center gap-3 shrink-0">
                <div className="w-32 h-2 bg-calm-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${c.percentage}%`, background: COLORS[i % COLORS.length] }}
                  />
                </div>
                <span className="text-sm font-semibold text-calm-700 w-8 text-right">{c.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy notice */}
      <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-xl p-4">
        <Shield size={16} className="text-green-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-green-800 mb-0.5">Privacy Notice</p>
          <p className="text-xs text-green-700 leading-relaxed">
            All data shown is aggregated and anonymized. No individual student information is displayed or accessible through this dashboard. MindBridge does not store identifiable personal information.
          </p>
        </div>
      </div>
    </div>
  )
}
