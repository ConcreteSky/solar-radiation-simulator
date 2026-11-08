import { Html, useTexture } from '@react-three/drei'
import { memo, useEffect, useMemo, useState } from 'react'
import { RepeatWrapping, SRGBColorSpace } from 'three'
import earthBlueMarble from '../../assets/textures/earth-blue-marble.png'
import { getPlanetTexture } from '../../data/planetTextureFactory.js'
import MagneticFieldOverlay from '../MagneticField/MagneticFieldOverlay.jsx'

function EarthSurface({ radius, bodyScale }) {
  const texture = useTexture(earthBlueMarble)
  useEffect(() => {
    texture.colorSpace = SRGBColorSpace
    texture.wrapS = RepeatWrapping
    texture.needsUpdate = true
  }, [texture])
  return (
    <mesh scale={bodyScale} rotation={[0, -0.42, 0]}>
      <sphereGeometry args={[radius, 48, 32]} />
      <meshStandardMaterial map={texture} emissiveMap={texture} color="#b4b7bd" roughness={0.82} emissive="#252a33" emissiveIntensity={0.28} />
    </mesh>
  )
}

function TexturedSurface({ body, radius, bodyScale }) {
  const texture = useMemo(() => getPlanetTexture(body), [body])
  if (!texture) return <ColorSurface body={body} radius={radius} bodyScale={bodyScale} />
  return (
    <mesh scale={bodyScale}>
      <sphereGeometry args={[radius, 28, 18]} />
      <meshStandardMaterial
        map={texture}
        color="#ffffff"
        roughness={body.type === 'moon' ? 0.94 : 0.8}
        emissive="#10141d"
        emissiveIntensity={0.15}
      />
    </mesh>
  )
}

function ColorSurface({ body, radius, bodyScale }) {
  const isSun = body.id === 'sun'
  return (
    <mesh scale={bodyScale}>
      <sphereGeometry args={[radius, 28, 18]} />
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

      {body.id === 'earth' ? (
        <EarthSurface radius={radius} bodyScale={bodyScale} />
      ) : body.id !== 'sun' ? (
        <TexturedSurface body={body} radius={radius} bodyScale={bodyScale} />
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
