import { Line } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { memo, useMemo, useRef } from 'react'
import { BufferAttribute, BufferGeometry, Vector3 } from 'three'

const FIELD_COLOR = '#49b9ff'
const FIELD_HIGHLIGHT = '#8bdcff'
const WIND_COLOR = '#6d8da5'
const HAZARD_COLOR = '#a84466'

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
    mercury: { scale: 0.62, tail: 2.4, tilt: 0.04, compression: 0.56, offset: 0.08 },
    earth: { scale: 1, tail: 4.8, tilt: 0.19, compression: 0.78, offset: 0 },
    jupiter: { scale: 1.42, tail: 6.2, tilt: 0.16, compression: 0.9, offset: 0.08 },
    saturn: { scale: 1.18, tail: 4.6, tilt: 0.015, compression: 0.96, offset: 0 },
    uranus: { scale: 1.08, tail: 4.2, tilt: 1.02, compression: 0.82, offset: 0.34 },
    neptune: { scale: 1.02, tail: 3.8, tilt: -0.82, compression: 0.86, offset: -0.42 },
    ganymede: { scale: 0.7, tail: 2.2, tilt: 0.1, compression: 0.74, offset: 0 },
  }
  return bodyProfiles[bodyId] ?? { scale: base, tail: 3, tilt: 0, compression: 0.8, offset: 0 }
}

export function createMagnetotailEnvelope(radius, profile, shell = 1) {
  const clearance = radius * (1.08 + shell * 0.34)
  const nose = radius * Math.max(1.28 + shell * 0.48, profile.compression * (1.45 + shell * 0.72))
  const tailLength = radius * profile.tail * (0.84 + shell * 0.18)
  const tailHeight = clearance * (0.62 + shell * 0.12)
  const upperTail = Array.from({ length: 25 }, (_, index) => {
    const t = 1 - index / 24
    const eased = t * t * (3 - 2 * t)
    return [radius * 0.12 + tailLength * eased, tailHeight - (tailHeight - clearance) * (1 - eased), 0]
  })
  const bow = Array.from({ length: 49 }, (_, index) => {
    const angle = (index / 48) * Math.PI
    const sin = Math.sin(angle)
    return [radius * 0.12 - nose * sin ** 1.08, clearance * Math.cos(angle), 0]
  })
  const lowerTail = [...upperTail].reverse().map(([x, y, z]) => [x, -y, z])
  return [...upperTail, ...bow.slice(1), ...lowerTail.slice(1)]
}

function SmoothEnvelope({ radius, profile, strength = 1, shells = 5, tilt = profile.tilt }) {
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

function IntrinsicField({ radius, profile, mini = false }) {
  return <SmoothEnvelope radius={radius} profile={profile} strength={mini ? 0.72 : 1} shells={mini ? 4 : 6} />
}

function DrapedField({ radius, profile, embedded = false }) {
  const inducedProfile = { ...profile, compression: 0.64, tail: embedded ? 2.7 : 3.7, offset: 0 }
  return <SmoothEnvelope radius={radius} profile={inducedProfile} strength={embedded ? 0.58 : 0.72} shells={4} tilt={0} />
}

function CrustalField({ radius, profile }) {
  const remnantProfile = { ...profile, compression: 0.48, tail: 2.25, offset: 0 }
  return <SmoothEnvelope radius={radius} profile={remnantProfile} strength={0.5} shells={3} tilt={0.05} />
}

function ParentPlasmaField({ radius, profile, bodyId }) {
  const embeddedProfile = { ...profile, compression: 0.56, tail: bodyId === 'io' ? 3.4 : 2.9, offset: 0 }
  return <SmoothEnvelope radius={radius} profile={embeddedProfile} strength={bodyId === 'io' ? 0.7 : 0.56} shells={4} tilt={0} />
}

function SolarWindFlow({ radius, family, hazardous }) {
  const geometry = useMemo(() => {
    const result = new BufferGeometry()
    result.setAttribute('position', new BufferAttribute(new Float32Array(24 * 3), 3))
    return result
  }, [])
  const particles = useMemo(() => Array.from({ length: 24 }, (_, index) => ({
    phase: (index / 24) * 13,
    y: ((index * 7) % 9 - 4) * radius * 0.48,
    z: ((index * 11) % 11 - 5) * radius * 0.38,
  })), [radius])

  useFrame(({ clock }) => {
    const positions = geometry.attributes.position.array
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
      positions[index * 3] = x
      positions[index * 3 + 1] = y
      positions[index * 3 + 2] = z
    })
    geometry.attributes.position.needsUpdate = true
  })

  return (
    <points geometry={geometry} raycast={() => null}>
      <pointsMaterial color={hazardous ? HAZARD_COLOR : WIND_COLOR} size={radius * 0.12} sizeAttenuation transparent opacity={0.72} />
    </points>
  )
}

const localSunPosition = new Vector3()

function MagneticFieldOverlay({ bodyId, environment, radius }) {
  const family = getMagneticVisualKind(environment)
  const profile = getBodyFieldProfile(bodyId, environment)
  const groupRef = useRef()
  const hazardous = environment?.particleEnvironment?.radiationLevel === 'extreme'
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
      <SolarWindFlow radius={radius} family={family} hazardous={hazardous} />
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
