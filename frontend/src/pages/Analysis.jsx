import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight, BatteryCharging, CheckCircle2, ExternalLink,
  Heart, RefreshCw, Shield, Sparkles,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { api } from '../lib/api'

const PROCESSING_STEPS = [
  'Check-in reviewed',
  'Mood and energy patterns considered',
  'Support areas identified',
  'Personalized suggestions prepared',
]

const LEVEL_STYLES = {
  Low: 'from-teal-50 to-white border-teal-100',
  Moderate: 'from-amber-50 to-white border-amber-100',
  High: 'from-rose-50 to-white border-rose-100',
}

function getSupportTarget(recommendation) {
  const text = recommendation.toLowerCase()
  if (text.includes('peer')) return 'peer'
  if (text.includes('academic') || text.includes('study') || text.includes('mentoring')) return 'academic'
  if (text.includes('counsel') || text.includes('professional') || text.includes('therapy')) return 'professional'
  return 'self-help'
}

export default function Analysis() {
  const navigate = useNavigate()
  const { state } = useApp()
  const [step, setStep] = useState(0)
  const [done, setDone] = useState(false)
  const [music, setMusic] = useState([])
  const [musicLoading, setMusicLoading] = useState(false)

  const result = state.analysisResult
  const assessment = state.assessment || {}

  useEffect(() => {
    if (!result) {
      navigate('/express')
      return
    }
    let timer
    timer = setInterval(() => {
      setStep(current => {
        const next = current + 1
        if (next >= PROCESSING_STEPS.length) {
          clearInterval(timer)
          setTimeout(() => setDone(true), 350)
        }
        return next
      })
    }, 500)
    return () => clearInterval(timer)
  }, [result, navigate])

  const loadMusic = async () => {
    setMusicLoading(true)
    try {
      const preferences = await api.getMusicPreferences()
      const response = await api.getMusicRecommendations({
        mood: assessment.mood_label || '',
        languages: preferences.languages || ['Any'],
        limit: 3,
      })
      setMusic(response.recommendations || [])
    } catch {
      setMusic([])
    } finally {
      setMusicLoading(false)
    }
  }

  useEffect(() => {
    if (done) loadMusic()
  }, [done])

  if (!result) return null

  const level = result.support_level || 'Moderate'
  const score = Number(result.well_being_score || 3)
  const scorePercent = Math.max(0, Math.min(100, (score / 5) * 100))
  const moodLabel = assessment.mood_label || result.mood_overview || 'Current mood'
  const sleepScore = Number(assessment.sleep || 3)
  const socialScore = Number(assessment.social_support || assessment.connection || 3)
  const overwhelmScore = Number(assessment.overwhelm || 3)
  const supportAreas = (result.support_areas || []).filter(Boolean)

  return (
    <div className="page-container max-w-5xl mx-auto">
      {!done ? (
        <div className="min-h-[70vh] flex flex-col items-center justify-center fade-in">
          <div className="w-16 h-16 rounded-3xl bg-brand-50 text-brand-600 flex items-center justify-center mb-6">
            <Sparkles size={28} className="animate-pulse" />
          </div>
          <h1 className="text-2xl font-bold text-calm-900 mb-2">Understanding your check-in</h1>
          <p className="text-sm text-calm-500 mb-8">Taking the whole picture into account.</p>
          <div className="w-full max-w-sm space-y-3">
            {PROCESSING_STEPS.map((label, index) => (
              <div key={label} className="flex items-center gap-3">
                <span className={`w-7 h-7 rounded-full flex items-center justify-center ${index < step ? 'bg-brand-600 text-white' : 'bg-calm-100 text-calm-400'}`}>
                  {index < step ? <CheckCircle2 size={15} /> : <span className="w-1.5 h-1.5 rounded-full bg-calm-400" />}
                </span>
                <span className={`text-sm ${index < step ? 'font-medium text-calm-900' : 'text-calm-400'}`}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="fade-in">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 text-teal-700 border border-teal-100 text-xs font-semibold mb-3">
              <CheckCircle2 size={13} /> Check-in complete
            </div>
            <h1 className="text-3xl font-bold text-calm-900 mb-2">Here is how things look</h1>
            <p className="text-calm-500 max-w-2xl">
              A self-reflection summary, not a diagnosis. Use it to notice patterns and choose support that feels useful.
            </p>
          </div>

          <div className="grid lg:grid-cols-[1.35fr_0.65fr] gap-5 mb-5">
            <div className={`card p-6 bg-gradient-to-br ${LEVEL_STYLES[level]}`}>
              <p className="text-xs font-semibold uppercase tracking-wider text-calm-500 mb-2">Overall well-being summary</p>
              <h2 className="text-2xl font-bold text-calm-900">{level} support need</h2>
              <p className="text-sm text-calm-600 mt-2 leading-relaxed">{result.description}</p>
              <div className="mt-5">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-calm-500">Current self-reported range</span>
                  <span className="font-semibold text-calm-800">{score.toFixed(1)} / 5</span>
                </div>
                <div className="h-2.5 rounded-full bg-calm-100 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-brand-400 to-teal-400 transition-all duration-700" style={{ width: `${scorePercent}%` }} />
                </div>
              </div>
            </div>

            <div className="card p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-calm-400 mb-3">Mood overview</p>
              <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4">
                <Heart size={22} />
              </div>
              <p className="text-xl font-bold text-calm-900">{moodLabel}</p>
              <p className="text-sm text-calm-500 mt-1">{result.concern || 'General emotional well-being'}</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mb-5">
            <div className="card p-5">
              <BatteryCharging size={19} className="text-teal-600 mb-3" />
              <p className="text-xs text-calm-400 mb-1">Energy and sleep</p>
              <p className="font-bold text-calm-900">{sleepScore >= 4 ? 'Good recovery' : sleepScore >= 3 ? 'Mixed recovery' : 'Needs more rest'}</p>
            </div>
            <div className="card p-5">
              <div className="w-5 h-5 rounded-full bg-amber-400/70 mb-3" />
              <p className="text-xs text-calm-400 mb-1">Stress indicator</p>
              <p className="font-bold text-calm-900">{overwhelmScore >= 4 ? 'High pressure' : overwhelmScore >= 3 ? 'Some pressure' : 'Manageable pressure'}</p>
            </div>
            <div className="card p-5">
              <Heart size={19} className="text-brand-500 mb-3" />
              <p className="text-xs text-calm-400 mb-1">Social connection</p>
              <p className="font-bold text-calm-900">{socialScore >= 4 ? 'Feeling supported' : socialScore >= 3 ? 'Some support' : 'More connection may help'}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5 mb-5">
            <div className="card p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-teal-600 mb-4">Areas doing well</p>
              <div className="space-y-3">
                {(result.strengths || ['You took time to reflect on how you are doing.']).map(item => (
                  <div key={item} className="flex gap-3 text-sm text-calm-700">
                    <CheckCircle2 size={16} className="text-teal-500 shrink-0 mt-0.5" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="card p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-700 mb-4">Areas to care for</p>
              {supportAreas.length ? (
                <div className="space-y-3">
                  {supportAreas.map(item => (
                    <div key={item} className="flex gap-3 text-sm text-calm-700">
                      <span className="w-2 h-2 rounded-full bg-amber-400 mt-2 shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-calm-600">Nothing stands out as urgently needing extra support. Keep your usual routines and connections.</p>
              )}
            </div>
          </div>

          <div className="card p-6 mb-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-calm-400 mb-4">Personalized suggestions</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {(result.recommendations || []).map(recommendation => (
                <button
                  key={recommendation}
                  onClick={() => navigate(`/support?category=${getSupportTarget(recommendation)}`)}
                  className="rounded-xl border border-calm-200 bg-calm-50 p-4 text-left hover:border-brand-200 hover:bg-brand-50 transition-colors"
                >
                  <span className="flex items-center justify-between gap-3 text-sm font-medium text-calm-800">
                    {recommendation} <ArrowRight size={15} className="text-calm-400" />
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="card overflow-hidden mb-5">
            <div className="p-6 bg-gradient-to-r from-violet-50 via-white to-teal-50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-violet-600 mb-2">Something to Lift Your Mood</p>
                  <h2 className="text-xl font-bold text-calm-900">Music for this moment</h2>
                </div>
                <button onClick={loadMusic} disabled={musicLoading} className="btn-secondary text-sm shrink-0">
                  <RefreshCw size={15} className={musicLoading ? 'animate-spin' : ''} /> Refresh
                </button>
              </div>
              {music.length ? (
                <div className="grid sm:grid-cols-3 gap-3">
                  {music.map(track => (
                    <a
                      key={track.title}
                      href={track.spotify_url || track.youtube_url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-xl border border-calm-200 bg-white p-4 hover:border-brand-200 hover:shadow-sm transition-all"
                    >
                      <p className="font-semibold text-calm-900">{track.title}</p>
                      <p className="text-xs text-calm-500 mt-1">{track.artist} · {track.language}</p>
                      <p className="text-xs leading-relaxed text-calm-600 mt-3">{track.reason}</p>
                      <span className="btn-ghost text-xs mt-3 px-0">Listen <ExternalLink size={13} /></span>
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-calm-500">{musicLoading ? 'Finding music for you...' : 'Open My Music to explore recommendations.'}</p>
              )}
              <button onClick={() => navigate('/vibes')} className="btn-primary mt-5">
                Explore My Music <ArrowRight size={16} />
              </button>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 mb-5">
            <Shield size={17} className="text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs leading-relaxed text-amber-800">{result.disclaimer}</p>
          </div>

          <button onClick={() => navigate('/support')} className="btn-primary w-full justify-center py-3">
            View Support Options <ArrowRight size={17} />
          </button>
        </div>
      )}
    </div>
  )
}
