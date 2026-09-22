import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, ArrowRight, Shield, Brain } from 'lucide-react'
import { useApp } from '../context/AppContext'

const PROCESSING_STEPS = [
  { id: 1, label: 'Check-in reviewed' },
  { id: 2, label: 'Your words analyzed' },
  { id: 3, label: 'Concern patterns identified' },
  { id: 4, label: 'Support options prepared' },
]

const LEVEL_STYLES = {
  Low:      'bg-green-50 text-green-800 border border-green-200',
  Moderate: 'bg-amber-50 text-amber-800 border border-amber-200',
  High:     'bg-red-50 text-red-800 border border-red-200',
}

const LEVEL_BAR = {
  Low:      'bg-green-500',
  Moderate: 'bg-amber-500',
  High:     'bg-red-500',
}

const LEVEL_PCT = { Low: 30, Moderate: 60, High: 90 }

export default function Analysis() {
  const navigate = useNavigate()
  const { state } = useApp()
  const [step, setStep] = useState(0)
  const [done, setDone] = useState(false)

  const result = state.analysisResult

  useEffect(() => {
    if (!result) {
      navigate('/express')
      return
    }
    // Animate steps
    let s = 0
    const interval = setInterval(() => {
      s++
      setStep(s)
      if (s >= PROCESSING_STEPS.length) {
        clearInterval(interval)
        setTimeout(() => setDone(true), 400)
      }
    }, 550)
    return () => clearInterval(interval)
  }, [result, navigate])

  if (!result) return null

  const level = result.support_level || 'Moderate'

  return (
    <div className="page-container max-w-2xl mx-auto">
      {!done ? (
        /* Processing screen */
        <div className="flex flex-col items-center justify-center py-20 fade-in">
          <div className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center mb-6">
            <Brain size={28} className="text-brand-600 animate-pulse" />
          </div>
          <h2 className="text-xl font-semibold text-calm-900 mb-2">Understanding your check-in...</h2>
          <p className="text-sm text-calm-500 mb-10">Please wait a moment.</p>
          <div className="space-y-3 w-full max-w-xs">
            {PROCESSING_STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                  i < step ? 'bg-brand-500' : 'bg-calm-200'
                }`}>
                  {i < step
                    ? <CheckCircle2 size={14} className="text-white" />
                    : <span className="w-2 h-2 rounded-full bg-calm-400" />
                  }
                </div>
                <span className={`text-sm transition-colors duration-300 ${
                  i < step ? 'text-calm-900 font-medium' : 'text-calm-400'
                }`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Results */
        <div className="fade-in">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-700 text-xs font-medium px-3 py-1.5 rounded-full border border-brand-100 mb-3">
              <CheckCircle2 size={13} /> Analysis complete
            </div>
            <h1 className="section-title mb-1">Your Check-in Results</h1>
            <p className="text-calm-500 text-sm">Based on your responses and your written input.</p>
          </div>

          {/* Primary concern */}
          <div className="card p-6 mb-5">
            <p className="text-xs font-semibold text-calm-400 uppercase tracking-wider mb-2">Primary Concern</p>
            <h2 className="text-2xl font-bold text-calm-900 mb-1">{result.concern}</h2>
            <p className="text-sm text-calm-500 leading-relaxed">
              Your responses suggest <strong className="text-calm-700">{result.concern.toLowerCase()}</strong> as a primary area of concern.
            </p>
          </div>

          {/* Observed areas */}
          <div className="card p-6 mb-5">
            <p className="text-xs font-semibold text-calm-400 uppercase tracking-wider mb-3">Observed Areas</p>
            <div className="flex flex-wrap gap-2">
              {(result.observed_areas || []).map(area => (
                <span key={area} className="badge bg-calm-100 text-calm-700 text-sm py-1.5 px-3">
                  {area}
                </span>
              ))}
            </div>
          </div>

          {/* Support level */}
          <div className={`card p-6 mb-5 ${LEVEL_STYLES[level]}`}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-2 opacity-70">Suggested Support Level</p>
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-bold">{level}</span>
              <span className="text-sm font-medium opacity-80">{LEVEL_PCT[level]}%</span>
            </div>
            <div className="h-2 bg-black/10 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${LEVEL_BAR[level]}`}
                style={{ width: `${LEVEL_PCT[level]}%` }}
              />
            </div>
            <p className="text-sm mt-3 opacity-80 leading-relaxed">{result.description}</p>
          </div>

          {/* Recommendations */}
          <div className="card p-6 mb-5">
            <p className="text-xs font-semibold text-calm-400 uppercase tracking-wider mb-3">Recommended Support</p>
            <ul className="space-y-2">
              {(result.recommendations || []).map(rec => (
                <li key={rec} className="flex items-center gap-2.5 text-sm text-calm-800">
                  <CheckCircle2 size={15} className="text-brand-500 shrink-0" />
                  {rec}
                </li>
              ))}
            </ul>
          </div>

          {/* Disclaimer */}
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <Shield size={16} className="text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-800 mb-0.5">Important disclaimer</p>
              <p className="text-xs text-amber-700 leading-relaxed">{result.disclaimer}</p>
            </div>
          </div>

          <button
            onClick={() => navigate('/support')}
            className="btn-primary w-full justify-center text-base py-3"
          >
            View Support Options <ArrowRight size={18} />
          </button>
        </div>
      )}
    </div>
  )
}
