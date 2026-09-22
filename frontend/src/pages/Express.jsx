import { useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mic, MicOff, Type, ArrowRight, RotateCcw, Edit3, AlertCircle } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { api } from '../lib/api'

const DEMO_TEXT = "I've been really stressed about my exams and I'm finding it difficult to concentrate. The workload feels overwhelming and I haven't been sleeping well."

export default function Express() {
  const navigate = useNavigate()
  const { dispatch, showToast, state } = useApp()
  const [tab, setTab] = useState('write')
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)

  // Voice states: idle | listening | processing | done
  const [voiceState, setVoiceState] = useState('idle')
  const [transcript, setTranscript] = useState('')
  const [voiceError, setVoiceError] = useState('')
  const recognitionRef = useRef(null)

  const hasSpeechAPI = typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)

  const startListening = useCallback(() => {
    if (!hasSpeechAPI) {
      setVoiceError('Speech recognition is not supported in this browser. Please use Chrome or Edge, or use the text input tab.')
      return
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onstart = () => {
      setVoiceState('listening')
      setVoiceError('')
      setTranscript('')
    }
    recognition.onresult = (event) => {
      const t = Array.from(event.results)
        .map(r => r[0].transcript)
        .join('')
      setTranscript(t)
    }
    recognition.onerror = (event) => {
      setVoiceState('idle')
      if (event.error === 'not-allowed') {
        setVoiceError('Microphone access was denied. Please allow microphone access and try again.')
      } else {
        setVoiceError(`Voice recognition error: ${event.error}. Please try again or use text input.`)
      }
    }
    recognition.onend = () => {
      setVoiceState('done')
    }

    recognitionRef.current = recognition
    recognition.start()
  }, [hasSpeechAPI])

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setVoiceState('processing')
      setTimeout(() => setVoiceState('done'), 600)
    }
  }, [])

  const resetVoice = () => {
    setVoiceState('idle')
    setTranscript('')
    setVoiceError('')
  }

  const useDemoText = () => {
    if (tab === 'write') {
      setText(DEMO_TEXT)
    } else {
      setTranscript(DEMO_TEXT)
      setVoiceState('done')
    }
  }

  const activeText = tab === 'write' ? text : transcript

  const handleAnalyze = async () => {
    const textToAnalyze = activeText.trim()
    if (!textToAnalyze) {
      showToast('Please enter or speak some text before continuing.', 'error')
      return
    }
    setLoading(true)
    dispatch({ type: 'SET_EXPRESS_TEXT', payload: textToAnalyze })
    try {
      const result = await api.analyze(textToAnalyze, state.assessment)
      dispatch({ type: 'SET_ANALYSIS_RESULT', payload: result })
      navigate('/analysis')
    } catch (e) {
      showToast('Could not reach the backend. Using demo analysis.', 'info')
      // Fallback demo result
      dispatch({
        type: 'SET_ANALYSIS_RESULT',
        payload: {
          concern: 'Examination Stress',
          observed_areas: ['Examination pressure', 'Difficulty concentrating', 'Emotional exhaustion'],
          support_level: 'Moderate',
          well_being_score: 2.8,
          description: 'Your responses suggest some areas that may benefit from additional support and resources.',
          recommendations: ['Self-help resources', 'Academic mentoring', 'Peer support groups'],
          disclaimer: 'Your responses suggest areas that may benefit from support. MindBridge does not diagnose mental-health conditions.',
        },
      })
      navigate('/analysis')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="section-title mb-1">Tell us what's been on your mind.</h1>
        <p className="text-calm-500 text-sm">Share in your own words — written or spoken. There are no right or wrong answers.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-calm-100 p-1 rounded-xl mb-6 w-fit">
        {['write', 'speak'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              tab === t
                ? 'bg-white text-calm-900 shadow-sm'
                : 'text-calm-500 hover:text-calm-700'
            }`}
          >
            {t === 'write' ? <Type size={15} /> : <Mic size={15} />}
            {t === 'write' ? 'Write' : 'Speak'}
          </button>
        ))}
      </div>

      {/* Write tab */}
      {tab === 'write' && (
        <div className="card p-6 mb-6 fade-in">
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Share what's been troubling you... For example: I've been really stressed about my exams and I'm finding it difficult to concentrate."
            className="input-field min-h-[180px] resize-none leading-relaxed"
            maxLength={2000}
          />
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-calm-400">{text.length}/2000 characters</span>
            <button onClick={useDemoText} className="text-xs text-brand-500 hover:text-brand-700 font-medium transition-colors">
              Use demo text
            </button>
          </div>
        </div>
      )}

      {/* Voice tab */}
      {tab === 'speak' && (
        <div className="card p-8 mb-6 fade-in text-center">
          {!hasSpeechAPI && (
            <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-left">
              <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-800">Speech recognition not available</p>
                <p className="text-xs text-amber-700 mt-0.5">
                  Your browser doesn't support the Web Speech API. Please use Chrome or Edge, or switch to the Write tab.
                </p>
                <button onClick={useDemoText} className="text-xs text-brand-600 hover:text-brand-700 font-medium mt-2 underline">
                  Load demo transcript instead
                </button>
              </div>
            </div>
          )}

          {voiceError && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-left">
              <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{voiceError}</p>
            </div>
          )}

          {/* Mic button */}
          {voiceState !== 'done' && (
            <div className="relative inline-flex items-center justify-center mb-6">
              {voiceState === 'listening' && (
                <>
                  <span className="absolute w-28 h-28 rounded-full bg-brand-200 pulse-ring" />
                  <span className="absolute w-20 h-20 rounded-full bg-brand-300 pulse-ring" style={{ animationDelay: '0.3s' }} />
                </>
              )}
              <button
                onClick={voiceState === 'idle' ? startListening : stopListening}
                disabled={!hasSpeechAPI && voiceState === 'idle'}
                className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg disabled:opacity-40 disabled:cursor-not-allowed ${
                  voiceState === 'listening'
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-brand-600 hover:bg-brand-700 text-white'
                }`}
              >
                {voiceState === 'listening' ? <MicOff size={28} /> : <Mic size={28} />}
              </button>
            </div>
          )}

          <p className="text-sm font-medium text-calm-700 mb-2">
            {voiceState === 'idle' && 'Tap to speak'}
            {voiceState === 'listening' && '🔴 Listening... tap to stop'}
            {voiceState === 'processing' && 'Processing your speech...'}
            {voiceState === 'done' && 'Transcription complete'}
          </p>

          {/* Transcript display */}
          {(transcript || voiceState === 'done') && (
            <div className="mt-4">
              <div className="bg-calm-50 rounded-xl p-4 text-left mb-3">
                {transcript
                  ? <p className="text-sm text-calm-800 leading-relaxed">{transcript}</p>
                  : <p className="text-sm text-calm-400 italic">No speech detected.</p>
                }
              </div>
              {transcript && (
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => { setText(transcript); setTab('write') }}
                    className="btn-ghost text-sm"
                  >
                    <Edit3 size={14} /> Edit text
                  </button>
                  <button onClick={resetVoice} className="btn-ghost text-sm">
                    <RotateCcw size={14} /> Try again
                  </button>
                </div>
              )}
            </div>
          )}

          {voiceState === 'idle' && !voiceError && hasSpeechAPI && (
            <div className="mt-4">
              <button onClick={useDemoText} className="text-xs text-brand-500 hover:text-brand-700 font-medium transition-colors">
                Use demo transcript instead
              </button>
            </div>
          )}
        </div>
      )}

      {/* Analyze button */}
      <button
        onClick={handleAnalyze}
        disabled={!activeText.trim() || loading}
        className="btn-primary w-full justify-center text-base py-3"
      >
        {loading ? 'Analyzing...' : 'Analyze My Response'}
        {!loading && <ArrowRight size={18} />}
      </button>

      <p className="text-xs text-calm-400 text-center mt-4">
        Your response is analyzed to identify areas that may benefit from support. It is not used for diagnosis.
      </p>
    </div>
  )
}
