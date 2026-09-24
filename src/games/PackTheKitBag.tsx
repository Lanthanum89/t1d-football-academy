import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'

type PackTheKitBagProps = {
  onExit: () => void
}

type Stage = 'intro' | 'pack' | 'feedback'

type KitItem = {
  id: string
  label: string
  needed: boolean
}

type DragState = {
  id: string
  pointerId: number
  startX: number
  startY: number
  x: number
  y: number
  moved: boolean
  overBag: boolean
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

const DRAG_THRESHOLD = 8

function isPointInRect(x: number, y: number, rect: DOMRect) {
  return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
}

export function PackTheKitBag({ onExit }: PackTheKitBagProps) {
  const [stage, setStage] = useState<Stage>('intro')
  const [packed, setPacked] = useState<string[]>([])
  const [drag, setDrag] = useState<DragState | null>(null)
  const stageHeadingRef = useRef<HTMLHeadingElement>(null)
  const bagRef = useRef<HTMLDivElement>(null)
  const suppressClickRef = useRef(false)

  useEffect(() => {
    stageHeadingRef.current?.focus()
  }, [stage])

  useEffect(() => () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
  }, [])

  const packItem = (id: string) => {
    setPacked((current) => (current.includes(id) ? current : [...current, id]))
  }

  const unpackItem = (id: string) => {
    setPacked((current) => current.filter((itemId) => itemId !== id))
  }

  const togglePacked = (id: string) => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false
      return
    }
    setPacked((current) => (
      current.includes(id) ? current.filter((itemId) => itemId !== id) : [...current, id]
    ))
  }

  const handlePointerDown = (event: ReactPointerEvent<HTMLButtonElement>, id: string) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    event.currentTarget.setPointerCapture?.(event.pointerId)
    setDrag({
      id,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      x: event.clientX,
      y: event.clientY,
      moved: false,
      overBag: false,
    })
  }

  const handlePointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    setDrag((current) => {
      if (!current || current.pointerId !== event.pointerId) return current
      const dx = event.clientX - current.startX
      const dy = event.clientY - current.startY
      const moved = current.moved || Math.hypot(dx, dy) > DRAG_THRESHOLD
      const overBag = Boolean(bagRef.current && isPointInRect(event.clientX, event.clientY, bagRef.current.getBoundingClientRect()))
      return { ...current, x: event.clientX, y: event.clientY, moved, overBag }
    })
  }

  const endDrag = (event: ReactPointerEvent<HTMLButtonElement>, id: string) => {
    setDrag((current) => {
      if (!current || current.pointerId !== event.pointerId) return current
      if (current.moved) {
        suppressClickRef.current = true
        if (current.overBag) {
          packItem(id)
        }
      }
      return null
    })
  }

  const missingNeeded = kitItems.filter((item) => item.needed && !packed.includes(item.id))
  const shelfItems = kitItems.filter((item) => !packed.includes(item.id))
  const packedItems = kitItems.filter((item) => packed.includes(item.id))

  const hearPrompt = () => {
    if ('speechSynthesis' in window) {
      const prompt = stage === 'intro'
        ? 'Pack the kit bag for matchday.'
        : stage === 'pack'
          ? 'Drag or tap the things your team needs into the bag.'
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
              <p className="scenario">Drag the kit into the bag, or tap to pack.</p>
              <button className="whistle-button" type="button" onClick={() => setStage('pack')}>
                <span className="whistle-shape" aria-hidden="true" />
                Open the kit bag
              </button>
            </>
          )}

          {stage === 'pack' && (
            <>
              <h1 id="game-title" ref={stageHeadingRef} tabIndex={-1}>What goes in the bag?</h1>
              <div className="kit-shelf" role="group" aria-label="Kit shelf">
                {shelfItems.map((item) => {
                  const isDragging = drag?.id === item.id
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={`kit-item${isDragging ? ' kit-item--dragging' : ''}`}
                      onPointerDown={(event) => handlePointerDown(event, item.id)}
                      onPointerMove={handlePointerMove}
                      onPointerUp={(event) => endDrag(event, item.id)}
                      onPointerCancel={() => setDrag(null)}
                      onClick={() => togglePacked(item.id)}
                    >
                      <img className="kit-item__art" src={kitItemArt[item.id]} alt="" aria-hidden="true" />
                      <strong>{item.label}</strong>
                      <span>Drag or tap to pack</span>
                    </button>
                  )
                })}
              </div>

              <div
                ref={bagRef}
                className={`kit-bag-zone${drag?.moved ? ' kit-bag-zone--active' : ''}${drag?.overBag ? ' kit-bag-zone--hover' : ''}`}
                role="group"
                aria-label="Packed items"
              >
                <span className="kit-bag-zone__label">Kit bag</span>
                {packedItems.length === 0 ? (
                  <span className="kit-bag-zone__empty">Drop items here</span>
                ) : (
                  packedItems.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className="kit-bag-zone__icon-button"
                      onClick={() => unpackItem(item.id)}
                      aria-label={`${item.label}. Packed. Tap to remove.`}
                    >
                      <img src={kitItemArt[item.id]} alt="" aria-hidden="true" />
                    </button>
                  ))
                )}
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

      {drag?.moved && (
        <img
          className="kit-drag-ghost"
          src={kitItemArt[drag.id]}
          alt=""
          aria-hidden="true"
          style={{ left: drag.x, top: drag.y }}
        />
      )}
    </main>
  )
}
