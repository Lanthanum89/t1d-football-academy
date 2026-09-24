import { fireEvent, render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import App from './App'

// jsdom has no PointerEvent constructor, so RTL's fireEvent.pointer* helpers
// silently drop clientX/clientY/pointerId. Build the native event by hand and
// assign the fields our drag handlers read.
function firePointerEvent(element: Element, type: string, props: Record<string, unknown>) {
  const event = new Event(type, { bubbles: true, cancelable: true })
  Object.assign(event, { pointerType: 'touch', button: 0 }, props)
  fireEvent(element, event)
}

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

    fireEvent.click(screen.getAllByRole('button', { name: /Kick off/i })[0])
    fireEvent.click(screen.getByRole('button', { name: /Blow the whistle/i }))
    expect(screen.getByRole('heading', { name: /Who do you tell/i })).toHaveFocus()
    fireEvent.click(screen.getByRole('button', { name: /My grown-up/i }))

    expect(screen.getByRole('heading', { name: 'Great teamwork!' })).toHaveFocus()
    expect(screen.getByText(/grown-up is ready to help/i)).toBeInTheDocument()
  })

  it('gently redirects an unsafe choice', () => {
    render(<App />)

    fireEvent.click(screen.getAllByRole('button', { name: /Kick off/i })[0])
    fireEvent.click(screen.getByRole('button', { name: /Blow the whistle/i }))
    fireEvent.click(screen.getByRole('button', { name: /Keep playing/i }))

    expect(screen.getByText('Let’s try that again')).toBeInTheDocument()
    expect(screen.getByText(/tell your grown-up first/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Tell my grown-up/i })).toBeInTheDocument()
  })

  it('packs the kit bag and flags anything missing', () => {
    render(<App />)

    fireEvent.click(screen.getAllByRole('button', { name: /Kick off/i })[1])
    fireEvent.click(screen.getByRole('button', { name: /Open the kit bag/i }))
    fireEvent.click(screen.getByRole('button', { name: /Glucose meter/i }))
    fireEvent.click(screen.getByRole('button', { name: /Check the bag/i }))

    expect(screen.getByText('Almost there')).toBeInTheDocument()
    expect(screen.getByText(/Don't forget:/i)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Back to the bag/i }))
    fireEvent.click(screen.getByRole('button', { name: /Quick sugar snack/i }))
    fireEvent.click(screen.getByRole('button', { name: /Insulin kit/i }))
    fireEvent.click(screen.getByRole('button', { name: /Spare device batteries/i }))
    fireEvent.click(screen.getByRole('button', { name: /Check the bag/i }))

    expect(screen.getByText('Kit bag ready!')).toBeInTheDocument()
  })

  it('drags a kit item into the bag', () => {
    render(<App />)

    fireEvent.click(screen.getAllByRole('button', { name: /Kick off/i })[1])
    fireEvent.click(screen.getByRole('button', { name: /Open the kit bag/i }))

    const item = screen.getByRole('button', { name: /Glucose meter/i })
    const bagZone = document.querySelector('.kit-bag-zone') as HTMLElement
    vi.spyOn(bagZone, 'getBoundingClientRect').mockReturnValue({
      left: 100, right: 300, top: 100, bottom: 200, width: 200, height: 100, x: 100, y: 100, toJSON: () => {},
    } as DOMRect)

    firePointerEvent(item, 'pointerdown', { pointerId: 1, clientX: 10, clientY: 10 })
    firePointerEvent(item, 'pointermove', { pointerId: 1, clientX: 150, clientY: 150 })
    firePointerEvent(item, 'pointerup', { pointerId: 1, clientX: 150, clientY: 150 })

    expect(screen.getByRole('button', { name: /Glucose meter\. Packed\. Tap to remove\./i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /^Glucose meter Drag or tap to pack$/i })).not.toBeInTheDocument()
  })

  it('reinforces pausing for the half-time check', () => {
    render(<App />)

    fireEvent.click(screen.getAllByRole('button', { name: /Kick off/i })[2])
    fireEvent.click(screen.getByRole('button', { name: /Blow the whistle/i }))
    fireEvent.click(screen.getByRole('button', { name: /Keep playing/i }))

    expect(screen.getByText(/Half time is for everyone to pause/i)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Pause and check in/i }))
    expect(screen.getByRole('heading', { name: 'Great teamwork!' })).toHaveFocus()
  })

  it('collects every teammate in Meet the Team', () => {
    render(<App />)

    fireEvent.click(screen.getAllByRole('button', { name: /Kick off/i })[3])
    fireEvent.click(screen.getByRole('button', { name: /Meet the team/i }))

    for (const name of ['Insulin', 'Glucose device', 'Food', 'Movement', 'Devices', 'Trusted adult']) {
      fireEvent.click(screen.getByRole('button', { name: `${name} Tap to reveal` }))
    }

    fireEvent.click(screen.getByRole('button', { name: /Full squad!/i }))
    expect(screen.getByRole('heading', { name: 'Full squad!' })).toHaveFocus()
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
    fireEvent.click(screen.getAllByRole('button', { name: /Kick off/i })[0])
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
