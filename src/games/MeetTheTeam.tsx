import { useEffect, useRef, useState } from 'react'

type MeetTheTeamProps = {
  onExit: () => void
}

type Stage = 'intro' | 'collect' | 'feedback'

type Helper = {
  id: string
  name: string
  role: string
}

const helpers: Helper[] = [
  { id: 'insulin', name: 'Insulin', role: 'Helps the team use energy from food.' },
  { id: 'glucose', name: 'Glucose device', role: 'Lets a grown-up see how the match is going.' },
  { id: 'food', name: 'Food', role: 'Fuels the whole team for training and matches.' },
  { id: 'movement', name: 'Movement', role: "Keeps the team fit, from kickabouts to rest days." },
  { id: 'devices', name: 'Devices', role: 'Tools that support the team, day and night.' },
  { id: 'trusted-adult', name: 'Trusted adult', role: 'The team captain you can always tell.' },
]

const helperArt: Record<string, string> = {
  insulin: './mascots/team/insulin.png',
  glucose: './mascots/team/glucose.png',
  food: './mascots/team/food.png',
  movement: './mascots/team/movement.png',
  devices: './mascots/team/devices.png',
  'trusted-adult': './mascots/team/trusted-adult.png',
}

export function MeetTheTeam({ onExit }: MeetTheTeamProps) {
  const [stage, setStage] = useState<Stage>('intro')
  const [collected, setCollected] = useState<string[]>([])
  const stageHeadingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    stageHeadingRef.current?.focus()
  }, [stage])

  useEffect(() => () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
  }, [])

  const collect = (id: string) => {
    setCollected((current) => (current.includes(id) ? current : [...current, id]))
  }

  const allCollected = collected.length === helpers.length

  const hearPrompt = () => {
    if ('speechSynthesis' in window) {
      const prompt = stage === 'intro'
        ? 'Meet the helpers on your T1D team.'
        : stage === 'collect'
          ? 'Tap each helper to find out how they support the team.'
          : allCollected
            ? "You've met the whole team!"
            : ''

      window.speechSynthesis.cancel()
      if (prompt) {
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(prompt))
      }
    }
  }

  return (
    <main className="game-screen">
      <div className="game-topbar">
        <button className="back-button" type="button" onClick={onExit}>Back</button>
        <span className="game-score">Match situation 04</span>
        <button className="listen-button" type="button" onClick={hearPrompt}>Hear it</button>
      </div>

      <section className="game-card" aria-labelledby="game-title">
        <div className="game-card__art" aria-hidden="true">
          <img src="./mascots/lion-running.png" alt="" />
        </div>
        <div className="game-card__content">
          <p className="game-kicker">Meet the Team</p>

          {stage === 'intro' && (
            <>
              <h1 id="game-title" ref={stageHeadingRef} tabIndex={-1}>Who's on your team?</h1>
              <p className="scenario">Diabetes care is a team effort.</p>
              <button className="whistle-button" type="button" onClick={() => setStage('collect')}>
                <span className="whistle-shape" aria-hidden="true" />
                Meet the team
              </button>
            </>
          )}

          {stage === 'collect' && (
            <>
              <h1 id="game-title" ref={stageHeadingRef} tabIndex={-1}>Tap each teammate</h1>
              <div className="team-grid" role="group" aria-label="Collect your team helpers">
                {helpers.map((helper) => {
                  const isCollected = collected.includes(helper.id)
                  return (
                    <button
                      key={helper.id}
                      type="button"
                      className={`team-helper${isCollected ? ' team-helper--collected' : ''}`}
                      onClick={() => collect(helper.id)}
                    >
                      <img className="team-helper__art" src={helperArt[helper.id]} alt="" aria-hidden="true" />
                      <strong>{helper.name}</strong>
                      {isCollected ? <span>{helper.role}</span> : <span>Tap to reveal</span>}
                    </button>
                  )
                })}
              </div>
              {allCollected && (
                <button className="whistle-button kit-ready-button" type="button" onClick={() => setStage('feedback')}>
                  Full squad!
                </button>
              )}
            </>
          )}

          {stage === 'feedback' && (
            <div className="feedback feedback--success" role="status">
              <h1 id="game-title" ref={stageHeadingRef} tabIndex={-1} className="feedback__stamp">
                Full squad!
              </h1>
              <p>You've met every helper on your T1D team. Nobody plays this game alone.</p>
              <button type="button" onClick={onExit}>Back to the academy</button>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
