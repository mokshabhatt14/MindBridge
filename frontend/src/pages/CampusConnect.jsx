import { useMemo, useState } from 'react'
import { Calendar, MapPin, Clock3, Sparkles, Ticket, ArrowRight } from 'lucide-react'
import { useApp } from '../context/AppContext'

const eventCategories = ['All', 'Technical', 'Cultural', 'Sports', 'Photography', 'Music and Dance', 'Art and Design', 'Volunteering', 'Animal Welfare', 'Entrepreneurship', 'Wellness']

const events = [
  {
    id: 'hack-night',
    title: 'Hack the Night',
    organiser: 'CodeNest Club',
    category: 'Technical',
    date: '18 Oct 2026',
    time: '6:30 PM',
    venue: 'Innovation Lab, Block C',
    description: 'Build in teams, prototype fast and pitch ideas to mentors in a relaxed late-evening sprint.',
    deadline: 'Registration closes in 2 days',
    poster: 'https://images.unsplash.com/photo-1516321165247-4aa89a48be28?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'festival-night',
    title: 'Campus Fest Night',
    organiser: 'Cultural Council',
    category: 'Cultural',
    date: '24 Oct 2026',
    time: '7:00 PM',
    venue: 'Open Air Theatre',
    description: 'A showcase of music, dance and student performances from across campus communities.',
    deadline: 'Limited seats left',
    poster: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'inter-school-sports',
    title: 'Inter-College Sports Cup',
    organiser: 'Sports Board',
    category: 'Sports',
    date: '01 Nov 2026',
    time: '9:00 AM',
    venue: 'North Field Arena',
    description: 'Join a friendly tournament with team matches, skill challenges and cheer squad participation.',
    deadline: 'Register before Friday',
    poster: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'lens-club',
    title: 'Frame the City',
    organiser: 'Lens Society',
    category: 'Photography',
    date: '06 Nov 2026',
    time: '4:00 PM',
    venue: 'Heritage Walk',
    description: 'Capture stories from campus life, architecture and everyday moments with fellow photographers.',
    deadline: 'Spotlight entries due soon',
    poster: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'groove-lab',
    title: 'Groove Lab Jam',
    organiser: 'Rhythm Collective',
    category: 'Music and Dance',
    date: '12 Nov 2026',
    time: '5:30 PM',
    venue: 'Music Studio',
    description: 'Jam, freestyle and learn choreography with beginner-friendly dance circles and session hosts.',
    deadline: 'Sign-up closes this week',
    poster: 'https://images.unsplash.com/photo-1501612780327-45045538702b?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'design-sprint',
    title: 'Creative Design Sprint',
    organiser: 'Visual Arts Guild',
    category: 'Art and Design',
    date: '15 Nov 2026',
    time: '2:00 PM',
    venue: 'Design Studio',
    description: 'Prototype posters, brand identities and visual stories in a collaborative design challenge.',
    deadline: 'Teams of 3–5 preferred',
    poster: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'community-drive',
    title: 'Community Care Drive',
    organiser: 'Volunteer Circle',
    category: 'Volunteering',
    date: '19 Nov 2026',
    time: '10:00 AM',
    venue: 'Student Court',
    description: 'Pack supplies, support outreach programs and join a campus-wide volunteering day.',
    deadline: 'Volunteer slots filling fast',
    poster: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'paw-friends',
    title: 'Paw Friends Adoption Fair',
    organiser: 'Animal Care Network',
    category: 'Animal Welfare',
    date: '22 Nov 2026',
    time: '11:00 AM',
    venue: 'Green Courtyard',
    description: 'Meet animal welfare leaders, discover adoption stories and volunteer for campus pet-care events.',
    deadline: 'Walk-ins welcome',
    poster: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'founders-lab',
    title: 'Founders Lab',
    organiser: 'Startup Cell',
    category: 'Entrepreneurship',
    date: '27 Nov 2026',
    time: '4:30 PM',
    venue: 'Startup Hub',
    description: 'Listen to student founders, pitch ideas and explore entrepreneurship workshops and networking.',
    deadline: 'Applications open until Friday',
    poster: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'wellness-circle',
    title: 'Wellness Circle',
    organiser: 'Student Wellness Team',
    category: 'Wellness',
    date: '30 Nov 2026',
    time: '6:00 PM',
    venue: 'Wellness Courtyard',
    description: 'Take part in mindful movement, guided breathwork and community conversations to recharge.',
    deadline: 'Open for first 30 registrations',
    poster: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80',
  },
]

