import type { Activity } from '../types/activity'

type ActivityCardProps = {
  activity: Activity
  onStart: (activityId: string) => void
}

export function ActivityCard({ activity, onStart }: ActivityCardProps) {
  const isReady = activity.status === 'ready'

  return (
    <article className={`activity-card activity-card--${activity.colour}`}>
      <div className="activity-card__icon" aria-hidden="true">
        {activity.icon}
      </div>
      <div className="activity-card__body">
        <div className="activity-card__title-row">
          <h2>{activity.title}</h2>
          <span className={`status-chip status-chip--${activity.status}`}>
            {isReady ? 'Ready' : 'Coming soon'}
          </span>
        </div>
        <p>{activity.description}</p>
        <button
          className="activity-card__button"
          type="button"
          disabled={!isReady}
          onClick={() => onStart(activity.id)}
        >
          {isReady ? 'Start training' : 'Training soon'}
        </button>
      </div>
    </article>
  )
}

