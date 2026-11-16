import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Activity, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { api } from '../lib/api'

export default function AuthPage({ admin = false }) {
  const { state, setSession } = useApp()
  const location = useLocation()
  const navigate = useNavigate()
  const [signup, setSignup] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (state.session) {
    return <Navigate to={state.session.user?.role === 'admin' ? '/institution' : '/dashboard'} replace />
  }

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      const session = admin
        ? await api.adminLogin({ email, password })
        : signup
          ? await api.studentSignup({ name, email, password })
          : await api.studentLogin({ email, password })
      setSession(session)
      const destination = location.state?.from?.pathname
      navigate(destination && destination !== '/institution' ? destination : (admin ? '/institution' : '/dashboard'), { replace: true })
    } catch (requestError) {
      setError(requestError.message || 'Unable to sign in. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50/70 to-white px-4 py-10 flex flex-col">
      <div className="max-w-5xl w-full mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-calm-600 hover:text-brand-700">
          <ArrowLeft size={16} /> Back to MindBridge
        </Link>
      </div>
      <div className="flex-1 flex items-center justify-center py-10">
        <div className="card w-full max-w-md p-7 sm:p-9">
          <div className="w-12 h-12 bg-brand-600 rounded-2xl flex items-center justify-center mb-5">
            {admin ? <ShieldCheck size={23} className="text-white" /> : <Activity size={23} className="text-white" />}
          </div>
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-700 mb-2">
            {admin ? 'Administrator access' : 'Student account'}
          </p>
          <h1 className="text-2xl font-bold text-calm-900 mb-2">
            {admin ? 'Admin sign in' : signup ? 'Create your account' : 'Welcome back'}
          </h1>
          <p className="text-sm text-calm-500 mb-7">
            {admin
              ? 'Sign in with the private administrator credentials.'
              : signup
                ? 'Create a private account to access student support.'
                : 'Sign in to continue to your well-being dashboard.'}
          </p>

          <form onSubmit={submit} className="space-y-4">
            {signup && (
              <label className="block text-sm font-medium text-calm-700">
                Full name
                <input className="input-field mt-1.5" autoComplete="name" required minLength={2} maxLength={100} value={name} onChange={event => setName(event.target.value)} />
              </label>
            )}
            <label className="block text-sm font-medium text-calm-700">
              Email address
              <input className="input-field mt-1.5" type="email" autoComplete="email" required maxLength={254} value={email} onChange={event => setEmail(event.target.value)} />
            </label>
            <label className="block text-sm font-medium text-calm-700">
              Password
              <input className="input-field mt-1.5" type="password" autoComplete={signup ? 'new-password' : 'current-password'} required minLength={signup ? 8 : 1} maxLength={128} value={password} onChange={event => setPassword(event.target.value)} />
              {signup && <span className="block text-xs text-calm-400 mt-1">Use at least 8 characters.</span>}
            </label>

            {error && <p role="alert" className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5">{error}</p>}

            <button disabled={loading} className="btn-primary w-full justify-center py-3">
              {loading ? 'Please wait…' : admin ? 'Sign in securely' : signup ? 'Create account' : 'Sign in'}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          {!admin && (
            <p className="text-sm text-center text-calm-500 mt-6">
              {signup ? 'Already have an account?' : 'New to MindBridge?'}{' '}
              <button type="button" onClick={() => { setSignup(!signup); setError('') }} className="font-semibold text-brand-700 hover:text-brand-800">
                {signup ? 'Sign in' : 'Create an account'}
              </button>
            </p>
          )}
          {admin && (
            <p className="text-xs text-calm-400 text-center mt-6">Administrator accounts are provisioned through server configuration.</p>
          )}
          {!admin && (
            <p className="text-center mt-5">
              <Link to="/admin/login" className="text-xs text-calm-400 hover:text-brand-700">Administrator sign in</Link>
            </p>
          )}
        </div>
      </div>
      <p className="text-center text-xs text-calm-400">MindBridge offers support navigation and is not a diagnosis tool.</p>
    </div>
  )
}
