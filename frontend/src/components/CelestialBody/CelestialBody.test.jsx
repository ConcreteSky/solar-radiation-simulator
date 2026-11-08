import { fireEvent, render, screen } from '@testing-library/react'
import { celestialBodies } from '../../data/catalog.js'
import CelestialBody, { getBodyDisplayScale } from './CelestialBody.jsx'

vi.mock('@react-three/drei', () => ({
  Html: ({ children }) => <div>{children}</div>,
  useTexture: vi.fn(() => ({})),
}))

const earth = celestialBodies.find((body) => body.id === 'earth')
const moon = celestialBodies.find((body) => body.id === 'moon')

describe('CelestialBody', () => {
  it('does not inflate a selected moon beyond the primary-body scale', () => {
    expect(getBodyDisplayScale(moon, { selected: true, hovered: false, dimmed: false })).toBe(1.18)
    expect(getBodyDisplayScale(moon, { selected: true, hovered: false, dimmed: false }) * 0.86)
      .toBeLessThan(1.2)
  })

  it('allows the visible destination label to select its body', () => {
    const onSelect = vi.fn()
    render(
      <CelestialBody
        body={earth}
        position={[0, 0, 0]}
        radius={1.5}
        selected={false}
        showLabel
        onSelect={onSelect}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Select Earth' }))

    expect(onSelect).toHaveBeenCalledOnce()
    expect(onSelect).toHaveBeenCalledWith('earth')
  })
})
