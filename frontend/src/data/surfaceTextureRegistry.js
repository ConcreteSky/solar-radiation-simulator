import mercury from '../assets/textures/mercury-messenger.jpg'
import venus from '../assets/textures/venus-magellan.jpg'
import earth from '../assets/textures/earth-blue-marble.png'
import mars from '../assets/textures/mars-viking.jpg'
import jupiter from '../assets/textures/jupiter-voyager.jpg'
import saturn from '../assets/textures/saturn-nasa-reconstruction.jpg'
import uranus from '../assets/textures/uranus-nasa-model.png'
import neptune from '../assets/textures/neptune-nasa-model.png'
import ceres from '../assets/textures/ceres-dawn.jpg'
import pluto from '../assets/textures/pluto-new-horizons.jpg'
import eris from '../assets/textures/eris-nasa-model.png'
import haumea from '../assets/models/haumea-nasa-model.glb'
import makemake from '../assets/models/makemake-nasa-model.glb'
import moon from '../assets/textures/moon-lro.jpg'
import phobos from '../assets/textures/phobos-viking.jpg'
import deimos from '../assets/textures/deimos-viking.jpg'
import io from '../assets/textures/io-voyager.jpg'
import europa from '../assets/textures/europa-voyager-galileo.jpg'
import ganymede from '../assets/textures/ganymede-voyager-galileo.jpg'
import callisto from '../assets/textures/callisto-voyager-galileo.jpg'
import titan from '../assets/textures/titan-cassini-global.jpg'
import rhea from '../assets/textures/rhea-voyager.jpg'
import iapetus from '../assets/textures/iapetus-voyager.jpg'
import dione from '../assets/textures/dione-voyager.jpg'
import titania from '../assets/textures/titania-voyager.jpg'
import oberon from '../assets/textures/oberon-voyager.jpg'
import umbriel from '../assets/textures/umbriel-voyager.jpg'
import ariel from '../assets/textures/ariel-voyager.jpg'
import triton from '../assets/textures/triton-voyager.jpg'
import proteus from '../assets/textures/proteus-voyager-photo.jpg'
import nereid from '../assets/textures/nereid-voyager-photo.jpg'
import larissa from '../assets/textures/larissa-voyager-photo.jpg'

const observedMap = (map, options = {}) => ({
  kind: 'observed-map',
  map,
  rotationY: 0,
  ...options,
})

const officialModel = (model) => ({
  kind: 'official-model',
  model,
})

const observedPhoto = (photo, options = {}) => ({
  kind: 'observed-photo',
  photo,
  ...options,
})

// Observed maps are preferred. Official NASA scientific models cover bodies that
// have never been mapped globally; sparse Voyager targets retain their real photos.
export const surfaceTextureRegistry = Object.freeze({
  mercury: observedMap(mercury),
  venus: observedMap(venus),
  earth: observedMap(earth, { rotationY: -0.42 }),
  mars: observedMap(mars),
  jupiter: observedMap(jupiter),
  saturn: observedMap(saturn),
  uranus: observedMap(uranus, { contrast: 1.16 }),
  neptune: observedMap(neptune, { contrast: 1.12 }),
  ceres: observedMap(ceres),
  pluto: observedMap(pluto, { tint: '#b99582' }),
  eris: observedMap(eris),
  haumea: officialModel(haumea),
  makemake: officialModel(makemake),
  moon: observedMap(moon),
  phobos: observedMap(phobos),
  deimos: observedMap(deimos),
  io: observedMap(io),
  europa: observedMap(europa),
  ganymede: observedMap(ganymede),
  callisto: observedMap(callisto),
  titan: observedMap(titan, { tint: '#c58b48', atmosphereColor: '#d89b45' }),
  rhea: observedMap(rhea),
  iapetus: observedMap(iapetus),
  dione: observedMap(dione),
  titania: observedMap(titania),
  oberon: observedMap(oberon),
  umbriel: observedMap(umbriel),
  ariel: observedMap(ariel),
  triton: observedMap(triton),
  proteus: observedPhoto(proteus, { repeat: [0.72, 0.72], offset: [0.14, 0.14], aspect: 1.18 }),
  nereid: observedPhoto(nereid, { repeat: [0.28, 0.28], offset: [0.36, 0.36], aspect: 1 }),
  larissa: observedPhoto(larissa, { repeat: [0.5, 0.82], offset: [0.08, 0.09], aspect: 0.94 }),
})

export function getSurfaceTreatment(bodyId) {
  return surfaceTextureRegistry[bodyId]
}
