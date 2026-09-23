import { useEffect, useRef, useState } from 'react'

type HalfTimeCheckProps = {
  onExit: () => void
}

type Choice = 'pause' | 'keep-playing'
type Stage = 'whistle' | 'choose' | 'feedback'

const feedback: Record<Choice, string> = {
  pause: 'Nice pause! Checking in at half time keeps the whole team ready for the second half.',
  'keep-playing': 'Half time is for everyone to pause. Check in with your grown-up first.',
}

export function HalfTimeCheck({ onExit }: HalfTimeCheckProps) {
  const [choice, setChoice] = useState<Choice | null>(null)
  const [stage, setStage] = useState<Stage>('whistle')
  const stageHeadingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    stageHeadingRef.current?.focus()
  }, [stage, choice])

  useEffect(() => () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
  }, [])

  const choose = (nextChoice: Choice) => {
    setChoice(nextChoice)
    setStage('feedback')
  }

  const hearPrompt = () => {
    if ('speechSynthesis' in window) {
      const prompt = stage === 'whistle'
        ? "It's half time. Blow the whistle to pause the match."
        : stage === 'choose'
          ? 'What do you do at half time?'
          : choice
            ? feedback[choice]
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
        <span className="game-score">Match situation 03</span>
        <button className="listen-button" type="button" onClick={hearPrompt}>Hear it</button>
      </div>

      <section className="game-card" aria-labelledby="game-title">
        <div className="game-card__art" aria-hidden="true">
          <img src={stage === 'feedback' && choice === 'pause' ? './mascots/lion-running.png' : './mascots/player-running.png'} alt="" />
        </div>
        <div className="game-card__content">
          <p className="game-kicker">Half-Time Check</p>

          {stage === 'whistle' && (
            <>
              <h1 id="game-title" ref={stageHeadingRef} tabIndex={-1}>It's half time</h1>
              <p className="scenario">Pause the match for a check-in.</p>
              <button className="whistle-button" type="button" onClick={() => setStage('choose')}>
                <span className="whistle-shape" aria-hidden="true" />
                Blow the whistle
              </button>
            </>
          )}

          {stage === 'choose' && (
            <>
              <h1 id="game-title" ref={stageHeadingRef} tabIndex={-1}>What do you do now?</h1>
              <div className="choice-grid choice-grid--two" aria-label="Choose what to do at half time">
                <button type="button" onClick={() => choose('pause')}>
                  <span className="choice-art choice-art--point" aria-hidden="true" style={{ backgroundImage: 'url("./mascots/player-poses.png")' }} />
                  <strong>Pause and check in</strong>
                </button>
                <button type="button" onClick={() => choose('keep-playing')}>
                  <span className="choice-art choice-art--run" aria-hidden="true" style={{ backgroundImage: 'url("./mascots/player-poses.png")' }} />
                  <strong>Keep playing</strong>
                </button>
              </div>
            </>
          )}

          {stage === 'feedback' && choice && (
            <div className={`feedback ${choice === 'pause' ? 'feedback--success' : ''}`} role="status">
              <h1 id="game-title" ref={stageHeadingRef} tabIndex={-1} className="feedback__stamp">
                {choice === 'pause' ? 'Great teamwork!' : "Let's try that again"}
              </h1>
              <p>{feedback[choice]}</p>
              {choice === 'pause' ? (
                <button type="button" onClick={onExit}>Back to the academy</button>
              ) : (
                <button type="button" onClick={() => choose('pause')}>Pause and check in</button>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
