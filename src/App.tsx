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
        <nav className="topbar" aria-label="Academy header">
          <a className="brand" href="#top" aria-label="T1D Football Academy home">
            <span className="brand__roundel" aria-hidden="true">T1D</span>
            <span>Football Academy</span>
          </a>
          <span className="team-chip">Matchday special</span>
        </nav>

        <div className="hero__content" id="top">
          <div className="hero__copy">
            <p className="cover-line">The big game starts here!</p>
            <h1><span>Team T1D</span> needs you</h1>
            <p className="hero__intro">Play quick football challenges with your academy team.</p>
            <a className="hero__button" href="#training">Play now</a>
          </div>
          <div className="hero__players" aria-hidden="true">
            <img className="hero__player" src="./mascots/player-running.jpg" alt="" />
            <img className="hero__lion" src="./mascots/lion-running.jpg" alt="" />
            <span className="cover-burst">NEW<br />GAMES</span>
          </div>
        </div>
        <div className="hero__ticker" aria-hidden="true">
          <span>BIG CHALLENGES</span><span>TEAMWORK</span><span>FOOTBALL FUN</span>
        </div>
      </header>

      <main className="academy" id="training">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Inside this issue</p>
            <h2>Choose your challenge</h2>
          </div>
          <div className="progress-badge" aria-label="One activity ready">
            <strong>1</strong>
            <span>live game</span>
          </div>
        </div>

        <div className="activity-grid">
          {activities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} onStart={setActiveActivity} />
          ))}
        </div>

        <aside className="grown-up-note">
          <div>
            <p className="grown-up-note__label">Touchline notes</p>
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
