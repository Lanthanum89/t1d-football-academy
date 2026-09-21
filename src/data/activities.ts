import type { Activity } from '../types/activity'

export const activities: Activity[] = [
  {
    id: 'call-the-coach',
    title: 'Call the Coach!',
    description: 'Shout for your grown-up teammate the moment something feels wobbly.',
    icon: '📣',
    colour: 'blue',
    status: 'ready',
  },
  {
    id: 'pack-the-kit-bag',
    title: 'Pack the Kit Bag',
    description: 'Race to spot which gear your team always brings to the pitch.',
    icon: '🎒',
    colour: 'orange',
    status: 'planned',
  },
  {
    id: 'half-time-check',
    title: 'Half-Time Check',
    description: 'Blow the whistle for a quick check, then get straight back to the fun.',
    icon: '⏱️',
    colour: 'purple',
    status: 'planned',
  },
  {
    id: 'meet-the-team',
    title: 'Meet the Team',
    description: 'Say hi to insulin, glucose, food, movement and your trusted grown-ups.',
    icon: '⚽',
    colour: 'green',
    status: 'planned',
  },
]

