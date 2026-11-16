import { useEffect, useState } from 'react'
import { CalendarClock, CheckCircle2, Send } from 'lucide-react'
import { api } from '../lib/api'

const today = new Date().toISOString().slice(0, 10)

export default function AppointmentRequest() {
  const [appointments, setAppointments] = useState([])
  const [counselor, setCounselor] = useState('Student Counselling Services')
  const [preferredDate, setPreferredDate] = useState('')
  const [preferredTime, setPreferredTime] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const loadAppointments = () => api.getAppointments().then(result => setAppointments(result.appointments))

  useEffect(() => {
    loadAppointments().catch(requestError => setError(requestError.message))
  }, [])

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setSent(false)
    setLoading(true)
    try {
      await api.createAppointment({
        counselor,
        preferred_date: preferredDate,
        preferred_time: preferredTime,
        message,
      })
      setSent(true)
      setPreferredDate('')
      setPreferredTime('')
      setMessage('')
      await loadAppointments()
    } catch (requestError) {
      setError(requestError.message || 'Could not send your request.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container max-w-4xl fade-in">
      <div className="mb-7">
        <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-4">
          <CalendarClock size={21} />
        </div>
        <h1 className="section-title mb-2">Request a counselling appointment</h1>
        <p className="text-sm text-calm-500">Tell the counselling team when you would like to meet. Your request is private and will only be visible to you and authorized administrators.</p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6 items-start">
        <form onSubmit={submit} className="card p-6 space-y-4 lg:col-span-3">
          <label className="block text-sm font-medium text-calm-700">
            Counsellor or service
            <input className="input-field mt-1.5" required minLength={2} maxLength={120} value={counselor} onChange={event => setCounselor(event.target.value)} />
          </label>
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block text-sm font-medium text-calm-700">
              Preferred date
              <input className="input-field mt-1.5" type="date" min={today} required value={preferredDate} onChange={event => setPreferredDate(event.target.value)} />
            </label>
            <label className="block text-sm font-medium text-calm-700">
              Preferred time
              <select className="input-field mt-1.5" required value={preferredTime} onChange={event => setPreferredTime(event.target.value)}>
                <option value="">Select a time</option>
                <option>Morning (9 AM–12 PM)</option>
                <option>Afternoon (12–3 PM)</option>
                <option>Late afternoon (3–6 PM)</option>
                <option>Flexible</option>
              </select>
            </label>
          </div>
          <label className="block text-sm font-medium text-calm-700">
            Anything you would like the counsellor to know? <span className="font-normal text-calm-400">(optional)</span>
            <textarea className="input-field mt-1.5 min-h-28 resize-y" maxLength={2000} value={message} onChange={event => setMessage(event.target.value)} placeholder="Share only what you feel comfortable sharing." />
          </label>
          {error && <p role="alert" className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5">{error}</p>}
          {sent && <p role="status" className="flex items-center gap-2 text-sm text-green-800 bg-green-50 border border-green-200 rounded-xl px-3 py-2.5"><CheckCircle2 size={16} /> Request sent to the counselling team for follow-up.</p>}
          <button className="btn-primary justify-center w-full sm:w-auto" disabled={loading}>
            <Send size={15} /> {loading ? 'Sending…' : 'Send appointment request'}
          </button>
          <p className="text-xs text-calm-400">This request is not an emergency service. For urgent help, contact local emergency services or a crisis helpline.</p>
        </form>

        <section className="card p-6 lg:col-span-2">
          <h2 className="font-semibold text-calm-900 mb-1">Your requests</h2>
          <p className="text-xs text-calm-400 mb-4">Only you can see your appointment history.</p>
          {appointments.length === 0 ? (
            <p className="text-sm text-calm-500 py-4">No appointment requests yet.</p>
          ) : (
            <div className="space-y-3">
              {appointments.map(item => (
                <div key={item.id} className="border border-calm-100 rounded-xl p-3">
                  <p className="text-sm font-medium text-calm-800">{item.counselor}</p>
                  <p className="text-xs text-calm-500 mt-1">{item.preferred_date} · {item.preferred_time}</p>
                  <span className="badge bg-amber-50 text-amber-700 mt-2">{item.status}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
