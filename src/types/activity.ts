export type ActivityStatus = 'ready' | 'planned'

export type Activity = {
  id: string
  title: string
  description: string
  icon: string
  colour: 'blue' | 'orange' | 'purple' | 'green'
  status: ActivityStatus
}

