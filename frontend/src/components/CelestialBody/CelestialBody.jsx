import { Html, useTexture } from '@react-three/drei'
import { memo, useEffect, useState } from 'react'
import { RepeatWrapping, SRGBColorSpace } from 'three'
import { getSurfaceTreatment } from '../../data/surfaceTextureRegistry.js'
import MagneticFieldOverlay from '../MagneticField/MagneticFieldOverlay.jsx'

function ObservedSurface({ body, radius, bodyScale, treatment }) {
  const texture = useTexture(treatment.map)
  useEffect(() => {
    texture.colorSpace = SRGBColorSpace
    texture.wrapS = RepeatWrapping
    texture.needsUpdate = true
  }, [texture])
  return (
    <mesh scale={bodyScale} rotation={[0, treatment.rotationY, 0]}>
      <sphereGeometry args={[radius, 48, 32]} />
      <meshStandardMaterial
        map={texture}
        emissiveMap={texture}
        color="#d4d6da"
        roughness={body.type === 'moon' ? 0.94 : 0.82}
        emissive="#222832"
        emissiveIntensity={0.2}
      />
    </mesh>
  )
}

function ColorSurface({ body, radius, bodyScale }) {
  const isSun = body.id === 'sun'
  return (
    <mesh scale={bodyScale}>
      <sphereGeometry args={[radius, 48, 32]} />
      {isSun ? (
        <meshBasicMaterial color={body.visual.baseColor} toneMapped={false} />
      ) : (
        <meshStandardMaterial
          color={body.visual.baseColor}
          roughness={0.76}
          metalness={0.01}
          emissive={body.visual.baseColor}
          emissiveIntensity={0.13}
        />
      )}
    </mesh>
  )
}

function SaturnRings({ radius }) {
  return (
    <group rotation={[Math.PI / 2, 0, 0]}>
      <mesh>
        <ringGeometry args={[radius * 1.28, radius * 2.08, 72]} />
        <meshBasicMaterial color="#cfbd93" transparent opacity={0.72} side={2} />
      </mesh>
      <mesh position={[0, 0, 0.012]}>
        <ringGeometry args={[radius * 1.56, radius * 1.68, 72]} />
        <meshBasicMaterial color="#786e5c" transparent opacity={0.48} side={2} />
      </mesh>
    </group>
  )
}

export function getBodyDisplayScale(body, { selected, hovered, dimmed }) {
  if (selected) return body.type === 'moon' ? 1.18 : 1.12
  if (hovered) return 1.05
  if (dimmed) return 0.42
  return 1
}

function CelestialBody({
  body,
  position,
  radius,
  selected,
  dimmed = false,
  showLabel,
  onSelect,
}) {
  const [hovered, setHovered] = useState(false)
  const surfaceTreatment = getSurfaceTreatment(body.id)
  const bodyScale = body.id === 'haumea' ? [1.35, 0.74, 0.82] : [1, 1, 1]
  const highlighted = selected || hovered
  const hitRadius = body.type === 'moon'
    ? Math.max(radius * 1.5, 0.9)
    : Math.max(radius * 1.35, 2.1)

  const handlePointerOver = (event) => {
    event.stopPropagation()
    setHovered(true)
    document.body.style.cursor = 'pointer'
  }

  const handlePointerOut = () => {
    setHovered(false)
    document.body.style.cursor = 'default'
  }

  return (
    <group
      position={position}
      scale={getBodyDisplayScale(body, { selected, hovered, dimmed })}
      onClick={(event) => {
        event.stopPropagation()
        onSelect(body.id)
      }}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      userData={{ bodyId: body.id, destination: body.id !== 'sun' }}
    >
      <mesh>
        <sphereGeometry args={[hitRadius, 16, 10]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} colorWrite={false} />
      </mesh>

      {body.id !== 'sun' && surfaceTreatment.map ? (
        <ObservedSurface body={body} radius={radius} bodyScale={bodyScale} treatment={surfaceTreatment} />
      ) : (
        <ColorSurface body={body} radius={radius} bodyScale={bodyScale} />
      )}

      {body.id === 'saturn' && <SaturnRings radius={radius} />}

      {selected && body.solarEnvironment && (
        <MagneticFieldOverlay bodyId={body.id} environment={body.solarEnvironment} radius={radius} />
      )}

      {hovered && !selected && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -radius * 1.18, 0]}>
          <ringGeometry args={[radius * 1.28, radius * 1.38, 48]} />
          <meshBasicMaterial color="#747b86" transparent opacity={0.38} side={2} />
        </mesh>
      )}

      {(showLabel || selected || hovered) && (
        <Html center position={[0, radius + 1.2, 0]} className="body-label-wrapper">
          <button
            type="button"
            className={`body-label ${selected ? 'body-label-selected' : ''}`}
            aria-label={`Select ${body.name}`}
            onClick={(event) => {
              event.stopPropagation()
              onSelect(body.id)
            }}
          >
            {body.name}
          </button>
        </Html>
      )}
    </group>
  )
}

export default memo(CelestialBody)
