import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  BookOpen, Users, GraduationCap, HeartHandshake,
  ArrowRight, ExternalLink, PhoneCall, Globe,
  CheckCircle2, Sparkles
} from 'lucide-react'
import { useApp } from '../context/AppContext'

const supportCategories = {
  'self-help': {
    id: 'self-help',
    icon: BookOpen,
    title: 'Self-Help',
    tagline: 'Practical resources for managing academic pressure',
    color: 'border-t-brand-400',
    iconBg: 'bg-brand-50 text-brand-600',
    action: 'Explore resources',
    resources: [
      {
        id: 'breathing',
        title: 'Breathing exercises',
        type: 'Exercise',
        duration: '3 min',
        description: 'Try a four-square breathing cycle to slow your heartbeat and settle racing thoughts before a deadline or exam.',
        steps: ['Inhale for 4 counts.', 'Hold for 4 counts.', 'Exhale for 4 counts.', 'Pause for 4 counts and repeat 4 times.'],
      },
      {
        id: 'grounding',
        title: 'Grounding exercises',
        type: 'Practice',
        duration: '5 min',
        description: 'Use the 5-4-3-2-1 method to reconnect with your senses when overwhelm spikes.',
        steps: ['Notice 5 things you can see.', 'Name 4 things you can feel.', 'Hear 3 sounds.', 'Smell 2 scents.', 'Focus on 1 thing you can taste.'],
      },
      {
        id: 'journaling',
        title: 'Guided journaling',
        type: 'Reflection',
        duration: '7 min',
        description: 'Write a short prompt to organise stress, identify triggers and clarify the next step.',
        steps: ['What is happening right now?', 'What am I feeling physically?', 'What is one thing I can control next?', 'What support do I need?'],
      },
      {
        id: 'sleep',
        title: 'Sleep hygiene resources',
        type: 'Wellness',
        duration: '4 min',
        description: 'Reduce stress before bed with a calmer wind-down routine and screen-light boundaries.',
        steps: ['Dim screens 30 minutes before bed.', 'Lower the room light.', 'Do a short breathing routine.', 'Set one calming intention for tomorrow.'],
      },
    ],
  },
  'peer': {
    id: 'peer',
    icon: Users,
    title: 'Peer Support',
    tagline: 'Connect with trained peer listeners and support groups',
    color: 'border-t-teal-400',
    iconBg: 'bg-teal-50 text-teal-600',
    action: 'Connect with peers',
    resources: [
      {
        id: 'peer-listener',
        title: 'Peer listener program',
        type: 'Service',
        duration: 'Weekly slots',
        description: 'Meet a trained peer listener for a check-in and a calm space to talk through pressure or uncertainty.',
        steps: ['Choose a time slot that works for you.', 'Share what is weighing on you.', 'Leave with one practical next step.'],
      },
      {
        id: 'study-buddy',
        title: 'Study buddy network',
        type: 'Group',
        duration: 'On demand',
        description: 'Find a study partner to break down workloads, share tasks and stay accountable without stress spirals.',
        steps: ['Pick your course or deadline.', 'Match with a peer who shares a similar schedule.', 'Plan one check-in and one shared goal.'],
      },
      {
        id: 'wellness-circle',
        title: 'Wellness circles',
        type: 'Group',
        duration: 'Weekly',
        description: 'Join small, facilitated conversations designed for connection and low-pressure check-ins.',
        steps: ['Attend one circle at a time.', 'Bring one update or one question.', 'Listen and reflect with your group.'],
      },
    ],
  },
  academic: {
    id: 'academic',
    icon: GraduationCap,
    title: 'Academic Support',
    tagline: 'Explore mentoring, tutoring, and academic guidance',
    color: 'border-t-purple-400',
    iconBg: 'bg-purple-50 text-purple-600',
    action: 'Explore academic tools',
    resources: [
      {
        id: 'mentor',
        title: 'Academic mentoring',
        type: 'Guidance',
        duration: 'Booked session',
        description: 'Talk through workload planning, deadlines and study habits with a mentor who can help structure next steps.',
        steps: ['Choose a mentoring slot.', 'Share your current challenges.', 'Build a realistic study plan.'],
      },
      {
        id: 'study-workshop',
        title: 'Study skills workshop',
        type: 'Workshop',
        duration: 'Thursday',
        description: 'Learn prioritisation, revision planning and time-blocking techniques that are realistic for busy student weeks.',
        steps: ['Attend the workshop.', 'Apply one technique to your current timetable.', 'Review what felt manageable.'],
      },
      {
        id: 'time-management',
        title: 'Time-management techniques',
        type: 'Resource',
        duration: 'Always open',
        description: 'Turn big tasks into smaller, trackable steps and create a study rhythm that is sustainable.',
        steps: ['Write your current workload.', 'Break it into 25-minute blocks.', 'Schedule break periods and review progress.'],
      },
    ],
  },
  professional: {
    id: 'professional',
    icon: HeartHandshake,
    title: 'Professional Support',
    tagline: 'Find counselling and professional support',
    color: 'border-t-amber-400',
    iconBg: 'bg-amber-50 text-amber-600',
    action: 'Book a counselling session',
    resources: [
      {
        id: 'counselling',
        title: 'Counselling information',
        type: 'Service',
        duration: 'Mon–Fri',
        description: 'Learn how counselling works, what to expect and when it may help you make sense of a difficult period.',
        steps: ['Review the support overview.', 'Identify the type of help you need.', 'Request a consultation if helpful.'],
      },
      {
        id: 'therapy',
        title: 'Online therapy access',
        type: 'Digital',
        duration: 'On demand',
        description: 'Use secure, private online sessions to talk through stress, anxiety and emotional fatigue at a manageable pace.',
        steps: ['Choose a preferred support option.', 'Share your concerns in a private session.', 'Follow up with the support plan agreed with your counsellor.'],
      },
      {
        id: 'crisis',
        title: 'Crisis support guidance',
        type: 'Urgent',
        duration: '24/7',
        description: 'If you are in immediate danger or feel unable to keep yourself safe, contact emergency services or a crisis helpline right away.',
        steps: ['Move to a safe place if possible.', 'Contact emergency services or crisis support.', 'Tell someone you trust and ask them to stay with you.'],
      },
    ],
  },
}

