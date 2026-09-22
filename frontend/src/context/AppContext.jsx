import { createContext, useContext, useReducer, useCallback } from 'react'

const AppContext = createContext(null)

const initialState = {
  assessment: {},
  expressText: '',
  analysisResult: null,
  toast: null,
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

  return (
    <AppContext.Provider value={{ state, dispatch, showToast }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
