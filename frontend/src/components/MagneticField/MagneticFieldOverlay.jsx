import { Line } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { memo, useMemo, useRef } from 'react'
import { AdditiveBlending, Object3D, Vector3 } from 'three'

const FIELD_COLOR = '#49b9ff'
const FIELD_HIGHLIGHT = '#8bdcff'
const WIND_COLOR = '#76ff65'
const PARTICLE_COUNT = 18

const VISIBLE_FAMILIES = new Set([
  'intrinsic_dipole', 'intrinsic_aligned', 'intrinsic_tilted_offset',
  'induced', 'crustal_remnant', 'intrinsic_mini', 'parent_plasma',
])

export function getMagneticVisualKind(environment) {
  const family = environment?.magnetic?.family ?? 'unknown'
  return VISIBLE_FAMILIES.has(family) ? family : null
}

export function getMagneticVisualScale(environment) {
  return ({ extreme: 1.45, substantial: 1, moderate: 0.82, limited: 0.68, none: 0.62 })[environment?.magnetic?.shielding] ?? 0.72
}

export function getBodyFieldProfile(bodyId, environment) {
  const base = getMagneticVisualScale(environment)
  const bodyProfiles = {
    mercury: { scale: 0.62, tail: 2.25, tilt: 0.04, compression: 0.52, shells: 4, strength: 0.72, vertical: 0.82, tailPinch: 0.48, roundness: 1.34, skew: 0.02 },
    venus: { scale: 0.68, tail: 3.15, tilt: 0, compression: 0.62, shells: 4, strength: 0.68, vertical: 1.08, tailPinch: 0.7, roundness: 1.08, skew: 0.05 },
    earth: { scale: 1, tail: 4.8, tilt: 0.19, compression: 0.78, shells: 6, strength: 1, vertical: 1, tailPinch: 0.62, roundness: 1.08, skew: 0 },
    mars: { scale: 0.68, tail: 1.85, tilt: 0.08, compression: 0.46, shells: 2, strength: 0.46, vertical: 0.92, tailPinch: 0.78, roundness: 1.4, skew: -0.08 },
    jupiter: { scale: 1.42, tail: 7.4, tilt: 0.16, compression: 1.08, shells: 8, strength: 1, vertical: 1.32, tailPinch: 0.42, roundness: 0.92, skew: 0.05 },
    saturn: { scale: 1.18, tail: 5.2, tilt: 0.015, compression: 0.96, shells: 5, strength: 0.86, vertical: 1.12, tailPinch: 0.7, roundness: 1.02, skew: 0 },
    uranus: { scale: 1.08, tail: 4.1, tilt: 1.02, compression: 0.82, shells: 5, strength: 0.88, vertical: 1.14, tailPinch: 0.56, roundness: 1.18, skew: 0.2 },
    neptune: { scale: 1.02, tail: 4.55, tilt: -0.82, compression: 0.86, shells: 5, strength: 0.9, vertical: 0.98, tailPinch: 0.52, roundness: 0.98, skew: -0.18 },
    moon: { scale: 0.68, tail: 1.55, tilt: -0.16, compression: 0.42, shells: 2, strength: 0.42, vertical: 0.84, tailPinch: 0.82, roundness: 1.5, skew: 0.12 },
    io: { scale: 0.62, tail: 3.8, tilt: 0.06, compression: 0.58, shells: 4, strength: 0.74, vertical: 0.86, tailPinch: 0.58, roundness: 1.22, skew: 0.14 },
    europa: { scale: 0.68, tail: 2.55, tilt: -0.05, compression: 0.55, shells: 3, strength: 0.58, vertical: 0.9, tailPinch: 0.72, roundness: 1.26, skew: -0.04 },
    ganymede: { scale: 0.7, tail: 2.3, tilt: 0.1, compression: 0.74, shells: 4, strength: 0.72, vertical: 0.9, tailPinch: 0.62, roundness: 1.12, skew: 0 },
    callisto: { scale: 0.66, tail: 2.9, tilt: 0.03, compression: 0.52, shells: 3, strength: 0.5, vertical: 1.04, tailPinch: 0.76, roundness: 1.16, skew: 0.07 },
    titan: { scale: 0.68, tail: 3.5, tilt: 0.07, compression: 0.68, shells: 4, strength: 0.66, vertical: 1.2, tailPinch: 0.7, roundness: 1.02, skew: -0.06 },
    rhea: { scale: 0.62, tail: 2.5, tilt: -0.08, compression: 0.52, shells: 3, strength: 0.46, vertical: 0.86, tailPinch: 0.66, roundness: 1.32, skew: 0.08 },
    dione: { scale: 0.62, tail: 2.25, tilt: 0.12, compression: 0.5, shells: 3, strength: 0.44, vertical: 0.82, tailPinch: 0.7, roundness: 1.38, skew: -0.08 },
    titania: { scale: 0.62, tail: 2.8, tilt: 0.35, compression: 0.56, shells: 3, strength: 0.48, vertical: 0.94, tailPinch: 0.62, roundness: 1.2, skew: 0.14 },
    oberon: { scale: 0.62, tail: 2.6, tilt: -0.28, compression: 0.53, shells: 3, strength: 0.44, vertical: 0.88, tailPinch: 0.66, roundness: 1.28, skew: -0.12 },
    umbriel: { scale: 0.62, tail: 2.2, tilt: 0.22, compression: 0.48, shells: 3, strength: 0.4, vertical: 0.8, tailPinch: 0.7, roundness: 1.42, skew: 0.1 },
    ariel: { scale: 0.62, tail: 2.45, tilt: -0.18, compression: 0.52, shells: 3, strength: 0.44, vertical: 0.86, tailPinch: 0.68, roundness: 1.3, skew: -0.06 },
    triton: { scale: 0.62, tail: 3.25, tilt: 0.26, compression: 0.6, shells: 4, strength: 0.56, vertical: 1.04, tailPinch: 0.58, roundness: 1.14, skew: 0.12 },
    proteus: { scale: 0.62, tail: 2.1, tilt: -0.1, compression: 0.46, shells: 3, strength: 0.4, vertical: 0.78, tailPinch: 0.72, roundness: 1.44, skew: -0.08 },
    larissa: { scale: 0.62, tail: 1.95, tilt: 0.14, compression: 0.44, shells: 3, strength: 0.38, vertical: 0.76, tailPinch: 0.74, roundness: 1.48, skew: 0.07 },
  }
  return bodyProfiles[bodyId] ?? { scale: base, tail: 3, tilt: 0, compression: 0.8, shells: 4, strength: 0.62, vertical: 1, tailPinch: 0.66, roundness: 1.12, skew: 0 }
}

