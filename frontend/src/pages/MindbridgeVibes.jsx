import { useMemo, useState } from 'react'
import { ExternalLink, Heart, Music2, Sparkles, Compass } from 'lucide-react'
import { useApp } from '../context/AppContext'

const moodOptions = [
  {
    id: 'stressed',
    label: 'Stressed',
    emoji: '🌿',
    description: 'Lo-fi, acoustic, instrumental and calming music.',
    tracks: [
      { title: 'Lo-fi Drift', artist: 'Night Avenue', genre: 'Lo-fi', language: 'English', url: 'https://open.spotify.com/search/lofi%20drift', album: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=700&q=80' },
      { title: 'Quiet Rain', artist: 'Hush Harbor', genre: 'Ambient', language: 'English', url: 'https://open.spotify.com/search/quiet%20rain%20ambient', album: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=700&q=80' },
      { title: 'Acoustic Calm', artist: 'Sunset Notes', genre: 'Acoustic', language: 'English', url: 'https://open.spotify.com/search/acoustic%20calm', album: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=700&q=80' },
    ],
  },
  {
    id: 'anxious',
    label: 'Anxious',
    emoji: '🌧️',
    description: 'Soft piano, ambient music and nature sounds.',
    tracks: [
      { title: 'Piano Breath', artist: 'Morning Echo', genre: 'Piano', language: 'English', url: 'https://open.spotify.com/search/soft%20piano%20ambient', album: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=700&q=80' },
      { title: 'Forest Calm', artist: 'Nature Loop', genre: 'Nature', language: 'English', url: 'https://open.spotify.com/search/nature%20sounds%20forest', album: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=700&q=80' },
      { title: 'Night Wind', artist: 'Glass Tide', genre: 'Ambient', language: 'English', url: 'https://open.spotify.com/search/night%20wind%20ambient', album: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=700&q=80' },
    ],
  },
  {
    id: 'sad',
    label: 'Sad',
    emoji: '💙',
    description: 'Comfort songs and uplifting acoustic music.',
    tracks: [
      { title: 'Warm Light', artist: 'Lantern Bloom', genre: 'Acoustic', language: 'Hindi', url: 'https://music.youtube.com/search?q=warm+light+lantern+bloom', album: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=700&q=80' },
      { title: 'Mellow Road', artist: 'Saffron Drift', genre: 'Indie', language: 'Hindi', url: 'https://open.spotify.com/search/mellow%20road%20saffron%20drift', album: 'https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2?auto=format&fit=crop&w=700&q=80' },
      { title: 'Slow Sunrise', artist: 'Reed & Bloom', genre: 'Soft Pop', language: 'Tamil', url: 'https://music.youtube.com/search?q=slow+sunrise+reed+and+bloom', album: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=700&q=80' },
    ],
  },
  {
    id: 'happy',
    label: 'Happy',
    emoji: '😊',
    description: 'Energetic pop and upbeat music.',
    tracks: [
      { title: 'Bright Side', artist: 'Sunline', genre: 'Pop', language: 'English', url: 'https://open.spotify.com/search/bright%20side%20sunline', album: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=700&q=80' },
      { title: 'Good Mood', artist: 'City Bop', genre: 'Dance', language: 'English', url: 'https://music.youtube.com/search?q=good+mood+city+bop', album: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=700&q=80' },
      { title: 'Golden Hour', artist: 'Clover Hill', genre: 'Pop', language: 'Hindi', url: 'https://open.spotify.com/search/golden%20hour%20clover%20hill', album: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=700&q=80' },
    ],
  },
  {
    id: 'motivated',
    label: 'Motivated',
    emoji: '⚡',
    description: 'Motivational and energetic playlists.',
    tracks: [
      { title: 'Momentum', artist: 'Trail Break', genre: 'Motivational', language: 'English', url: 'https://open.spotify.com/search/momentum%20trail%20break', album: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=700&q=80' },
      { title: 'Rise Fast', artist: 'Signal Run', genre: 'Energy', language: 'English', url: 'https://music.youtube.com/search?q=rise+fast+signal+run', album: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=700&q=80' },
      { title: 'Step Forward', artist: 'Onward Club', genre: 'Workout', language: 'Hindi', url: 'https://open.spotify.com/search/step%20forward%20onward%20club', album: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=700&q=80' },
    ],
  },
  {
    id: 'unmotivated',
    label: 'Unmotivated',
    emoji: '😵',
    description: 'Gentle encouragement, warm beats and positive energy.',
    tracks: [
      { title: 'Small Wins', artist: 'Compass Club', genre: 'Motivational', language: 'English', url: 'https://open.spotify.com/search/small%20wins%20compass%20club', album: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=700&q=80' },
      { title: 'Start Again', artist: 'Eden Lane', genre: 'Warm Beats', language: 'Kannada', url: 'https://music.youtube.com/search?q=start+again+eden+lane', album: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=700&q=80' },
      { title: 'Spark Routine', artist: 'Kind Horizon', genre: 'Indie', language: 'Telugu', url: 'https://open.spotify.com/search/spark%20routine%20kind%20horizon', album: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=700&q=80' },
    ],
  },
  {
    id: 'focused',
    label: 'Focused',
    emoji: '🎧',
    description: 'Deep-focus instrumental music and study beats.',
    tracks: [
      { title: 'Deep Work', artist: 'Study Arc', genre: 'Instrumental', language: 'English', url: 'https://open.spotify.com/search/deep%20work%20study%20arc', album: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=700&q=80' },
      { title: 'Focus Flow', artist: 'Harbor Loop', genre: 'Study Beats', language: 'English', url: 'https://music.youtube.com/search?q=focus+flow+harbor+loop', album: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=700&q=80' },
      { title: 'Quiet Sprint', artist: 'Night Signal', genre: 'Instrumental', language: 'Tamil', url: 'https://open.spotify.com/search/quiet%20sprint%20night%20signal', album: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=700&q=80' },
    ],
  },
  {
    id: 'lonely',
    label: 'Lonely',
    emoji: '🌙',
    description: 'Comfort music, nostalgic songs and uplifting playlists.',
    tracks: [
      { title: 'Moonlight Notes', artist: 'Cloud Echo', genre: 'Comfort', language: 'English', url: 'https://music.youtube.com/search?q=moonlight+notes+cloud+echo', album: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=700&q=80' },
      { title: 'Open Road', artist: 'Drift House', genre: 'Nostalgia', language: 'Telugu', url: 'https://open.spotify.com/search/open%20road%20drift%20house', album: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=700&q=80' },
      { title: 'Warm Company', artist: 'Sunset Choir', genre: 'Uplifting', language: 'Kannada', url: 'https://music.youtube.com/search?q=warm+company+sunset+choir', album: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=700&q=80' },
    ],
  },
  {
    id: 'relaxed',
    label: 'Relaxed',
    emoji: '🌊',
    description: 'Slow-burn jazz, mellow house and breezy instrumental sets.',
    tracks: [
      { title: 'Soft Current', artist: 'Coastline', genre: 'Chill', language: 'English', url: 'https://open.spotify.com/search/soft%20current%20coastline', album: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=700&q=80' },
      { title: 'Sunset Jazz', artist: 'Velvet Lane', genre: 'Jazz', language: 'Telugu', url: 'https://music.youtube.com/search?q=sunset+jazz+velvet+lane', album: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=700&q=80' },
      { title: 'Mellow Tide', artist: 'Blue Harbor', genre: 'House', language: 'English', url: 'https://open.spotify.com/search/mellow%20tide%20blue%20harbor', album: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=700&q=80' },
    ],
  },
]

const languageOptions = ['English', 'Hindi', 'Kannada', 'Tamil', 'Telugu']
const genreOptions = ['Any', 'Lo-fi', 'Acoustic', 'Ambient', 'Piano', 'Pop', 'Instrumental', 'Indie', 'Chill', 'Motivational']

export default function MindbridgeVibes() {
  const { showToast } = useApp()
  const [language, setLanguage] = useState('English')
  const [genre, setGenre] = useState('Any')
  const [selectedMood, setSelectedMood] = useState('stressed')
  const [favoriteSongs, setFavoriteSongs] = useState('')
  const [favorites, setFavorites] = useState({})
  const [recentlyExplored, setRecentlyExplored] = useState(['Lo-fi Drift', 'Piano Breath'])

  const activeMood = moodOptions.find(mood => mood.id === selectedMood) || moodOptions[0]

  const filteredTracks = useMemo(() => {
    return activeMood.tracks.filter(track => {
      const matchesLanguage = language === 'Any' || track.language === language
      const matchesGenre = genre === 'Any' || track.genre === genre
      const matchesFavorite = !favoriteSongs || favoriteSongs.trim() === '' || track.title.toLowerCase().includes(favoriteSongs.toLowerCase()) || track.artist.toLowerCase().includes(favoriteSongs.toLowerCase())
      return matchesLanguage && matchesGenre && matchesFavorite
    })
  }, [activeMood, favoriteSongs, genre, language])

  const toggleFavorite = (title) => {
    setFavorites(prev => ({
      ...prev,
      [title]: !prev[title],
    }))
    showToast(favorites[title] ? 'Removed from favourites' : 'Added to favourites', 'success')
  }

  const openTrack = (track) => {
    setRecentlyExplored(prev => [track.title, ...prev.filter(item => item !== track.title)].slice(0, 4))
    window.open(track.url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="page-container max-w-6xl mx-auto fade-in">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-700 px-3 py-1.5 rounded-full border border-brand-100 text-xs font-medium uppercase tracking-wide">
          <Music2 size={13} /> MindBridge Vibes
        </div>
        <h1 className="section-title mt-3 mb-2">Tune into how you feel.</h1>
        <p className="text-calm-500 text-sm max-w-2xl">
          Choose your current mood, preferred language and genre to discover playlists that match your energy without forcing a mood from the assessment.
        </p>
      </div>

      <div className="card p-6 mb-6 bg-gradient-to-r from-brand-50 via-white to-teal-50 border-brand-100">
        <div className="grid lg:grid-cols-4 gap-4">
          <label className="block text-sm font-medium text-calm-700">
            Preferred language
            <select value={language} onChange={event => setLanguage(event.target.value)} className="input-field mt-1.5">
              {languageOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-medium text-calm-700">
            Preferred genre
            <select value={genre} onChange={event => setGenre(event.target.value)} className="input-field mt-1.5">
              {genreOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-medium text-calm-700 lg:col-span-2">
            Favourite songs or artists
            <input
              value={favoriteSongs}
              onChange={event => setFavoriteSongs(event.target.value)}
              placeholder="Try a song name or artist"
              className="input-field mt-1.5"
            />
          </label>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-calm-900">Mood selection</h2>
          <span className="text-xs text-calm-500">Tap a vibe to explore</span>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {moodOptions.map(mood => (
            <button
              key={mood.id}
              onClick={() => setSelectedMood(mood.id)}
              className={`card p-4 text-left transition-all duration-200 ${selectedMood === mood.id ? 'ring-2 ring-brand-200 border-brand-200 bg-brand-50/40' : 'hover:border-brand-200'}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{mood.emoji}</span>
                <span className="text-xs font-medium text-calm-500">{mood.tracks.length} picks</span>
              </div>
              <h3 className="font-semibold text-calm-900 mb-1">{mood.label}</h3>
              <p className="text-xs text-calm-500 leading-relaxed">{mood.description}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.4fr_0.6fr] gap-6 mb-6">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-calm-400 mb-1">Featured playlists</p>
              <h2 className="text-xl font-semibold text-calm-900">{activeMood.label} mood mix</h2>
            </div>
            <div className="text-3xl">{activeMood.emoji}</div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {filteredTracks.slice(0, 3).map(track => (
              <div key={track.title} className="bg-calm-50 border border-calm-200 rounded-2xl overflow-hidden">
                <img src={track.album} alt={track.title} className="w-full h-32 object-cover" />
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-calm-900 text-sm">{track.title}</p>
                      <p className="text-xs text-calm-500 mt-1">{track.artist}</p>
                    </div>
                    <button onClick={() => toggleFavorite(track.title)} className="text-calm-400 hover:text-rose-500 transition-colors" aria-label={`Toggle favourite for ${track.title}`}>
                      <Heart size={16} fill={favorites[track.title] ? '#ef4444' : 'none'} className={favorites[track.title] ? 'text-rose-500' : ''} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-3 text-[11px] text-calm-500">
                    <span className="badge bg-white text-calm-600">{track.genre}</span>
                    <span>{track.language}</span>
                  </div>
                  <button onClick={() => openTrack(track)} className="btn-secondary w-full justify-center mt-3 text-xs py-2.5">
                    <ExternalLink size={14} /> Open listening link
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Compass size={18} className="text-brand-500" />
            <h3 className="font-semibold text-calm-900">Recently explored</h3>
          </div>
          <div className="space-y-3">
            {recentlyExplored.map(item => (
              <div key={item} className="flex items-center justify-between rounded-xl bg-calm-50 px-3 py-2 text-sm text-calm-700 border border-calm-200">
                <span>{item}</span>
                <Sparkles size={14} className="text-brand-500" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-calm-400 mb-1">Recommended tracks</p>
            <h2 className="text-xl font-semibold text-calm-900">For {activeMood.label.toLowerCase()} energy</h2>
          </div>
          <span className="text-xs text-calm-500">{filteredTracks.length} tracks</span>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredTracks.map(track => (
            <div key={`${track.title}-${track.artist}`} className="border border-calm-200 rounded-2xl p-4 bg-white hover:shadow-sm transition-shadow">
              <div className="flex items-start gap-3">
                <img src={track.album} alt={track.title} className="w-16 h-16 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-calm-900 truncate">{track.title}</p>
                      <p className="text-xs text-calm-500">{track.artist}</p>
                    </div>
                    <button onClick={() => toggleFavorite(track.title)} className="text-calm-400 hover:text-rose-500 transition-colors" aria-label={`Make ${track.title} a favourite`}>
                      <Heart size={15} fill={favorites[track.title] ? '#ef4444' : 'none'} className={favorites[track.title] ? 'text-rose-500' : ''} />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2 text-[10px] text-calm-500">
                    <span className="badge bg-calm-100 text-calm-600">{track.genre}</span>
                    <span className="badge bg-calm-100 text-calm-600">{track.language}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <button onClick={() => openTrack(track)} className="btn-primary text-xs px-3 py-2 flex-1 justify-center">
                  <ExternalLink size={13} /> Open link
                </button>
                <button onClick={() => toggleFavorite(track.title)} className="btn-secondary text-xs px-3 py-2">
                  {favorites[track.title] ? 'Saved' : 'Favourite'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
