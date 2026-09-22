import { useNavigate } from 'react-router-dom'
import {
  BookOpen, Users, GraduationCap, HeartHandshake,
  ArrowRight, ExternalLink, PhoneCall, Globe
} from 'lucide-react'
import { useApp } from '../context/AppContext'

const supportCategories = [
  {
    id: 'self-help',
    icon: BookOpen,
    title: 'Self-Help',
    tagline: 'Practical resources for managing academic pressure',
    color: 'border-t-brand-400',
    iconBg: 'bg-brand-50 text-brand-600',
    resources: [
      { name: 'Stress Management Guide',     type: 'Article',  time: '5 min read' },
      { name: 'Exam Anxiety Toolkit',        type: 'PDF',      time: 'Download'   },
      { name: 'Mindfulness for Students',    type: 'Exercise', time: '10 min'     },
      { name: 'Sleep Hygiene Tips',          type: 'Article',  time: '3 min read' },
    ],
    action: 'Explore',
  },
  {
    id: 'peer',
    icon: Users,
    title: 'Peer Support',
    tagline: 'Connect with trained peer listeners and support groups',
    color: 'border-t-teal-400',
    iconBg: 'bg-teal-50 text-teal-600',
    resources: [
      { name: 'Peer Listener Program',       type: 'Service', time: 'Mon–Fri'   },
      { name: 'Study Buddy Network',         type: 'Group',   time: 'On-demand' },
      { name: 'Wellness Check-in Circles',   type: 'Group',   time: 'Weekly'    },
    ],
    action: 'Connect',
  },
  {
    id: 'academic',
    icon: GraduationCap,
    title: 'Academic Support',
    tagline: 'Explore mentoring, tutoring, and academic guidance',
    color: 'border-t-purple-400',
    iconBg: 'bg-purple-50 text-purple-600',
    resources: [
      { name: 'Academic Mentoring',          type: 'Service', time: 'Book a slot' },
      { name: 'Study Skills Workshop',       type: 'Workshop',time: 'Thursday'    },
      { name: 'Exam Preparation Resources',  type: 'Online',  time: 'Always open' },
    ],
    action: 'Learn More',
  },
  {
    id: 'professional',
    icon: HeartHandshake,
    title: 'Professional Support',
    tagline: 'Find institutional counseling and professional support',
    color: 'border-t-amber-400',
    iconBg: 'bg-amber-50 text-amber-600',
    resources: [
      { name: 'Student Counseling Center',   type: 'Service', time: 'Mon–Fri'    },
      { name: 'Online Therapy Access',       type: 'Digital', time: 'On-demand'  },
      { name: 'Crisis Support Helpline',     type: 'Urgent',  time: '24/7'       },
    ],
    action: 'Find Support',
  },
]

export default function Support() {
  const navigate = useNavigate()
  const { state } = useApp()
  const concern = state.analysisResult?.concern

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
        {supportCategories.map(cat => (
          <div
            key={cat.id}
            className={`card border-t-4 ${cat.color} p-6 hover:shadow-md transition-shadow`}
          >
            <div className="flex items-start gap-4 mb-4">
              <div className={`w-11 h-11 rounded-xl ${cat.iconBg} flex items-center justify-center shrink-0`}>
                <cat.icon size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-calm-900 text-base">{cat.title}</h3>
                <p className="text-sm text-calm-500 mt-0.5 leading-relaxed">{cat.tagline}</p>
              </div>
            </div>

            {/* Resources list */}
            <div className="space-y-2 mb-5">
              {cat.resources.map(r => (
                <div key={r.name} className="flex items-center justify-between gap-3 py-2 border-b border-calm-100 last:border-0">
                  <div>
                    <p className="text-sm text-calm-800 font-medium">{r.name}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="badge bg-calm-100 text-calm-500 text-xs py-0.5">{r.type}</span>
                      <span className="text-xs text-calm-400">{r.time}</span>
                    </div>
                  </div>
                  <ExternalLink size={14} className="text-calm-300 shrink-0" />
                </div>
              ))}
            </div>

            <button className="btn-primary w-full justify-center text-sm py-2">
              {cat.action} <ArrowRight size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Emergency */}
      <div className="card p-5 bg-red-50 border-red-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <PhoneCall size={15} className="text-red-600" />
              <span className="text-sm font-semibold text-red-800">Need immediate support?</span>
            </div>
            <p className="text-xs text-red-700 leading-relaxed">
              If you are in crisis or need urgent help, please contact your institution's counseling center or a crisis helpline right away.
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors">
              <PhoneCall size={14} /> Call Now
            </button>
            <button className="flex items-center gap-1.5 bg-white hover:bg-red-50 text-red-700 text-sm font-medium px-4 py-2 rounded-xl border border-red-200 transition-colors">
              <Globe size={14} /> Resources
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
