import { fireEvent, render, screen } from '@testing-library/react'
import SimulationControls from './SimulationControls.jsx'

describe('SimulationControls', () => {
  it('exposes one compact playback control without speed or clock UI', () => {
    const onTogglePlaying = vi.fn()
    render(
      <SimulationControls
        playing
        onTogglePlaying={onTogglePlaying}
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Pause' }))
    expect(onTogglePlaying).toHaveBeenCalledOnce()
    expect(screen.queryByText(/simulated time/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/slow|normal|fast/i)).not.toBeInTheDocument()
  })
})
