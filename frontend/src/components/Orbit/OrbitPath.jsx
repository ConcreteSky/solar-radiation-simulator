import { Line } from '@react-three/drei'
import { memo, useMemo } from 'react'
import { createEllipsePoints } from '../../utils/sceneScale.js'

function OrbitPath({ radius, eccentricity, moon = false, selected = false }) {
  const points = useMemo(
    () => createEllipsePoints(radius, eccentricity, moon ? 72 : 180),
    [eccentricity, moon, radius],
  )

  return (
    <Line
      points={points}
      color={selected ? '#7b6ed6' : moon ? '#373c48' : '#2a2f36'}
      lineWidth={selected ? 1 : moon ? 0.4 : 0.52}
      transparent
      opacity={selected ? 0.62 : moon ? 0.24 : 0.34}
      position={[0, -0.035, 0]}
    />
  )
}

export default memo(OrbitPath)
