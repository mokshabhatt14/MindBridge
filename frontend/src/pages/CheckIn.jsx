import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { api } from '../lib/api'

const QUESTIONS = [
  {
    id: 'mood',
    question: 'How have you been feeling lately?',
    lowLabel: 'Very low',
    highLabel: 'Very good',
    step: 1,
  },
  {
    id: 'overwhelm',
    question: 'How overwhelmed have you felt by your academic workload?',
    lowLabel: 'Not at all',
    highLabel: 'Extremely overwhelmed',
    step: 1,
  },
  {
    id: 'concentration',
    question: 'How well have you been able to concentrate?',
    lowLabel: 'Very poorly',
    highLabel: 'Very well',
    step: 2,
  },
  {
    id: 'connection',
    question: 'How connected do you feel to people around you?',
    lowLabel: 'Very disconnected',
    highLabel: 'Very connected',
    step: 2,
  },
  {
    id: 'overall',
    question: 'How would you rate your overall well-being today?',
    lowLabel: 'Very poor',
    highLabel: 'Excellent',
    step: 3,
  },
]

const STEPS = 3
const STEP_LABELS = ['Feelings', 'Academics', 'Overall']

function ScaleCard({ question, value, onChange }) {
  const levels = [1, 2, 3, 4, 5]
  const emojis = ['😔', '😟', '😐', '🙂', '😊']

  return (
    <div className="fade-in">
      <h2 className="text-xl font-semibold text-calm-900 mb-2">{question.question}</h2>
      <p className="text-sm text-calm-500 mb-6">Select the option that best describes how you're feeling.</p>

      <div className="flex gap-3 justify-center mb-6">
        {levels.map((lvl) => (
          <button
            key={lvl}
            onClick={() => onChange(lvl)}
            className={`flex flex-col items-center gap-2 w-14 sm:w-16 py-4 rounded-2xl border-2 transition-all duration-200 ${
              value === lvl
                ? 'border-brand-500 bg-brand-50 shadow-sm scale-105'
                : 'border-calm-200 bg-white hover:border-brand-300 hover:bg-brand-50/50'
            }`}
          >
            <span className="text-2xl">{emojis[lvl - 1]}</span>
            <span className={`text-sm font-semibold ${value === lvl ? 'text-brand-700' : 'text-calm-700'}`}>{lvl}</span>
          </button>
        ))}
      </div>

      <div className="flex justify-between text-xs text-calm-400 px-2">
        <span>{question.lowLabel}</span>
        <span>{question.highLabel}</span>
      </div>
    </div>
  )
}

export default function CheckIn() {
  const navigate = useNavigate()
  const { dispatch, showToast } = useApp()
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState({ mood: 3, overwhelm: 3, concentration: 3, connection: 3, overall: 3 })
  const [loading, setLoading] = useState(false)

  const q = QUESTIONS[currentQ]
  const currentStep = q.step
  const isLast = currentQ === QUESTIONS.length - 1

  const stepProgress = (currentStep / STEPS) * 100

  const handleAnswer = (val) => {
    setAnswers(prev => ({ ...prev, [q.id]: val }))
  }

  const handleNext = async () => {
    if (isLast) {
      setLoading(true)
      try {
        await api.submitCheckIn(answers)
        dispatch({ type: 'SET_ASSESSMENT', payload: answers })
        showToast('Check-in saved! Now tell us more.', 'success')
        navigate('/express')
      } catch (e) {
        // Even if backend is down, continue with local state
        dispatch({ type: 'SET_ASSESSMENT', payload: answers })
        navigate('/express')
      } finally {
        setLoading(false)
      }
    } else {
      setCurrentQ(prev => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentQ > 0) setCurrentQ(prev => prev - 1)
  }

  return (
    <div className="page-container max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="section-title mb-1">Well-being Check-in</h1>
        <p className="text-calm-500 text-sm">This assessment helps us understand your current state.</p>
      </div>

      {/* Step progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-calm-700">
            Step {currentStep} of {STEPS} — {STEP_LABELS[currentStep - 1]}
          </span>
          <span className="text-sm text-calm-400">
            Question {currentQ + 1} / {QUESTIONS.length}
          </span>
        </div>
        <div className="h-2 bg-calm-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-500 rounded-full transition-all duration-500"
            style={{ width: `${((currentQ + 1) / QUESTIONS.length) * 100}%` }}
          />
        </div>
        <div className="flex gap-2 mt-3">
          {STEP_LABELS.map((label, i) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold ${
                i + 1 < currentStep ? 'bg-brand-500 text-white'
                : i + 1 === currentStep ? 'bg-brand-100 text-brand-700 ring-2 ring-brand-300'
                : 'bg-calm-100 text-calm-400'
              }`}>
                {i + 1 < currentStep ? <CheckCircle2 size={12} /> : i + 1}
              </div>
              <span className={`text-xs ${i + 1 === currentStep ? 'text-brand-700 font-medium' : 'text-calm-400'}`}>{label}</span>
              {i < 2 && <span className="text-calm-200 mx-1">›</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Question card */}
      <div className="card p-8 mb-6">
        <ScaleCard question={q} value={answers[q.id]} onChange={handleAnswer} />
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleBack}
          disabled={currentQ === 0}
          className="btn-secondary"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <button
          onClick={handleNext}
          disabled={loading}
          className="btn-primary"
        >
          {loading ? (
            <>Processing...</>
          ) : isLast ? (
            <>Continue — Express Yourself <ArrowRight size={16} /></>
          ) : (
            <>Next <ArrowRight size={16} /></>
          )}
        </button>
      </div>

      <p className="text-xs text-calm-400 text-center mt-6">
        All responses are confidential and used only to guide your support options.
      </p>
    </div>
  )
}