const supportOrder = ['self-help', 'peer', 'academic', 'professional']

export default function Support() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { state } = useApp()
  const concern = state.analysisResult?.concern
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'self-help')
  const [completed, setCompleted] = useState({})

  useEffect(() => {
    const category = searchParams.get('category') || 'self-help'
    setSelectedCategory(category)
  }, [searchParams])

  const activeCategory = supportCategories[selectedCategory] || supportCategories['self-help']

  const openCategory = (categoryId) => {
    setSelectedCategory(categoryId)
    setSearchParams({ category: categoryId })
  }

  const toggleCompleted = (resourceId) => {
    setCompleted(prev => ({ ...prev, [resourceId]: !prev[resourceId] }))
  }

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="section-title mb-1">Support that fits what you're going through</h1>
        {concern ? (
          <p className="text-calm-500 text-sm">
            Based on your check-in, we've highlighted resources relevant to <strong className="text-calm-700">{concern}</strong>.
          </p>
        ) : (
          <p className="text-calm-500 text-sm">
            Explore the support options available to you.
          </p>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-5 mb-8">
        {supportOrder.map(categoryId => {
          const category = supportCategories[categoryId]
          const Icon = category.icon
          const isActive = selectedCategory === category.id

          return (
            <button
              key={category.id}
              onClick={() => openCategory(category.id)}
              className={`card border-t-4 ${category.color} p-6 text-left hover:shadow-md transition-shadow ${isActive ? 'ring-2 ring-brand-200' : ''}`}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-11 h-11 rounded-xl ${category.iconBg} flex items-center justify-center shrink-0`}>
                  <Icon size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-calm-900 text-base">{category.title}</h3>
                  <p className="text-sm text-calm-500 mt-0.5 leading-relaxed">{category.tagline}</p>
                </div>
              </div>

              <div className="space-y-2 mb-5">
                {category.resources.map(resource => (
                  <div key={resource.id} className="flex items-center justify-between gap-3 py-2 border-b border-calm-100 last:border-0">
                    <div>
                      <p className="text-sm text-calm-800 font-medium">{resource.title}</p>
                      <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                        <span className="badge bg-calm-100 text-calm-500 text-xs py-0.5">{resource.type}</span>
                        <span className="text-xs text-calm-400">{resource.duration}</span>
                      </div>
                    </div>
                    <ExternalLink size={14} className="text-calm-300 shrink-0" />
                  </div>
                ))}
              </div>

              <span className="btn-primary w-full justify-center text-sm py-2">
                {category.id === 'professional' ? 'Request counselling' : category.action} <ArrowRight size={14} />
              </span>
            </button>
          )
        })}
      </div>

      <div className="card p-6 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-calm-400 mb-1">Selected area</p>
            <h2 className="text-2xl font-semibold text-calm-900">{activeCategory.title}</h2>
          </div>
          {activeCategory.id === 'professional' ? (
            <button onClick={() => navigate('/appointments')} className="btn-primary text-sm">
              Request an appointment <ArrowRight size={14} />
            </button>
          ) : (
            <button onClick={() => navigate('/dashboard')} className="btn-secondary text-sm">
              Back to dashboard
            </button>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          {activeCategory.resources.map(resource => {
            const isDone = !!completed[resource.id]

            return (
              <div key={resource.id} className="border border-calm-200 rounded-2xl p-4 bg-calm-50/50">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="font-semibold text-calm-900">{resource.title}</h3>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="badge bg-white text-calm-600">{resource.type}</span>
                      <span className="text-xs text-calm-400">{resource.duration}</span>
                    </div>
                  </div>
                  {isDone && <CheckCircle2 size={18} className="text-green-600 shrink-0" />}
                </div>

                <p className="text-sm text-calm-600 leading-relaxed mb-3">{resource.description}</p>

                <ol className="space-y-1.5 mb-4 text-sm text-calm-700 list-decimal list-inside">
                  {resource.steps.map(step => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>

                <div className="flex flex-wrap gap-2">
                  <button onClick={() => toggleCompleted(resource.id)} className={isDone ? 'btn-secondary text-xs' : 'btn-primary text-xs'}>
                    {isDone ? 'Completed' : 'Mark complete'}
                  </button>

                  {activeCategory.id === 'professional' && resource.id === 'counselling' ? (
                    <button onClick={() => navigate('/appointments')} className="btn-secondary text-xs">
                      Book a session
                    </button>
                  ) : null}

                  {activeCategory.id === 'peer' && resource.id === 'peer-listener' ? (
                    <button onClick={() => navigate('/support?category=peer')} className="btn-secondary text-xs">
                      View peer channels
                    </button>
                  ) : null}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="card p-5 bg-red-50 border-red-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <PhoneCall size={15} className="text-red-600" />
              <span className="text-sm font-semibold text-red-800">Need immediate support?</span>
            </div>
            <p className="text-xs text-red-700 leading-relaxed">
              If you are in crisis or feel unsafe, use a trusted crisis resource or contact emergency services in your area right away.
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => window.open('https://988lifeline.org/', '_blank', 'noopener,noreferrer')}
              className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
            >
              <PhoneCall size={14} /> Crisis support
            </button>
            <button
              onClick={() => navigate('/support?category=professional')}
              className="flex items-center gap-1.5 bg-white hover:bg-red-50 text-red-700 text-sm font-medium px-4 py-2 rounded-xl border border-red-200 transition-colors"
            >
              <Globe size={14} /> Resources
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
