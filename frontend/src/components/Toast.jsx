import { useEffect } from 'react'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'
import { useApp } from '../context/AppContext'

const icons = {
  success: <CheckCircle2 size={16} className="text-green-500" />,
  error:   <AlertCircle  size={16} className="text-red-500" />,
  info:    <Info         size={16} className="text-brand-500" />,
}

const bg = {
  success: 'bg-green-50 border-green-200',
  error:   'bg-red-50 border-red-200',
  info:    'bg-brand-50 border-brand-200',
}

export default function Toast() {
  const { state, dispatch } = useApp()
  const { toast } = state

  if (!toast) return null

  return (
    <div
      className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg fade-in max-w-sm ${bg[toast.type] || bg.info}`}
      role="alert"
    >
      {icons[toast.type] || icons.info}
      <span className="text-sm text-calm-800 flex-1">{toast.message}</span>
      <button
        onClick={() => dispatch({ type: 'CLEAR_TOAST' })}
        className="text-calm-400 hover:text-calm-600 transition-colors ml-1"
      >
        <X size={14} />
      </button>
    </div>
  )
}
