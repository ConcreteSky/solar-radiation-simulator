import mercury from '../assets/textures/mercury-messenger.jpg'
import venus from '../assets/textures/venus-magellan.jpg'
import earth from '../assets/textures/earth-blue-marble.png'
import mars from '../assets/textures/mars-viking.jpg'
import jupiter from '../assets/textures/jupiter-voyager.jpg'
import ceres from '../assets/textures/ceres-dawn.jpg'
import pluto from '../assets/textures/pluto-new-horizons.jpg'
import moon from '../assets/textures/moon-lro.jpg'
import phobos from '../assets/textures/phobos-viking.jpg'
import deimos from '../assets/textures/deimos-viking.jpg'
import io from '../assets/textures/io-voyager.jpg'
import europa from '../assets/textures/europa-voyager-galileo.jpg'
import ganymede from '../assets/textures/ganymede-voyager-galileo.jpg'
import callisto from '../assets/textures/callisto-voyager-galileo.jpg'
import rhea from '../assets/textures/rhea-voyager.jpg'
import iapetus from '../assets/textures/iapetus-voyager.jpg'
import dione from '../assets/textures/dione-voyager.jpg'
import titania from '../assets/textures/titania-voyager.jpg'
import oberon from '../assets/textures/oberon-voyager.jpg'
import umbriel from '../assets/textures/umbriel-voyager.jpg'
import ariel from '../assets/textures/ariel-voyager.jpg'
import triton from '../assets/textures/triton-voyager.jpg'

const observedMap = (map, rotationY = 0) => ({
  kind: 'observed-map',
  map,
  rotationY,
})

const observedColor = {
  kind: 'observed-color',
  map: null,
}

const unresolvedPhotometry = {
  kind: 'unresolved-photometry',
  map: null,
}

// Only mission-derived global mosaics belong in observed-map. Bodies without a
// trustworthy global map deliberately use measured color instead of invented detail.
export const surfaceTextureRegistry = Object.freeze({
  mercury: observedMap(mercury),
  venus: observedMap(venus),
  earth: observedMap(earth, -0.42),
  mars: observedMap(mars),
  jupiter: observedMap(jupiter),
  saturn: observedColor,
  uranus: observedColor,
  neptune: observedColor,
  ceres: observedMap(ceres),
  pluto: observedMap(pluto),
  eris: unresolvedPhotometry,
  haumea: unresolvedPhotometry,
  makemake: unresolvedPhotometry,
  moon: observedMap(moon),
  phobos: observedMap(phobos),
  deimos: observedMap(deimos),
  io: observedMap(io),
  europa: observedMap(europa),
  ganymede: observedMap(ganymede),
  callisto: observedMap(callisto),
  titan: observedColor,
  rhea: observedMap(rhea),
  iapetus: observedMap(iapetus),
  dione: observedMap(dione),
  titania: observedMap(titania),
  oberon: observedMap(oberon),
  umbriel: observedMap(umbriel),
  ariel: observedMap(ariel),
  triton: observedMap(triton),
  proteus: unresolvedPhotometry,
  nereid: unresolvedPhotometry,
  larissa: unresolvedPhotometry,
})

export function getSurfaceTreatment(bodyId) {
  return surfaceTextureRegistry[bodyId] ?? unresolvedPhotometry
}
