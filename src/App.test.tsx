import { fireEvent, render, screen } from '@testing-library/react'
import { vi } from 'vitest'
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
    expect(screen.getByRole('heading', { name: /Who do you tell/i })).toHaveFocus()
    fireEvent.click(screen.getByRole('button', { name: /My grown-up/i }))

    expect(screen.getByRole('heading', { name: 'Great teamwork!' })).toHaveFocus()
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

  it('speaks the visible feedback and cancels speech when leaving', () => {
    const speak = vi.fn()
    const cancel = vi.fn()

    class MockSpeechSynthesisUtterance {
      text: string

      constructor(text: string) {
        this.text = text
      }
    }

    Object.defineProperty(window, 'speechSynthesis', {
      configurable: true,
      value: { cancel, speak },
    })
    vi.stubGlobal('SpeechSynthesisUtterance', MockSpeechSynthesisUtterance)

    const { unmount } = render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /Kick off/i }))
    fireEvent.click(screen.getByRole('button', { name: /Blow the whistle/i }))
    fireEvent.click(screen.getByRole('button', { name: /My grown-up/i }))
    fireEvent.click(screen.getByRole('button', { name: /Hear it/i }))

    expect(speak).toHaveBeenCalledWith(expect.objectContaining({
      text: expect.stringContaining('Great teamwork!'),
    }))

    const cancellationsBeforeUnmount = cancel.mock.calls.length
    unmount()
    expect(cancel.mock.calls.length).toBeGreaterThan(cancellationsBeforeUnmount)

    vi.unstubAllGlobals()
  })
})
