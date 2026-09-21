import { useState } from 'react'

type CallTheCoachProps = {
  onExit: () => void
}

type Choice = 'tell' | 'play' | 'hide'

const feedback: Record<Choice, string> = {
  tell: 'Awesome teamwork! Your trusted grown-up can help check what is happening.',
  play: 'Blow the whistle first! Tell a trusted grown-up when your body feels different.',
  hide: 'No hiding on this team! Your grown-ups are your teammates and want to help.',
}

export function CallTheCoach({ onExit }: CallTheCoachProps) {
  const [choice, setChoice] = useState<Choice | null>(null)

  return (
    <main className="game-screen">
      <button className="back-button" type="button" onClick={onExit}>
        ← Back to games
      </button>

      <section className="game-card" aria-labelledby="game-title">
        <div className="game-card__badge" aria-hidden="true">📣</div>
        <p className="eyebrow">Game 1</p>
        <h1 id="game-title">Call the Coach!</h1>
        <p className="scenario">
          You're playing football and your legs suddenly feel wobbly. What do you do?
        </p>

        <div className="choice-grid" aria-label="Choose what to do">
          <button type="button" onClick={() => setChoice('tell')}>
            <span aria-hidden="true">🙋</span>
            Tell a grown-up
          </button>
          <button type="button" onClick={() => setChoice('play')}>
            <span aria-hidden="true">🏃</span>
            Keep playing
          </button>
          <button type="button" onClick={() => setChoice('hide')}>
            <span aria-hidden="true">🙈</span>
            Hide it
          </button>
        </div>

        {choice && (
          <div className={`feedback ${choice === 'tell' ? 'feedback--success' : ''}`} role="status">
            <strong>{choice === 'tell' ? 'Goal!' : 'Try this instead'}</strong>
            <p>{feedback[choice]}</p>
            {choice !== 'tell' && (
              <button type="button" onClick={() => setChoice('tell')}>
                Tell a grown-up
              </button>
            )}
          </div>
        )}
      </section>
    </main>
  )
}

