export type ActivityStatus = 'ready' | 'planned'

export type Activity = {
  id: string
  title: string
  strapline: string
  artwork: 'whistle' | 'kit-bag' | 'half-time' | 'team'
  colour: 'blue' | 'orange' | 'purple' | 'green'
  status: ActivityStatus
}
