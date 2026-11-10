import { celestialBodies } from './catalog.js'
import { getSurfaceTreatment, surfaceTextureRegistry } from './surfaceTextureRegistry.js'

describe('surfaceTextureRegistry', () => {
  it('classifies every selectable body without falling back to procedural art', () => {
    expect(Object.keys(surfaceTextureRegistry)).toHaveLength(celestialBodies.length)

    celestialBodies.forEach((body) => {
      expect(getSurfaceTreatment(body.id).kind).toMatch(
        /^(observed-map|official-model|observed-photo)$/,
      )
    })
  })

  it('uses mission-derived global maps for the well-imaged worlds', () => {
    const mappedBodies = [
      'mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus',
      'neptune', 'ceres', 'pluto', 'eris', 'moon', 'phobos', 'deimos', 'io',
      'europa', 'ganymede', 'callisto', 'titan', 'rhea', 'iapetus', 'dione',
      'titania', 'oberon', 'umbriel', 'ariel', 'triton',
    ]

    mappedBodies.forEach((bodyId) => {
      expect(getSurfaceTreatment(bodyId).kind).toBe('observed-map')
      expect(getSurfaceTreatment(bodyId).map).toBeTruthy()
    })
  })

  it('uses official models and mission photos instead of blank fallback spheres', () => {
    ;['haumea', 'makemake'].forEach((bodyId) => {
      expect(getSurfaceTreatment(bodyId).kind).toBe('official-model')
      expect(getSurfaceTreatment(bodyId).model).toBeTruthy()
    })

    ;['proteus', 'nereid', 'larissa'].forEach((bodyId) => {
      expect(getSurfaceTreatment(bodyId).kind).toBe('observed-photo')
      expect(getSurfaceTreatment(bodyId).photo).toBeTruthy()
    })
  })
})
