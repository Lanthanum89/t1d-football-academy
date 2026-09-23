import type { Activity } from '../types/activity'

export const activities: Activity[] = [
  {
    id: 'call-the-coach',
    title: 'Call the Coach!',
    strapline: 'Spot it. Stop play. Get your grown-up.',
    artwork: 'whistle',
    colour: 'blue',
    status: 'ready',
  },
  {
    id: 'pack-the-kit-bag',
    title: 'Pack the Kit Bag',
    strapline: 'Can you pack the right matchday kit?',
    artwork: 'kit-bag',
    colour: 'orange',
    status: 'ready',
  },
  {
    id: 'half-time-check',
    title: 'Half-Time Check',
    strapline: 'Pause the match and check in with your team.',
    artwork: 'half-time',
    colour: 'purple',
    status: 'ready',
  },
  {
    id: 'meet-the-team',
    title: 'Meet the Team',
    strapline: 'Collect the helpers on your T1D team.',
    artwork: 'team',
    colour: 'green',
    status: 'ready',
  },
]
