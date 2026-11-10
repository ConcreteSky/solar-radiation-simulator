import { celestialBodies } from './catalog.js'
import { getSurfaceTreatment, surfaceTextureRegistry } from './surfaceTextureRegistry.js'

describe('surfaceTextureRegistry', () => {
  it('classifies every selectable body without falling back to procedural art', () => {
    expect(Object.keys(surfaceTextureRegistry)).toHaveLength(celestialBodies.length)

    celestialBodies.forEach((body) => {
      expect(getSurfaceTreatment(body.id).kind).toMatch(
        /^(observed-map|observed-color|unresolved-photometry)$/,
      )
    })
  })

  it('uses mission-derived global maps for the well-imaged worlds', () => {
    const mappedBodies = [
      'mercury', 'venus', 'earth', 'mars', 'jupiter', 'ceres', 'pluto', 'moon',
      'phobos', 'deimos', 'io', 'europa', 'ganymede', 'callisto', 'rhea',
      'iapetus', 'dione', 'titania', 'oberon', 'umbriel', 'ariel', 'triton',
    ]

    mappedBodies.forEach((bodyId) => {
      expect(getSurfaceTreatment(bodyId).kind).toBe('observed-map')
      expect(getSurfaceTreatment(bodyId).map).toBeTruthy()
    })
  })

  it('does not claim invented maps for unresolved distant worlds', () => {
    ;['eris', 'haumea', 'makemake', 'proteus', 'nereid', 'larissa'].forEach((bodyId) => {
      expect(getSurfaceTreatment(bodyId)).toMatchObject({
        kind: 'unresolved-photometry',
        map: null,
      })
    })
  })
})
