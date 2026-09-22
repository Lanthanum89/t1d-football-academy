import type { Activity } from '../types/activity'

type ActivityCardProps = {
  activity: Activity
  onStart: (activityId: string) => void
}

export function ActivityCard({ activity, onStart }: ActivityCardProps) {
  const isReady = activity.status === 'ready'

  return (
    <article className={`activity-card activity-card--${activity.colour}`}>
      <div className={`activity-card__art activity-card__art--${activity.artwork}`} aria-hidden="true">
        <span className="activity-card__number">0{activity.id === 'call-the-coach' ? 1 : activity.id === 'pack-the-kit-bag' ? 2 : activity.id === 'half-time-check' ? 3 : 4}</span>
        <span
          className="activity-card__player"
          style={{ backgroundImage: 'url("./mascots/player-poses.png")' }}
        />
      </div>
      <div className="activity-card__body">
        <span className="activity-card__kicker">{isReady ? 'Play this challenge' : 'Next fixture'}</span>
        <div className="activity-card__title-row">
          <h2>{activity.title}</h2>
        </div>
        <p>{activity.strapline}</p>
        <button
          className="activity-card__button"
          type="button"
          disabled={!isReady}
          onClick={() => onStart(activity.id)}
        >
          {isReady ? 'Kick off' : 'Coming soon'}
        </button>
      </div>
    </article>
  )
}
