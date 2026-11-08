import { createMagnetotailEnvelope, getBodyFieldProfile, getMagneticVisualKind, getMagneticVisualScale } from './MagneticFieldOverlay.jsx'
import { celestialBodies } from '../../data/catalog.js'

const environment = (family) => ({ magnetic: { family } })

describe('magnetic visual families', () => {
  it.each([
    'intrinsic_dipole', 'intrinsic_aligned', 'intrinsic_tilted_offset',
    'induced', 'crustal_remnant', 'intrinsic_mini', 'parent_plasma',
  ])('selects a body-specific visual for %s', (family) => {
    expect(getMagneticVisualKind(environment(family))).toBe(family)
  })

  it.each(['unknown', 'negligible'])('does not invent a field visual for %s', (family) => {
    expect(getMagneticVisualKind(environment(family))).toBeNull()
  })

  it('preserves the required special-body mappings', () => {
    const families = Object.fromEntries(celestialBodies.map((body) => [body.id, body.solarEnvironment.magnetic.family]))
    expect(families).toMatchObject({
      venus: 'induced', mars: 'crustal_remnant', moon: 'crustal_remnant',
      uranus: 'intrinsic_tilted_offset', neptune: 'intrinsic_tilted_offset',
      ganymede: 'intrinsic_mini', europa: 'induced', io: 'parent_plasma',
    })
  })

  it('makes an extreme environment larger than a limited one without changing scientific data', () => {
    expect(getMagneticVisualScale({ magnetic: { shielding: 'extreme' } }))
      .toBeGreaterThan(getMagneticVisualScale({ magnetic: { shielding: 'limited' } }))
  })

  it('keeps the manually reviewed intrinsic bodies geometrically distinct', () => {
    const intrinsic = { magnetic: { shielding: 'substantial' } }
    expect(getBodyFieldProfile('mercury', intrinsic).scale).toBeLessThan(getBodyFieldProfile('earth', intrinsic).scale)
    expect(getBodyFieldProfile('jupiter', intrinsic).tail).toBeGreaterThan(getBodyFieldProfile('earth', intrinsic).tail)
    expect(getBodyFieldProfile('uranus', intrinsic).tilt).not.toBe(getBodyFieldProfile('neptune', intrinsic).tilt)
    expect(getBodyFieldProfile('uranus', intrinsic).skew).not.toBe(getBodyFieldProfile('neptune', intrinsic).skew)
  })

  it('builds smooth envelopes that never cut through the body', () => {
    const intrinsic = { magnetic: { shielding: 'substantial' } }
    for (const bodyId of ['mercury', 'earth', 'jupiter', 'saturn', 'uranus', 'neptune', 'ganymede']) {
      const points = createMagnetotailEnvelope(1, getBodyFieldProfile(bodyId, intrinsic), 0.2)
      expect(Math.min(...points.map(([x, y, z]) => Math.hypot(x, y, z)))).toBeGreaterThan(1.02)
      expect(points[0][0]).toBeCloseTo(points.at(-1)[0], 8)
      expect(points[0][1]).toBeGreaterThan(0)
      expect(points.at(-1)[1]).toBeLessThan(0)
    }
  })

  it('gives every visible body a distinct field silhouette', () => {
    const visibleBodies = celestialBodies.filter((body) => getMagneticVisualKind(body.solarEnvironment))
    const signatures = visibleBodies.map((body) => {
      const profile = getBodyFieldProfile(body.id, body.solarEnvironment)
      return [profile.tail, profile.tilt, profile.compression, profile.shells, profile.vertical, profile.tailPinch, profile.roundness, profile.skew].join('|')
    })
    expect(new Set(signatures).size).toBe(visibleBodies.length)
  })
})
