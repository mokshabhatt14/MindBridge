import { useEffect, useMemo, useState } from 'react'
import { ExternalLink, Globe2, Heart, Music2, RefreshCw, Shuffle, Sparkles } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { api } from '../lib/api'

const LANGUAGES = [
  'Any', 'English', 'Hindi', 'Kannada', 'Telugu', 'Tamil', 'Malayalam',
  'Bengali', 'Marathi', 'Punjabi', 'Gujarati', 'Urdu', 'Spanish',
  'Korean', 'Japanese', 'French',
]

const MOODS = [
  { id: 'happy', label: 'Happy' },
  { id: 'sad', label: 'Sad' },
  { id: 'stressed', label: 'Stressed' },
  { id: 'anxious', label: 'Anxious' },
  { id: 'lonely', label: 'Lonely' },
  { id: 'motivated', label: 'Motivated' },
  { id: 'calm', label: 'Calm' },
  { id: 'overwhelmed', label: 'Overwhelmed' },
  { id: 'tired', label: 'Tired' },
  { id: 'hopeful', label: 'Hopeful' },
  { id: 'excited', label: 'Excited' },
  { id: 'peaceful', label: 'Peaceful' },
]

export default function MindbridgeVibes() {
  const { state, showToast } = useApp()
  const assessmentMood = String(state.assessment?.mood_label || 'stressed').toLowerCase()
  const [selectedMood, setSelectedMood] = useState(
    MOODS.find(mood => mood.id === assessmentMood)?.id || 'stressed'
  )
  const [languages, setLanguages] = useState(['Any'])
  const [tracks, setTracks] = useState([])
  const [limit, setLimit] = useState(6)
  const [loading, setLoading] = useState(false)
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('mindbridge-music-favorites') || '{}')
    } catch {
      return {}
    }
  })

  const selectedMoodLabel = useMemo(
    () => MOODS.find(mood => mood.id === selectedMood)?.label || 'Current mood',
    [selectedMood]
  )

  const persistFavorites = (next) => {
    setFavorites(next)
    localStorage.setItem('mindbridge-music-favorites', JSON.stringify(next))
  }

  const toggleFavorite = (track) => {
    const key = `${track.title}-${track.artist}`
    const next = { ...favorites, [key]: !favorites[key] }
    if (!next[key]) delete next[key]
    persistFavorites(next)
    showToast(next[key] ? 'Song saved to favourites' : 'Song removed from favourites', 'success')
  }

  const loadTracks = async ({ surprise = false, nextLimit = limit } = {}) => {
    setLoading(true)
    try {
      const response = await api.getMusicRecommendations({
        mood: surprise ? '' : selectedMood,
        languages,
        limit: nextLimit,
        surprise,
      })
      setTracks(response.recommendations || [])
    } catch (error) {
      showToast(error.message || 'Music recommendations could not be loaded.', 'error')
      setTracks([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const initialize = async () => {
      try {
        const preferences = await api.getMusicPreferences()
        if (preferences.languages?.length) setLanguages(preferences.languages)
      } catch {
        // Local language selection remains available if the backend is offline.
      }
      await loadTracks({})
    }
    initialize()
  }, [])

  const toggleLanguage = async (language) => {
    let next
    if (language === 'Any') {
      next = ['Any']
    } else {
      const withoutAny = languages.filter(item => item !== 'Any')
      next = withoutAny.includes(language)
        ? withoutAny.filter(item => item !== language)
        : [...withoutAny, language]
      if (!next.length) next = ['Any']
    }
    setLanguages(next)
    try {
      await api.saveMusicPreferences({ languages: next, genres: ['Any'] })
    } catch {
      // Preferences remain usable locally and can be saved again when online.
    }
  }

  useEffect(() => {
    if (languages.length) loadTracks({})
  }, [selectedMood, languages.join('|')])

  const exploreMore = () => {
    const nextLimit = Math.min(12, limit + 3)
    setLimit(nextLimit)
    loadTracks({ nextLimit })
  }

  const surpriseMe = () => loadTracks({ surprise: true, nextLimit: limit })

  return (
    <div className="page-container max-w-6xl mx-auto fade-in">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-50 text-violet-700 border border-violet-100 text-xs font-semibold uppercase tracking-wide">
            <Music2 size={13} /> MindBridge Vibes
          </div>
          <h1 className="text-3xl font-bold text-calm-900 mt-3">Your Mood, Your Music</h1>
          <p className="text-calm-500 mt-2 max-w-2xl">
            Discover multilingual music that meets you where you are. Listening is optional and is not a substitute for support.
          </p>
        </div>
        <button onClick={surpriseMe} disabled={loading} className="btn-secondary shrink-0">
          <Shuffle size={16} /> Surprise Me
        </button>
      </div>

      <div className="card p-5 sm:p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={17} className="text-brand-600" />
          <h2 className="font-semibold text-calm-900">How do you feel right now?</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {MOODS.map(mood => (
            <button
              key={mood.id}
              onClick={() => setSelectedMood(mood.id)}
              className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                selectedMood === mood.id
                  ? 'bg-brand-600 border-brand-600 text-white shadow-sm'
                  : 'bg-white border-calm-200 text-calm-700 hover:border-brand-300 hover:bg-brand-50'
              }`}
            >
              {mood.label}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-5 sm:p-6 mb-6">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Globe2 size={18} className="text-teal-600" />
            <h2 className="font-semibold text-calm-900">Preferred languages</h2>
          </div>
          <span className="text-xs text-calm-400">Choose one or several</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {LANGUAGES.map(language => {
            const active = languages.includes(language)
            return (
              <button
                key={language}
                onClick={() => toggleLanguage(language)}
                className={`px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                  active
                    ? 'bg-teal-600 border-teal-600 text-white'
                    : 'bg-white border-calm-200 text-calm-600 hover:border-teal-300'
                }`}
              >
                {language}
              </button>
            )
          })}
        </div>
      </div>

      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-calm-400 mb-1">Recommended for</p>
          <h2 className="text-xl font-bold text-calm-900">{selectedMoodLabel} · music mix</h2>
        </div>
        <button onClick={() => loadTracks({ surprise: false })} disabled={loading} className="btn-ghost text-sm">
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(item => (
            <div key={item} className="card h-56 animate-pulse bg-calm-100" />
          ))}
        </div>
      ) : tracks.length ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tracks.map(track => {
            const key = `${track.title}-${track.artist}`
            const favourite = Boolean(favorites[key])
            return (
              <article key={key} className="card p-5 flex flex-col hover:-translate-y-0.5 hover:shadow-md transition-all">
                <div className="flex items-start justify-between gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-100 to-teal-100 text-brand-600 flex items-center justify-center">
                    <Music2 size={21} />
                  </div>
                  <button
                    onClick={() => toggleFavorite(track)}
                    className="w-9 h-9 rounded-full border border-calm-200 flex items-center justify-center text-calm-400 hover:text-rose-500 hover:border-rose-200"
                    aria-label={favourite ? `Remove ${track.title} from favourites` : `Save ${track.title} to favourites`}
                  >
                    <Heart size={16} fill={favourite ? 'currentColor' : 'none'} />
                  </button>
                </div>
                <h3 className="text-lg font-bold text-calm-900 mt-4">{track.title}</h3>
                <p className="text-sm text-calm-500">{track.artist}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="badge bg-calm-100 text-calm-600">{track.language}</span>
                  <span className="badge bg-brand-50 text-brand-700">{track.genre}</span>
                </div>
                <p className="text-sm leading-relaxed text-calm-600 mt-4 flex-1">{track.reason}</p>
                <a
                  href={track.spotify_url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary w-full justify-center mt-5"
                >
                  Listen on Spotify <ExternalLink size={15} />
                </a>
                <a
                  href={track.youtube_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-medium text-calm-500 hover:text-brand-700 text-center mt-3"
                >
                  Search on YouTube
                </a>
              </article>
            )
          })}
        </div>
      ) : (
        <div className="card p-10 text-center">
          <Music2 size={28} className="mx-auto text-calm-400 mb-3" />
          <h3 className="font-semibold text-calm-900">No exact matches yet</h3>
          <p className="text-sm text-calm-500 mt-1">Try another mood or choose “Any” language.</p>
        </div>
      )}

      {tracks.length > 0 && (
        <button onClick={exploreMore} disabled={loading || limit >= 12} className="btn-secondary w-full justify-center mt-6">
          <RefreshCw size={15} /> Explore More Songs
        </button>
      )}
    </div>
  )
}
