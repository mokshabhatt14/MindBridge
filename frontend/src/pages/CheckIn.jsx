import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft, ArrowRight, BatteryLow, Check, CloudRain, Heart,
  HeartHandshake, Leaf, Meh, Moon, Smile, Sparkles, Sun, Users, Zap,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { api } from '../lib/api'

const MOODS = [
  { id: 'peaceful', label: 'Peaceful', icon: Leaf, tone: 'bg-teal-50 text-teal-700 border-teal-200', score: 4 },
  { id: 'happy', label: 'Happy', icon: Smile, tone: 'bg-amber-50 text-amber-700 border-amber-200', score: 4 },
  { id: 'excited', label: 'Excited', icon: Zap, tone: 'bg-violet-50 text-violet-700 border-violet-200', score: 4 },
  { id: 'okay', label: 'Okay', icon: Meh, tone: 'bg-calm-50 text-calm-700 border-calm-200', score: 3 },
  { id: 'stressed', label: 'Stressed', icon: CloudRain, tone: 'bg-rose-50 text-rose-700 border-rose-200', score: 2 },
  { id: 'overwhelmed', label: 'Overwhelmed', icon: BatteryLow, tone: 'bg-orange-50 text-orange-700 border-orange-200', score: 1 },
  { id: 'sad', label: 'Sad', icon: Heart, tone: 'bg-blue-50 text-blue-700 border-blue-200', score: 2 },
  { id: 'lonely', label: 'Lonely', icon: Users, tone: 'bg-indigo-50 text-indigo-700 border-indigo-200', score: 2 },
  { id: 'anxious', label: 'Anxious', icon: Moon, tone: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200', score: 2 },
  { id: 'exhausted', label: 'Exhausted', icon: BatteryLow, tone: 'bg-slate-50 text-slate-700 border-slate-200', score: 1 },
]

const QUESTIONS = [
  {
    id: 'overwhelm',
    eyebrow: 'Academic pressure',
    title: 'How heavy has academic life felt lately?',
    helper: 'Think about deadlines, study demands and expectations.',
    options: [
      { value: 1, title: 'Very manageable', detail: 'I have enough space and control.' },
      { value: 2, title: 'Mostly manageable', detail: 'There is some pressure, but I can handle it.' },
      { value: 3, title: 'A little heavy', detail: 'I feel stretched at times.' },
      { value: 4, title: 'Quite heavy', detail: 'Pressure is taking a lot of my attention.' },
      { value: 5, title: 'Overwhelming', detail: 'It is difficult to keep up or switch off.' },
    ],
  },
  {
    id: 'concentration',
    eyebrow: 'Focus and energy',
    title: 'How easy has it been to focus and stay engaged?',
    helper: 'Consider studying, attending classes and everyday decisions.',
    options: [
      { value: 1, title: 'Very difficult', detail: 'I struggle to start or stay focused.' },
      { value: 2, title: 'Often difficult', detail: 'My attention slips frequently.' },
      { value: 3, title: 'Some ups and downs', detail: 'Focus varies through the day.' },
      { value: 4, title: 'Mostly steady', detail: 'I can concentrate with a little effort.' },
      { value: 5, title: 'Clear and focused', detail: 'I feel attentive and in control.' },
    ],
  },
  {
    id: 'sleep',
    eyebrow: 'Rest and recovery',
    title: 'How restorative has your sleep and energy been?',
    helper: 'Base this on the last few days rather than one night.',
    options: [
      { value: 1, title: 'Very low', detail: 'I am exhausted most of the time.' },
      { value: 2, title: 'Low', detail: 'Rest has not felt very restorative.' },
      { value: 3, title: 'Mixed', detail: 'Some days are better than others.' },
      { value: 4, title: 'Good', detail: 'I usually have enough energy.' },
      { value: 5, title: 'Restored', detail: 'I feel rested and able to recover.' },
    ],
  },
  {
    id: 'social_support',
    eyebrow: 'Connection',
    title: 'How supported do you feel by people around you?',
    helper: 'This could include friends, family, classmates or campus staff.',
    options: [
      { value: 1, title: 'Very alone', detail: 'I do not feel able to reach out.' },
      { value: 2, title: 'Mostly alone', detail: 'I could use more connection.' },
      { value: 3, title: 'Sometimes supported', detail: 'Support is available on some days.' },
      { value: 4, title: 'Well supported', detail: 'I have people I can talk to.' },
      { value: 5, title: 'Very connected', detail: 'I feel close to and supported by others.' },
    ],
  },
  {
    id: 'overall',
    eyebrow: 'Overall well-being',
    title: 'How does everything feel together today?',
    helper: 'Choose the answer that reflects the whole of the last few days.',
    options: [
      { value: 1, title: 'Really difficult', detail: 'Getting through the day feels hard.' },
      { value: 2, title: 'A little difficult', detail: 'There are several things weighing on me.' },
      { value: 3, title: 'Fair', detail: 'Some areas feel okay and others need care.' },
      { value: 4, title: 'Generally good', detail: 'I am managing with a few challenges.' },
      { value: 5, title: 'Strong', detail: 'I feel grounded and able to cope.' },
    ],
  },
]

export default function CheckIn() {
  const navigate = useNavigate()
  const { dispatch, showToast } = useApp()
  const [step, setStep] = useState(0)
  const [selectedMood, setSelectedMood] = useState('')
  const [answers, setAnswers] = useState({
    mood: 3,
    overwhelm: 3,
    concentration: 3,
    connection: 3,
    social_support: 3,
    sleep: 3,
    overall: 3,
    mood_label: '',
    note: '',
  })
  const [loading, setLoading] = useState(false)

  const totalSteps = 8
  const questionIndex = step - 2
  const question = questionIndex >= 0 ? QUESTIONS[questionIndex] : null
  const progress = step === 0 ? 8 : Math.round((step / (totalSteps - 1)) * 100)

  const selectMood = (mood) => {
    setSelectedMood(mood.id)
    setAnswers(prev => ({ ...prev, mood_label: mood.label, mood: mood.score }))
  }

  const setAnswer = (id, value) => {
    setAnswers(prev => ({
      ...prev,
      [id]: value,
      ...(id === 'social_support' ? { connection: value } : {}),
    }))
  }

  const canContinue = step === 1 ? Boolean(selectedMood) : true

  const submit = async () => {
    setLoading(true)
    try {
      await api.submitCheckIn(answers)
      showToast('Check-in saved securely.', 'success')
    } catch (error) {
      showToast('The backend is unavailable. Your check-in is saved on this device.', 'info')
    }
    dispatch({ type: 'SET_ASSESSMENT', payload: answers })
    setLoading(false)
    navigate('/express')
  }

  const goBack = () => setStep(previous => Math.max(0, previous - 1))
  const goNext = () => {
    if (!canContinue) return
    if (step === 7) submit()
    else setStep(previous => previous + 1)
  }

  return (
    <div className="page-container max-w-4xl mx-auto">
      <div className="mb-6 flex items-center justify-between gap-4">
        <button onClick={() => navigate('/dashboard')} className="btn-ghost text-sm">
          <ArrowLeft size={15} /> Dashboard
        </button>
        <div className="text-right">
          <p className="text-xs text-calm-400">Take a moment for yourself</p>
          <p className="text-xs font-medium text-calm-600">{progress}% complete</p>
        </div>
      </div>

      <div className="h-1.5 bg-calm-100 rounded-full overflow-hidden mb-8">
        <div className="h-full bg-gradient-to-r from-brand-500 to-teal-400 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>

      {step === 0 && (
        <div className="card overflow-hidden fade-in">
          <div className="grid md:grid-cols-[1.15fr_0.85fr]">
            <div className="p-8 sm:p-10">
              <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-6">
                <Sun size={24} />
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600 mb-3">A 2-minute pause</p>
              <h1 className="text-3xl sm:text-4xl font-bold text-calm-900 leading-tight mb-4">Take a Moment for Yourself</h1>
              <p className="text-calm-500 leading-relaxed max-w-md">
                Your feelings matter. Take a few moments to understand how you're doing right now.
              </p>
              <div className="mt-8 flex flex-wrap gap-3 text-sm text-calm-600">
                <span className="badge bg-calm-50 border border-calm-200">Private</span>
                <span className="badge bg-calm-50 border border-calm-200">No right or wrong answers</span>
              </div>
              <button onClick={goNext} className="btn-primary mt-9 px-6 py-3">
                Begin check-in <ArrowRight size={17} />
              </button>
            </div>
            <div className="relative min-h-64 md:min-h-full bg-gradient-to-br from-brand-100 via-teal-50 to-calm-100 p-8 flex items-end">
              <div className="absolute top-10 right-10 w-32 h-32 rounded-full bg-white/50 blur-sm" />
              <div className="absolute top-24 left-10 w-20 h-20 rounded-[2.5rem] bg-brand-300/30 rotate-12" />
              <div className="relative rounded-3xl bg-white/80 border border-white p-5 shadow-sm max-w-xs">
                <HeartHandshake size={22} className="text-brand-600 mb-3" />
                <p className="font-semibold text-calm-900">A check-in is not a test.</p>
                <p className="text-sm text-calm-500 mt-1">It is a simple way to notice what you may need next.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="fade-in">
          <div className="mb-7">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-600 mb-2">How are you arriving?</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-calm-900">Choose the mood that feels closest</h1>
            <p className="text-sm text-calm-500 mt-2">You do not need to have the perfect word for it.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {MOODS.map(mood => {
              const Icon = mood.icon
              const active = selectedMood === mood.id
              return (
                <button
                  key={mood.id}
                  onClick={() => selectMood(mood)}
                  className={`relative min-h-32 rounded-2xl border p-4 text-left transition-all duration-200 ${mood.tone} ${active ? 'ring-2 ring-brand-500 ring-offset-2 scale-[1.02] shadow-md' : 'hover:-translate-y-1 hover:shadow-sm'}`}
                >
                  {active && <span className="absolute right-3 top-3 w-5 h-5 rounded-full bg-brand-600 text-white flex items-center justify-center"><Check size={12} /></span>}
                  <Icon size={24} className="mb-5" />
                  <span className="font-semibold">{mood.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {step >= 2 && step <= 6 && question && (
        <div className="card p-6 sm:p-8 fade-in">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-600 mb-2">{question.eyebrow}</p>
          <h1 className="text-xl sm:text-2xl font-bold text-calm-900">{question.title}</h1>
          <p className="text-sm text-calm-500 mt-2 mb-6">{question.helper}</p>
          <div className="grid gap-3">
            {question.options.map(option => {
              const active = answers[question.id] === option.value
              return (
                <button
                  key={option.value}
                  onClick={() => setAnswer(question.id, option.value)}
                  className={`w-full rounded-xl border p-4 text-left transition-all ${active ? 'border-brand-400 bg-brand-50 ring-1 ring-brand-200' : 'border-calm-200 bg-white hover:border-brand-200 hover:bg-calm-50'}`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${active ? 'border-brand-600' : 'border-calm-300'}`}>
                      {active && <span className="w-2.5 h-2.5 rounded-full bg-brand-600" />}
                    </span>
                    <span className="flex-1">
                      <span className="block text-sm font-semibold text-calm-900">{option.title}</span>
                      <span className="block text-xs text-calm-500 mt-0.5">{option.detail}</span>
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {step === 7 && (
        <div className="card p-6 sm:p-8 fade-in">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-600 mb-2">One final note</p>
          <h1 className="text-2xl font-bold text-calm-900">Anything else you want to capture?</h1>
          <p className="text-sm text-calm-500 mt-2 mb-5">This is optional. You can leave it blank.</p>
          <textarea
            value={answers.note}
            onChange={event => setAnswers(prev => ({ ...prev, note: event.target.value }))}
            className="input-field min-h-36 resize-none"
            maxLength={2000}
            placeholder="A short note about what has been affecting your well-being..."
          />
          <div className="mt-4 flex items-start gap-3 rounded-xl bg-teal-50 border border-teal-100 p-4">
            <Sparkles size={18} className="text-teal-600 shrink-0 mt-0.5" />
            <p className="text-sm text-teal-800">Your answers will help generate a gentle summary and relevant support suggestions.</p>
          </div>
        </div>
      )}

      {step > 0 && (
        <div className="mt-6 flex items-center justify-between">
          <button onClick={goBack} className="btn-secondary">
            <ArrowLeft size={16} /> Back
          </button>
          <button onClick={goNext} disabled={!canContinue || loading} className="btn-primary">
            {loading ? 'Saving...' : step === 7 ? 'Complete check-in' : 'Continue'}
            {!loading && <ArrowRight size={16} />}
          </button>
        </div>
      )}
    </div>
  )
}
