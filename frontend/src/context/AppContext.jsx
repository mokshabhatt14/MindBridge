import { createContext, useContext, useReducer, useCallback } from 'react'

const AppContext = createContext(null)

const initialState = {
  assessment: {},
  expressText: '',
  analysisResult: null,
  toast: null,
  session: readStoredSession(),
}

function readStoredSession() {
  try {
    return JSON.parse(localStorage.getItem('mindbridge-session') || 'null')
  } catch {
    return null
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_ASSESSMENT':
      return { ...state, assessment: action.payload }
    case 'SET_EXPRESS_TEXT':
      return { ...state, expressText: action.payload }
    case 'SET_ANALYSIS_RESULT':
      return { ...state, analysisResult: action.payload }
    case 'SHOW_TOAST':
      return { ...state, toast: action.payload }
    case 'CLEAR_TOAST':
      return { ...state, toast: null }
    case 'SET_SESSION':
      return { ...state, session: action.payload }
    case 'CLEAR_SESSION':
      return { ...state, session: null }
    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const showToast = useCallback((message, type = 'info') => {
    dispatch({ type: 'SHOW_TOAST', payload: { message, type } })
    setTimeout(() => dispatch({ type: 'CLEAR_TOAST' }), 4000)
  }, [])

  const setSession = useCallback((session) => {
    localStorage.setItem('mindbridge-session', JSON.stringify(session))
    dispatch({ type: 'SET_SESSION', payload: session })
  }, [])

  const signOut = useCallback(() => {
    localStorage.removeItem('mindbridge-session')
    dispatch({ type: 'CLEAR_SESSION' })
  }, [])

  return (
    <AppContext.Provider value={{ state, dispatch, showToast, setSession, signOut }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
