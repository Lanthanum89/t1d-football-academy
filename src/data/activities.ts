import type { Activity } from '../types/activity'

export const activities: Activity[] = [
  {
    id: 'call-the-coach',
    title: 'Call the Coach',
    description: 'Practise telling a trusted grown-up when something feels different.',
    icon: '📣',
    colour: 'blue',
    status: 'ready',
  },
  {
    id: 'pack-the-kit-bag',
    title: 'Pack the Kit Bag',
    description: 'Learn which familiar T1D items travel with the team.',
    icon: '🎒',
    colour: 'orange',
    status: 'planned',
  },
  {
    id: 'half-time-check',
    title: 'Half-Time Check',
    description: 'See how stopping for a check helps players get back to having fun.',
    icon: '⏱️',
    colour: 'purple',
    status: 'planned',
  },
  {
    id: 'meet-the-team',
    title: 'Meet the Team',
    description: 'Meet insulin, glucose, food, movement, devices and trusted adults.',
    icon: '⚽',
    colour: 'green',
    status: 'planned',
  },
]

