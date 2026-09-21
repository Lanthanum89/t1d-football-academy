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

    fireEvent.click(screen.getByRole('button', { name: /Kick off/i }))
    fireEvent.click(screen.getByRole('button', { name: /Blow the whistle/i }))
    fireEvent.click(screen.getByRole('button', { name: /My grown-up/i }))

    expect(screen.getByText('Great teamwork!')).toBeInTheDocument()
    expect(screen.getByText(/grown-up is ready to help/i)).toBeInTheDocument()
  })

  it('gently redirects an unsafe choice', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: /Kick off/i }))
    fireEvent.click(screen.getByRole('button', { name: /Blow the whistle/i }))
    fireEvent.click(screen.getByRole('button', { name: /Keep playing/i }))

    expect(screen.getByText('Let’s try that again')).toBeInTheDocument()
    expect(screen.getByText(/tell your grown-up first/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Tell my grown-up/i })).toBeInTheDocument()
  })
})
