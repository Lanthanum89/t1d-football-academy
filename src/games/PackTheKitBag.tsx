import { useEffect, useRef, useState } from 'react'

type PackTheKitBagProps = {
  onExit: () => void
}

type Stage = 'intro' | 'pack' | 'feedback'

type KitItem = {
  id: string
  label: string
  needed: boolean
}

const kitItems: KitItem[] = [
  { id: 'glucose-meter', label: 'Glucose meter', needed: true },
  { id: 'quick-snack', label: 'Quick sugar snack', needed: true },
  { id: 'insulin-kit', label: 'Insulin kit', needed: true },
  { id: 'spare-batteries', label: 'Spare device batteries', needed: true },
  { id: 'teddy', label: 'Teddy bear', needed: false },
  { id: 'toy-car', label: 'Toy car', needed: false },
]

const kitItemArt: Record<string, string> = {
  'glucose-meter': './mascots/kit/glucose-meter.png',
  'quick-snack': './mascots/kit/quick-snack.png',
  'insulin-kit': './mascots/kit/insulin-kit.png',
  'spare-batteries': './mascots/kit/spare-batteries.png',
  teddy: './mascots/kit/teddy.png',
  'toy-car': './mascots/kit/toy-car.png',
}

export function PackTheKitBag({ onExit }: PackTheKitBagProps) {
  const [stage, setStage] = useState<Stage>('intro')
  const [packed, setPacked] = useState<string[]>([])
  const stageHeadingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    stageHeadingRef.current?.focus()
  }, [stage])

  useEffect(() => () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
  }, [])

  const togglePacked = (id: string) => {
    setPacked((current) => (
      current.includes(id) ? current.filter((itemId) => itemId !== id) : [...current, id]
    ))
  }

  const missingNeeded = kitItems.filter((item) => item.needed && !packed.includes(item.id))

  const hearPrompt = () => {
    if ('speechSynthesis' in window) {
      const prompt = stage === 'intro'
        ? 'Pack the kit bag for matchday.'
        : stage === 'pack'
          ? 'Tap the things your team needs at every match.'
          : missingNeeded.length === 0
            ? 'Your kit bag is ready!'
            : `Don't forget your ${missingNeeded[0].label.toLowerCase()}.`

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
        <span className="game-score">Match situation 02</span>
        <button className="listen-button" type="button" onClick={hearPrompt}>Hear it</button>
      </div>

      <section className="game-card" aria-labelledby="game-title">
        <div className="game-card__art" aria-hidden="true">
          <img src="./mascots/player-running.png" alt="" />
        </div>
        <div className="game-card__content">
          <p className="game-kicker">Pack the Kit Bag</p>

          {stage === 'intro' && (
            <>
              <h1 id="game-title" ref={stageHeadingRef} tabIndex={-1}>Matchday kit bag time</h1>
              <p className="scenario">Get everything your team needs ready.</p>
              <button className="whistle-button" type="button" onClick={() => setStage('pack')}>
                <span className="whistle-shape" aria-hidden="true" />
                Open the kit bag
              </button>
            </>
          )}

          {stage === 'pack' && (
            <>
              <h1 id="game-title" ref={stageHeadingRef} tabIndex={-1}>What goes in the bag?</h1>
              <div className="kit-grid" role="group" aria-label="Pack items into the kit bag">
                {kitItems.map((item) => {
                  const isPacked = packed.includes(item.id)
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={`kit-item${isPacked ? ' kit-item--packed' : ''}`}
                      aria-pressed={isPacked}
                      onClick={() => togglePacked(item.id)}
                    >
                      <img className="kit-item__art" src={kitItemArt[item.id]} alt="" aria-hidden="true" />
                      <strong>{item.label}</strong>
                      <span>{isPacked ? 'Packed' : 'Tap to pack'}</span>
                    </button>
                  )
                })}
              </div>
              <button
                className="whistle-button kit-ready-button"
                type="button"
                onClick={() => setStage('feedback')}
              >
                Check the bag
              </button>
            </>
          )}

          {stage === 'feedback' && (
            <div className={`feedback ${missingNeeded.length === 0 ? 'feedback--success' : ''}`} role="status">
              <h1 id="game-title" ref={stageHeadingRef} tabIndex={-1} className="feedback__stamp">
                {missingNeeded.length === 0 ? 'Kit bag ready!' : 'Almost there'}
              </h1>
              {missingNeeded.length === 0 ? (
                <>
                  <p>Great teamwork! Everyone on the team has what they need for matchday.</p>
                  <button type="button" onClick={onExit}>Back to the academy</button>
                </>
              ) : (
                <>
                  <p>Don't forget: {missingNeeded.map((item) => item.label).join(', ')}.</p>
                  <button type="button" onClick={() => setStage('pack')}>Back to the bag</button>
                </>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
