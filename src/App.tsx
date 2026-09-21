import { useState } from 'react'
import { ActivityCard } from './components/ActivityCard'
import { activities } from './data/activities'
import { CallTheCoach } from './games/CallTheCoach'

function App() {
  const [activeActivity, setActiveActivity] = useState<string | null>(null)

  if (activeActivity === 'call-the-coach') {
    return <CallTheCoach onExit={() => setActiveActivity(null)} />
  }

  return (
    <div className="app-shell">
      <header className="hero">
        <div className="hero__pitch-lines" aria-hidden="true" />
        <nav className="topbar" aria-label="Academy header">
          <a className="brand" href="#top" aria-label="T1D Football Academy home">
            <span className="brand__ball" aria-hidden="true">⚽</span>
            <span>T1D Football Academy</span>
          </a>
          <span className="team-chip">You are on the team</span>
        </nav>

        <div className="hero__content" id="top">
          <p className="eyebrow">Welcome to training</p>
          <h1>Learn about T1D.<br />Play like a champion.</h1>
          <p>
            Short football activities about noticing, speaking up and working with your trusted grown-ups.
          </p>
          <a className="hero__button" href="#training">Choose a training drill ↓</a>
        </div>
      </header>

      <main className="academy" id="training">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Academy activities</p>
            <h2>Pick your next drill</h2>
          </div>
          <div className="progress-badge" aria-label="One activity ready">
            <strong>1</strong>
            <span>drill ready</span>
          </div>
        </div>

        <div className="activity-grid">
          {activities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} onStart={setActiveActivity} />
          ))}
        </div>

        <aside className="grown-up-note">
          <span className="grown-up-note__icon" aria-hidden="true">🛡️</span>
          <div>
            <h2>For grown-ups</h2>
            <p>
              This app supports conversation and confidence. It never interprets glucose readings,
              calculates insulin or replaces the child’s diabetes care plan.
            </p>
          </div>
        </aside>
      </main>

      <footer>
        <p>Built for confident conversations, not clinical decisions.</p>
      </footer>
    </div>
  )
}

export default App

