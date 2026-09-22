import { useState, useEffect } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { TrendingUp, TrendingDown, Minus, Shield } from 'lucide-react'
import { api } from '../lib/api'

const demoWeekly = [
  { week: 'Week 1', academic_stress: 4.0, wellbeing: 3.1, checkins: 2 },
  { week: 'Week 2', academic_stress: 4.3, wellbeing: 2.8, checkins: 3 },
  { week: 'Week 3', academic_stress: 3.6, wellbeing: 3.4, checkins: 2 },
  { week: 'Week 4', academic_stress: 3.1, wellbeing: 3.7, checkins: 4 },
]

function Trend({ val, prev }) {
  if (val > prev) return <TrendingUp size={14} className="text-red-500" />
  if (val < prev) return <TrendingDown size={14} className="text-green-500" />
  return <Minus size={14} className="text-calm-400" />
}

export default function Progress() {
  const [trends, setTrends] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getTrends()
      .then(data => {
        setTrends(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const latest = demoWeekly[demoWeekly.length - 1]
  const prev    = demoWeekly[demoWeekly.length - 2]

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="section-title mb-1">Your Well-being Journey</h1>
        <p className="text-calm-500 text-sm">Reported well-being trends over time — not medical measurements.</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          {
            label: 'Academic Stress',
            value: latest.academic_stress.toFixed(1),
            prev: prev.academic_stress,
            desc: 'Last 4 weeks avg',
            color: 'text-amber-600',
          },
          {
            label: 'Overall Well-being',
            value: latest.wellbeing.toFixed(1),
            prev: prev.wellbeing,
            desc: 'Self-reported score',
            color: 'text-brand-600',
          },
          {
            label: 'Check-ins Done',
            value: demoWeekly.reduce((a, b) => a + b.checkins, 0),
            prev: null,
            desc: 'This month',
            color: 'text-teal-600',
          },
        ].map(s => (
          <div key={s.label} className="card p-5">
            <div className="flex items-start justify-between mb-1">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              {s.prev !== null && <Trend val={parseFloat(s.value)} prev={s.prev} />}
            </div>
            <p className="text-sm font-medium text-calm-800">{s.label}</p>
            <p className="text-xs text-calm-400 mt-0.5">{s.desc}</p>
          </div>
        ))}
      </div>

      {/* Line chart */}
      <div className="card p-6 mb-6">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-calm-900">Well-being Over Time</h3>
        </div>
        <p className="text-xs text-calm-400 mb-4">Scale 1–5 (higher = better well-being, lower stress)</p>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={demoWeekly}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="week" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis domain={[1, 5]} tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '12px' }}
              formatter={(val, name) => [
                val.toFixed(1),
                name === 'wellbeing' ? 'Well-being' : name === 'academic_stress' ? 'Academic Stress' : name
              ]}
            />
            <Legend
              wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }}
              formatter={name => name === 'wellbeing' ? 'Well-being' : 'Academic Stress'}
            />
            <Line type="monotone" dataKey="wellbeing"       stroke="#6366f1" strokeWidth={2.5} dot={{ r: 5, fill: '#6366f1' }} />
            <Line type="monotone" dataKey="academic_stress" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 5, fill: '#f59e0b' }} strokeDasharray="5 4" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Check-ins per week */}
      <div className="card p-6 mb-6">
        <h3 className="font-semibold text-calm-900 mb-4">Check-ins Per Week</h3>
        <div className="flex items-end gap-3 h-20">
          {demoWeekly.map(w => (
            <div key={w.week} className="flex flex-col items-center gap-1 flex-1">
              <div
                className="w-full bg-brand-200 rounded-t-md transition-all"
                style={{ height: `${(w.checkins / 5) * 100}%`, minHeight: 8 }}
              />
              <span className="text-xs text-calm-400">{w.week.replace('Week ', 'Wk')}</span>
              <span className="text-xs font-semibold text-calm-700">{w.checkins}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-3 bg-calm-50 border border-calm-200 rounded-xl p-4">
        <Shield size={15} className="text-calm-400 shrink-0 mt-0.5" />
        <p className="text-xs text-calm-500 leading-relaxed">
          These charts show self-reported well-being trends over time. They are not clinical measurements and should not be used to diagnose any condition. MindBridge provides support navigation only.
        </p>
      </div>
    </div>
  )
}