export function createMagnetotailEnvelope(radius, profile, shell = 1) {
  const clearance = Math.max(
    radius * (1.07 + shell * 0.28),
    radius * (1.08 + shell * 0.34) * profile.vertical,
  )
  const nose = radius * Math.max(1.28 + shell * 0.48, profile.compression * (1.45 + shell * 0.72))
  const tailLength = radius * profile.tail * (0.84 + shell * 0.18)
  const tailHeight = clearance * (profile.tailPinch + shell * 0.1)
  const upperHeight = tailHeight * (1 + profile.skew)
  const lowerHeight = tailHeight * (1 - profile.skew)
  const upperTail = Array.from({ length: 25 }, (_, index) => {
    const t = 1 - index / 24
    const eased = t * t * (3 - 2 * t)
    return [radius * 0.12 + tailLength * eased, upperHeight - (upperHeight - clearance) * (1 - eased), 0]
  })
  const bow = Array.from({ length: 49 }, (_, index) => {
    const angle = (index / 48) * Math.PI
    const sin = Math.sin(angle)
    const y = clearance * Math.cos(angle) + radius * profile.skew * 0.2 * sin ** 2
    return [radius * 0.12 - nose * sin ** profile.roundness, y, 0]
  })
  const lowerTail = Array.from({ length: 25 }, (_, index) => {
    const t = index / 24
    const eased = t * t * (3 - 2 * t)
    return [radius * 0.12 + tailLength * eased, -clearance + (clearance - lowerHeight) * eased, 0]
  })
  return [...upperTail, ...bow.slice(1), ...lowerTail.slice(1)]
}

function SmoothEnvelope({ radius, profile, strength = profile.strength, shells = profile.shells, tilt = profile.tilt }) {
  const shellValues = Array.from({ length: shells }, (_, index) => 0.2 + index * (0.8 / Math.max(shells - 1, 1)))
  return (
    <group rotation={[0, 0, tilt]}>
      {shellValues.map((shell, index) => (
        <Line
          key={shell}
          points={createMagnetotailEnvelope(radius, profile, shell)}
          color={index < 2 ? FIELD_HIGHLIGHT : FIELD_COLOR}
          transparent
          opacity={(0.9 - index * 0.075) * strength}
          lineWidth={index === 0 ? 3.2 : 2.55}
          depthTest={false}
          renderOrder={4}
        />
      ))}
    </group>
  )
}

