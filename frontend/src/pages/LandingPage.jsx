import { useNavigate } from 'react-router-dom'
import {
  Activity, ArrowRight, Brain, HeartHandshake,
  TrendingUp, Shield, ChevronDown
} from 'lucide-react'

const features = [
  {
    icon: ClipboardIcon,
    title: 'Assess',
    desc: 'Short well-being check-ins designed for students',
    color: 'bg-brand-50 text-brand-600',
  },
  {
    icon: MicIcon,
    title: 'Express',
    desc: 'Text or voice input — share in your own words',
    color: 'bg-teal-50 text-teal-600',
  },
  {
    icon: BrainIcon,
    title: 'Understand',
    desc: 'AI-assisted concern analysis and categorization',
    color: 'bg-purple-50 text-purple-600',
  },
  {
    icon: ConnectIcon,
    title: 'Connect',
    desc: 'Relevant support options matched to your needs',
    color: 'bg-amber-50 text-amber-600',
  },
]

function ClipboardIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6"><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4M12 16h4M8 11h.01M8 16h.01"/></svg>
}
function MicIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0M12 22v-4M8 22h8"/></svg>
}
function BrainIcon() {
  return <Brain className="w-6 h-6" />
}
function ConnectIcon() {
  return <HeartHandshake className="w-6 h-6" />
}

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-calm-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-15 py-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <Activity size={15} className="text-white" />
            </div>
            <span className="font-semibold text-calm-900 text-base">MindBridge</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/institution')}
              className="text-sm text-calm-600 hover:text-calm-900 font-medium transition-colors hidden sm:block"
            >
              For Institutions
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-primary text-sm py-2 px-4"
            >
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-20 pb-24 px-4 sm:px-6 text-center bg-gradient-to-b from-brand-50/60 to-white">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-brand-50 border border-brand-100 rounded-full px-4 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-pulse" />
            <span className="text-xs font-medium text-brand-700">AI-assisted well-being support</span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-calm-900 leading-tight tracking-tight mb-6">
            Your well-being<br />
            <span className="text-brand-600">matters.</span>
          </h1>
          <p className="text-lg sm:text-xl text-calm-500 max-w-xl mx-auto mb-10 leading-relaxed">
            MindBridge helps you understand what you're going through and find the right support.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate('/checkin')}
              className="btn-primary text-base py-3 px-8 justify-center"
            >
              Start Check-in
              <ArrowRight size={18} />
            </button>
            <a href="#how-it-works" className="btn-secondary text-base py-3 px-8 justify-center">
              How It Works
              <ChevronDown size={18} />
            </a>
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-calm-900 mb-3">How MindBridge works</h2>
            <p className="text-calm-500 max-w-xl mx-auto">Four simple steps from check-in to support.</p>
          </div>

          {/* Workflow steps */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
            {['Assess', 'Express', 'Understand', 'Connect'].map((step, i) => (
              <div key={step} className="flex items-center gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-brand-600 text-white flex items-center justify-center text-sm font-semibold shadow">
                    {i + 1}
                  </div>
                  <span className="text-sm font-medium text-calm-700 mt-1">{step}</span>
                </div>
                {i < 3 && <ArrowRight size={16} className="text-calm-300 hidden sm:block -mt-5" />}
              </div>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f) => (
              <div key={f.title} className="card p-6 hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 rounded-xl ${f.color} flex items-center justify-center mb-4`}>
                  <f.icon />
                </div>
                <h3 className="font-semibold text-calm-900 mb-1.5">{f.title}</h3>
                <p className="text-sm text-calm-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why MindBridge */}
      <section className="py-20 px-4 sm:px-6 bg-calm-50">
        <div className="max-w-5xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: 'Private & Safe', desc: 'Your responses are used only to guide you to support. We never share individual data.' },
              { icon: Brain, title: 'AI-Assisted', desc: 'Lightweight NLP understands your concerns and matches you with appropriate resources.' },
              { icon: TrendingUp, title: 'Track Progress', desc: 'See how your well-being changes over time with simple visual trends.' },
            ].map(item => (
              <div key={item.title} className="card p-6">
                <item.icon size={22} className="text-brand-500 mb-3" />
                <h3 className="font-semibold text-calm-900 mb-1.5">{item.title}</h3>
                <p className="text-sm text-calm-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 sm:px-6 bg-white text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl font-bold text-calm-900 mb-4">Ready to check in?</h2>
          <p className="text-calm-500 mb-8 leading-relaxed">
            It takes less than 5 minutes and could be the first step toward feeling better.
          </p>
          <button
            onClick={() => navigate('/checkin')}
            className="btn-primary text-base py-3 px-10 justify-center"
          >
            Start Check-in
            <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* Disclaimer */}
      <footer className="border-t border-calm-100 bg-calm-50 py-8 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5 mb-4">
            <Shield size={14} className="text-amber-600 shrink-0" />
            <p className="text-xs text-amber-800 text-left">
              <strong>Important:</strong> MindBridge provides support navigation and does not replace professional mental-health care. If you are in crisis, please contact your institution's counseling services or a helpline immediately.
            </p>
          </div>
          <p className="text-xs text-calm-400">© {new Date().getFullYear()} MindBridge — Academic Prototype</p>
        </div>
      </footer>
    </div>
  )
}