export default function CampusConnect() {
  const { showToast } = useApp()
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [registered, setRegistered] = useState({})

  const filteredEvents = useMemo(() => {
    if (selectedCategory === 'All') return events
    return events.filter(event => event.category === selectedCategory)
  }, [selectedCategory])

  const handleRegister = (eventId, eventTitle) => {
    setRegistered(prev => ({ ...prev, [eventId]: !prev[eventId] }))
    showToast(
      registered[eventId] ? `You left ${eventTitle}` : `Registered for ${eventTitle}`,
      'success',
    )
  }

  return (
    <div className="page-container max-w-6xl mx-auto fade-in">
      <section className="card overflow-hidden mb-8 bg-gradient-to-r from-brand-50 via-white to-teal-50 border-brand-100">
        <div className="grid lg:grid-cols-[1.3fr_0.7fr]">
          <div className="p-8 lg:p-10">
            <div className="inline-flex items-center gap-2 bg-white text-brand-700 px-3 py-1.5 rounded-full border border-brand-100 text-xs font-medium uppercase tracking-wide">
              <Sparkles size={12} /> Campus Connect
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-calm-900 mt-4 leading-tight">
              Your Campus. Your Community. Your Next Adventure.
            </h1>
            <p className="mt-4 text-calm-600 max-w-xl text-sm md:text-base">
              Discover experiences, meet people and find your community.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button className="btn-primary">
                Explore events <ArrowRight size={16} />
              </button>
              <button className="btn-secondary">
                <Ticket size={15} /> My registrations
              </button>
            </div>
          </div>

          <div className="relative min-h-[220px]">
            <img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80" alt="Students at campus event" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-l from-brand-500/20 to-transparent" />
          </div>
        </div>
      </section>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-calm-900">Browse by category</h2>
          <span className="text-xs text-calm-500">{filteredEvents.length} events</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {eventCategories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === category ? 'bg-brand-600 text-white' : 'bg-calm-100 text-calm-700 hover:bg-calm-200'}`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <section className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredEvents.map(event => {
          const isRegistered = !!registered[event.id]

          return (
            <article key={event.id} className="card overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative">
                <img src={event.poster} alt={event.title} className="w-full h-52 object-cover" />
                <span className="absolute top-3 left-3 badge bg-white/90 text-calm-700 border border-calm-200">{event.category}</span>
              </div>

              <div className="p-5">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-calm-900 leading-tight">{event.title}</h3>
                  {isRegistered && <span className="badge bg-green-100 text-green-700">Registered</span>}
                </div>

                <p className="text-sm text-calm-500 mb-3">{event.organiser}</p>

                <div className="space-y-2 text-sm text-calm-700">
                  <div className="flex items-center gap-2"><Calendar size={14} className="text-brand-500" /> {event.date}</div>
                  <div className="flex items-center gap-2"><Clock3 size={14} className="text-brand-500" /> {event.time}</div>
                  <div className="flex items-center gap-2"><MapPin size={14} className="text-brand-500" /> {event.venue}</div>
                </div>

                <p className="text-sm text-calm-600 leading-relaxed mt-4">{event.description}</p>

                <div className="mt-4 flex items-center justify-between border-t border-calm-100 pt-3">
                  <span className="text-xs text-brand-600 font-medium">{event.deadline}</span>
                  <button onClick={() => handleRegister(event.id, event.title)} className={isRegistered ? 'btn-secondary text-xs px-3 py-2' : 'btn-primary text-xs px-3 py-2'}>
                    {isRegistered ? 'Registered' : 'Register'}
                  </button>
                </div>
              </div>
            </article>
          )
        })}
      </section>
    </div>
  )
}
