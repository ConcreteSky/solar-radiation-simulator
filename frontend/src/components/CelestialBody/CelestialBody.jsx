import { Html, useGLTF, useTexture } from '@react-three/drei'
import { memo, useEffect, useMemo, useState } from 'react'
import {
  AdditiveBlending,
  Box3,
  Color,
  RepeatWrapping,
  SRGBColorSpace,
  Vector3,
} from 'three'
import { getSurfaceTreatment } from '../../data/surfaceTextureRegistry.js'
import MagneticFieldOverlay from '../MagneticField/MagneticFieldOverlay.jsx'

function ObservedSurface({ body, radius, bodyScale, treatment }) {
  const texture = useTexture(treatment.map)
  const enhanceMappedMaterial = useMemo(() => (shader) => {
    shader.uniforms.surfaceContrast = { value: treatment.contrast ?? 1 }
    shader.uniforms.surfaceFallback = { value: new Color(body.visual.baseColor) }
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <common>',
      `#include <common>
      uniform float surfaceContrast;
      uniform vec3 surfaceFallback;`,
    )
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <map_fragment>',
      `#include <map_fragment>
      float surfaceLuma = dot(diffuseColor.rgb, vec3(0.2126, 0.7152, 0.0722));
      float noDataMask = 1.0 - smoothstep(0.004, 0.035, surfaceLuma);
      diffuseColor.rgb = mix(diffuseColor.rgb, surfaceFallback * 0.38, noDataMask);
      diffuseColor.rgb = clamp((diffuseColor.rgb - 0.5) * surfaceContrast + 0.5, 0.0, 1.0);`,
    )
  }, [body.visual.baseColor, treatment.contrast])

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
        color={treatment.tint ?? '#ffffff'}
        roughness={body.type === 'moon' ? 0.94 : 0.82}
        emissive={body.visual.baseColor}
        emissiveIntensity={body.type === 'moon' ? 0.16 : 0.08}
        onBeforeCompile={enhanceMappedMaterial}
      />
      {treatment.atmosphereColor && (
        <mesh scale={1.025}>
          <sphereGeometry args={[radius, 48, 32]} />
          <meshStandardMaterial
            color={treatment.atmosphereColor}
            transparent
            opacity={0.16}
            roughness={1}
            depthWrite={false}
          />
        </mesh>
      )}
    </mesh>
  )
}

function OfficialModelSurface({ radius, treatment }) {
  const { scene } = useGLTF(treatment.model)
  const normalizedModel = useMemo(() => {
    const object = scene.clone(true)
    const bounds = new Box3().setFromObject(object)
    const center = bounds.getCenter(new Vector3())
    const size = bounds.getSize(new Vector3())
    object.position.sub(center)

    return {
      object,
      scale: (radius * 2) / Math.max(size.x, size.y, size.z),
    }
  }, [radius, scene])

  return (
    <primitive
      object={normalizedModel.object}
      scale={normalizedModel.scale}
      rotation={[0, -0.35, 0]}
    />
  )
}

function ObservedPhotoSurface({ body, radius, bodyScale, treatment }) {
  const texture = useTexture(treatment.photo)
  useEffect(() => {
    texture.colorSpace = SRGBColorSpace
    texture.repeat.set(...treatment.repeat)
    texture.offset.set(...treatment.offset)
    texture.needsUpdate = true
  }, [texture, treatment.offset, treatment.repeat])

  return (
    <group scale={bodyScale}>
      <mesh>
        <sphereGeometry args={[radius, 32, 20]} />
        <meshStandardMaterial
          color={body.visual.baseColor}
          roughness={0.98}
          emissive={body.visual.baseColor}
          emissiveIntensity={0.08}
        />
      </mesh>
      <sprite scale={[radius * 2.15 * treatment.aspect, radius * 2.15, 1]} renderOrder={3}>
        <spriteMaterial
          map={texture}
          transparent
          opacity={0.9}
          blending={AdditiveBlending}
          depthTest={false}
          depthWrite={false}
          toneMapped={false}
        />
      </sprite>
    </group>
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
  const bodyScale = body.id === 'haumea' && surfaceTreatment.kind !== 'official-model'
    ? [1.35, 0.74, 0.82]
    : [1, 1, 1]
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

      {body.id !== 'sun' && surfaceTreatment.kind === 'observed-map' ? (
        <ObservedSurface body={body} radius={radius} bodyScale={bodyScale} treatment={surfaceTreatment} />
      ) : body.id !== 'sun' && surfaceTreatment.kind === 'official-model' ? (
        <OfficialModelSurface radius={radius} treatment={surfaceTreatment} />
      ) : body.id !== 'sun' && surfaceTreatment.kind === 'observed-photo' ? (
        <ObservedPhotoSurface body={body} radius={radius} bodyScale={bodyScale} treatment={surfaceTreatment} />
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
