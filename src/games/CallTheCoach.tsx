import { useState } from 'react'

type CallTheCoachProps = {
  onExit: () => void
}

type Choice = 'tell' | 'play' | 'quiet'
type Stage = 'whistle' | 'choose' | 'feedback'

const feedback: Record<Choice, string> = {
  tell: 'Great teamwork! Your grown-up is ready to help.',
  play: 'Pause the match and tell your grown-up first.',
  quiet: 'Tell your grown-up. They are ready to help you.',
}

export function CallTheCoach({ onExit }: CallTheCoachProps) {
  const [choice, setChoice] = useState<Choice | null>(null)
  const [stage, setStage] = useState<Stage>('whistle')

  const choose = (nextChoice: Choice) => {
    setChoice(nextChoice)
    setStage('feedback')
  }

  const hearPrompt = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(
        stage === 'whistle'
          ? 'Your legs feel wobbly. Blow the whistle to stop play.'
          : 'Who should you tell?'
      ))
    }
  }

  return (
    <main className="game-screen">
      <div className="game-topbar">
        <button className="back-button" type="button" onClick={onExit}>Back</button>
        <span className="game-score">Match situation 01</span>
        <button className="listen-button" type="button" onClick={hearPrompt}>Hear it</button>
      </div>

      <section className="game-card" aria-labelledby="game-title">
        <div className="game-card__art" aria-hidden="true">
          <img src={stage === 'feedback' && choice === 'tell' ? './mascots/lion-running.jpg' : './mascots/player-running.jpg'} alt="" />
        </div>
        <div className="game-card__content">
          <p className="game-kicker">Call the Coach!</p>
          {stage === 'whistle' && (
            <>
              <h1 id="game-title">Your legs feel wobbly</h1>
              <p className="scenario">Stop the match first.</p>
              <button className="whistle-button" type="button" onClick={() => setStage('choose')}>
                <span className="whistle-shape" aria-hidden="true" />
                Blow the whistle
              </button>
            </>
          )}

          {stage === 'choose' && (
            <>
              <h1 id="game-title">Who do you tell?</h1>
              <div className="choice-grid" aria-label="Choose what to do">
                <button type="button" onClick={() => choose('tell')}>
                  <span className="choice-art choice-art--point" aria-hidden="true" style={{ backgroundImage: 'url("./mascots/player-poses.jpg")' }} />
                  <strong>My grown-up</strong>
                </button>
                <button type="button" onClick={() => choose('play')}>
                  <span className="choice-art choice-art--run" aria-hidden="true" style={{ backgroundImage: 'url("./mascots/player-poses.jpg")' }} />
                  <strong>Keep playing</strong>
                </button>
                <button type="button" onClick={() => choose('quiet')}>
                  <span className="choice-art choice-art--quiet" aria-hidden="true" style={{ backgroundImage: 'url("./mascots/player-poses.jpg")' }} />
                  <strong>Say nothing</strong>
                </button>
              </div>
            </>
          )}

          {stage === 'feedback' && choice && (
            <div className={`feedback ${choice === 'tell' ? 'feedback--success' : ''}`} role="status">
              <p className="feedback__stamp">{choice === 'tell' ? 'Great teamwork!' : 'Let’s try that again'}</p>
              <p>{feedback[choice]}</p>
              {choice === 'tell' ? (
                <button type="button" onClick={onExit}>Back to the academy</button>
              ) : (
                <button type="button" onClick={() => choose('tell')}>Tell my grown-up</button>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
