import { fireEvent, render, screen } from '@testing-library/react'
import App from './App'

describe('T1D Football Academy', () => {
  it('shows the four academy activities', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: 'Call the Coach!' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Pack the Kit Bag' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Half-Time Check' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Meet the Team' })).toBeInTheDocument()
  })

  it('starts the Call the Coach drill and reinforces telling an adult', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: /Play now/i }))
    fireEvent.click(screen.getByRole('button', { name: /Tell a grown-up/i }))

    expect(screen.getByText('Goal!')).toBeInTheDocument()
    expect(screen.getByText(/trusted grown-up can help check/i)).toBeInTheDocument()
  })
})