function IntrinsicField({ radius, profile }) {
  return <SmoothEnvelope radius={radius} profile={profile} />
}

function DrapedField({ radius, profile, embedded = false }) {
  return <SmoothEnvelope radius={radius} profile={profile} strength={embedded ? profile.strength * 0.82 : profile.strength} />
}

function CrustalField({ radius, profile }) {
  return <SmoothEnvelope radius={radius} profile={profile} />
}

function ParentPlasmaField({ radius, profile, bodyId }) {
  return <SmoothEnvelope radius={radius} profile={profile} strength={bodyId === 'io' ? profile.strength : profile.strength * 0.9} />
}

function SolarWindFlow({ radius, family }) {
  const particleMeshRef = useRef()
  const particleTransform = useMemo(() => new Object3D(), [])
  const particles = useMemo(() => Array.from({ length: PARTICLE_COUNT }, (_, index) => ({
    phase: (index / PARTICLE_COUNT) * 13,
    y: ((index * 7) % 9 - 4) * radius * 0.48,
    z: ((index * 11) % 11 - 5) * radius * 0.38,
  })), [radius])

  useFrame(({ clock }) => {
    const particleMesh = particleMeshRef.current
    if (!particleMesh) return
    const elapsed = clock.getElapsedTime()
    particles.forEach((particle, index) => {
      const x = -radius * 7 + ((particle.phase + elapsed * 1.25) % 13) * radius
      const closeness = Math.exp(-((x / radius) ** 2) * 0.32)
      let y = particle.y
      let z = particle.z
      if (family?.startsWith('intrinsic')) {
        z += Math.sign(z || y || 1) * closeness * radius * 2.35
        y += Math.sign(y || 1) * closeness * radius * 0.7
      } else if (family === 'induced') {
        z += Math.sign(z || 1) * closeness * radius * 1.35
      } else if (family === 'crustal_remnant') {
        y += Math.sin(elapsed * 1.6 + index) * closeness * radius * 0.24
      } else if (family === 'parent_plasma') {
        y += Math.sin(x / (radius * 13) * Math.PI * 4 + index) * radius * 0.28
      }
      particleTransform.position.set(x, y, z)
      particleTransform.scale.set(radius * 0.34, radius * 0.075, radius * 0.075)
      particleTransform.updateMatrix()
      particleMesh.setMatrixAt(index, particleTransform.matrix)
    })
    particleMesh.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={particleMeshRef} args={[null, null, PARTICLE_COUNT]} raycast={() => null} frustumCulled={false}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color={WIND_COLOR} transparent opacity={0.9} depthWrite={false} toneMapped={false} blending={AdditiveBlending} />
    </instancedMesh>
  )
}

const localSunPosition = new Vector3()

function MagneticFieldOverlay({ bodyId, environment, radius }) {
  const family = getMagneticVisualKind(environment)
  const profile = getBodyFieldProfile(bodyId, environment)
  const groupRef = useRef()
  useFrame(({ camera }) => {
    if (!groupRef.current) return
    groupRef.current.lookAt(camera.position)
    groupRef.current.updateMatrixWorld(true)
    localSunPosition.set(0, 0, 0)
    groupRef.current.worldToLocal(localSunPosition)
    groupRef.current.rotateZ(Math.atan2(localSunPosition.y, localSunPosition.x) - Math.PI)
  })
  return (
    <group ref={groupRef} userData={{ magneticFamily: family ?? 'none', visualScale: profile.scale }}>
      <SolarWindFlow radius={radius} family={family} />
      {family === 'intrinsic_dipole' && <IntrinsicField radius={radius} profile={profile} bodyId={bodyId} />}
      {family === 'intrinsic_aligned' && <IntrinsicField radius={radius} profile={profile} bodyId={bodyId} aligned />}
      {family === 'intrinsic_tilted_offset' && <IntrinsicField radius={radius} profile={profile} bodyId={bodyId} />}
      {family === 'intrinsic_mini' && <IntrinsicField radius={radius} profile={profile} bodyId={bodyId} mini />}
      {family === 'induced' && <DrapedField radius={radius} profile={profile} embedded={environment?.magnetic?.magnetospherePresence === 'parent_embedded'} />}
      {family === 'crustal_remnant' && <CrustalField radius={radius} profile={profile} />}
      {family === 'parent_plasma' && <ParentPlasmaField radius={radius} profile={profile} bodyId={bodyId} />}
    </group>
  )
}

export default memo(MagneticFieldOverlay)
