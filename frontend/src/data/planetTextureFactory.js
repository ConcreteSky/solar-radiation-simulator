import { CanvasTexture, LinearFilter, RepeatWrapping, SRGBColorSpace } from 'three'

const textureCache = new Map()

const PALETTES = {
  mercury: ['#77746f', '#9a968e', '#504f4d'],
  venus: ['#b99053', '#dfc17e', '#80663f'],
  earth: ['#183f68', '#24618a', '#53725a'],
  mars: ['#8e3f2d', '#bd6845', '#4d302c'],
  jupiter: ['#b79876', '#ded0b7', '#765044', '#c7795f'],
  saturn: ['#bca77f', '#d7c8a5', '#87785f'],
  uranus: ['#79a9b0', '#8cb5ba', '#6d9aa1'],
  neptune: ['#244b85', '#3e6daa', '#172d5b'],
  pluto: ['#9d806b', '#d2bca0', '#5f514a'],
  io: ['#c4a33d', '#e1cc73', '#6f5a27'],
  europa: ['#b9b29f', '#ded9c8', '#6c5546'],
  ganymede: ['#756c61', '#a79a82', '#4e4943'],
  callisto: ['#3d3835', '#675f58', '#b0a28d'],
  titan: ['#a8662f', '#d18c46', '#74401f'],
  triton: ['#a8958e', '#cab8ad', '#725f68'],
}

function seededRandom(seedText) {
  let seed = [...seedText].reduce((value, character) => (value * 31 + character.charCodeAt(0)) >>> 0, 2166136261)
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0
    return seed / 4294967296
  }
}

function ellipse(ctx, x, y, rx, ry, color, alpha = 1) {
  ctx.save()
  ctx.globalAlpha = alpha
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

function drawRocky(ctx, width, height, colors, random, craterCount = 75) {
  ctx.fillStyle = colors[0]
  ctx.fillRect(0, 0, width, height)
  for (let index = 0; index < 900; index += 1) {
    ctx.globalAlpha = 0.05 + random() * 0.13
    ctx.fillStyle = colors[1 + (index % (colors.length - 1))]
    const size = 1 + random() * 6
    ctx.fillRect(random() * width, random() * height, size, size)
  }
  ctx.globalAlpha = 1
  for (let index = 0; index < craterCount; index += 1) {
    const radius = 2 + random() * (height * 0.055)
    const x = random() * width
    const y = random() * height
    ellipse(ctx, x, y, radius, radius * 0.45, colors[2], 0.28)
    ellipse(ctx, x - radius * 0.16, y - radius * 0.12, radius * 0.72, radius * 0.3, colors[1], 0.16)
  }
}

function drawTurbulentBands(ctx, width, height, colors, random, bandCount = 18, contrast = 0.72) {
  ctx.fillStyle = colors[0]
  ctx.fillRect(0, 0, width, height)
  const bandHeight = height / bandCount
  for (let band = 0; band < bandCount; band += 1) {
    const center = bandHeight * (band + 0.5)
    const amplitude = bandHeight * (0.18 + random() * 0.28)
    const phase = random() * Math.PI * 2
    const frequency = 1 + Math.floor(random() * 3)
    const halfThickness = bandHeight * (0.34 + random() * 0.2)
    ctx.beginPath()
    for (let step = 0; step <= 48; step += 1) {
      const x = (step / 48) * width
      const wave = Math.sin((step / 48) * Math.PI * 2 * frequency + phase) * amplitude
        + Math.sin((step / 48) * Math.PI * 6 + phase * 0.6) * amplitude * 0.24
      const y = center + wave - halfThickness
      if (step === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    for (let step = 48; step >= 0; step -= 1) {
      const x = (step / 48) * width
      const wave = Math.sin((step / 48) * Math.PI * 2 * frequency + phase) * amplitude
        + Math.sin((step / 48) * Math.PI * 6 + phase * 0.6) * amplitude * 0.24
      ctx.lineTo(x, center + wave + halfThickness)
    }
    ctx.closePath()
    ctx.globalAlpha = contrast * (0.38 + random() * 0.38)
    ctx.fillStyle = colors[1 + (band % (colors.length - 1))]
    ctx.fill()
  }
  ctx.globalAlpha = 1
  for (let index = 0; index < 75; index += 1) {
    ellipse(
      ctx,
      random() * width,
      random() * height,
      width * (0.008 + random() * 0.032),
      height * (0.003 + random() * 0.012),
      colors[index % colors.length],
      0.08 + random() * 0.12,
    )
  }
}

function drawVenusClouds(ctx, width, height, colors, random) {
  const gradient = ctx.createLinearGradient(0, 0, width, height)
  gradient.addColorStop(0, colors[2])
  gradient.addColorStop(0.48, colors[0])
  gradient.addColorStop(1, colors[1])
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)
  ctx.lineCap = 'round'
  for (let index = 0; index < 42; index += 1) {
    const startY = random() * height
    const curve = (random() - 0.5) * height * 0.34
    ctx.beginPath()
    ctx.moveTo(-40, startY)
    ctx.bezierCurveTo(width * 0.22, startY + curve, width * 0.68, startY - curve, width + 40, startY + curve * 0.35)
    ctx.strokeStyle = index % 3 === 0 ? colors[2] : colors[1]
    ctx.lineWidth = 3 + random() * 14
    ctx.globalAlpha = 0.035 + random() * 0.1
    ctx.stroke()
  }
  ctx.globalAlpha = 1
}

function drawIceGiant(ctx, width, height, colors, random, stormy = false) {
  const gradient = ctx.createLinearGradient(0, 0, 0, height)
  gradient.addColorStop(0, colors[2])
  gradient.addColorStop(0.28, colors[0])
  gradient.addColorStop(0.62, colors[1])
  gradient.addColorStop(1, colors[2])
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)
  ctx.lineCap = 'round'
  for (let index = 0; index < (stormy ? 18 : 9); index += 1) {
    const y = height * (0.12 + random() * 0.76)
    ctx.beginPath()
    ctx.moveTo(random() * width * 0.15, y)
    ctx.bezierCurveTo(width * 0.3, y + (random() - 0.5) * 18, width * 0.72, y + (random() - 0.5) * 18, width * (0.85 + random() * 0.15), y)
    ctx.strokeStyle = colors[index % colors.length]
    ctx.lineWidth = 1 + random() * (stormy ? 5 : 3)
    ctx.globalAlpha = 0.05 + random() * 0.1
    ctx.stroke()
  }
  ctx.globalAlpha = 1
  if (stormy) {
    ellipse(ctx, width * 0.68, height * 0.58, width * 0.055, height * 0.027, '#17264b', 0.56)
    ellipse(ctx, width * 0.49, height * 0.36, width * 0.028, height * 0.012, '#7894c8', 0.42)
  }
}

function drawIceCracks(ctx, width, height, colors, random) {
  ctx.fillStyle = colors[1]
  ctx.fillRect(0, 0, width, height)
  ctx.strokeStyle = colors[2]
  ctx.lineWidth = 2
  ctx.globalAlpha = 0.65
  for (let index = 0; index < 34; index += 1) {
    ctx.beginPath()
    let x = random() * width
    let y = random() * height
    ctx.moveTo(x, y)
    for (let segment = 0; segment < 5; segment += 1) {
      x += (random() - 0.45) * 55
      y += (random() - 0.5) * 32
      ctx.lineTo(x, y)
    }
    ctx.stroke()
  }
  ctx.globalAlpha = 1
}

function drawBody(ctx, body, width, height, random) {
  const colors = PALETTES[body.id] ?? [body.visual.baseColor, '#8e8a83', '#3d3b3a']
  switch (body.id) {
    case 'venus': drawVenusClouds(ctx, width, height, colors, random); break
    case 'jupiter':
      drawTurbulentBands(ctx, width, height, colors, random, 7, 0.58)
      ellipse(ctx, width * 0.72, height * 0.67, width * 0.075, height * 0.045, '#a85f50', 0.82)
      break
    case 'saturn': drawTurbulentBands(ctx, width, height, colors, random, 8, 0.18); break
    case 'uranus': drawIceGiant(ctx, width, height, colors, random, false); break
    case 'neptune': drawIceGiant(ctx, width, height, colors, random, true); break
    case 'mars':
      drawRocky(ctx, width, height, colors, random, 28)
      ellipse(ctx, width * 0.58, height * 0.48, width * 0.18, height * 0.08, '#4b302d', 0.5)
      ctx.fillStyle = '#c8b9a4'; ctx.fillRect(0, 0, width, height * 0.026)
      break
    case 'pluto':
      drawRocky(ctx, width, height, colors, random, 22)
      ellipse(ctx, width * 0.58, height * 0.46, width * 0.13, height * 0.2, '#d7c8ae', 0.84)
      ellipse(ctx, width * 0.52, height * 0.38, width * 0.09, height * 0.09, '#ded2ba', 0.84)
      break
    case 'io':
      drawRocky(ctx, width, height, colors, random, 14)
      for (let index = 0; index < 22; index += 1) ellipse(ctx, random() * width, random() * height, 3 + random() * 12, 2 + random() * 6, '#5c3a24', 0.62)
      break
    case 'europa': drawIceCracks(ctx, width, height, colors, random); break
    case 'titan': drawVenusClouds(ctx, width, height, colors, random); break
    default: drawRocky(ctx, width, height, colors, random, body.type === 'moon' ? 54 : 36)
  }
}

export function getPlanetTexture(body) {
  if (body.id === 'sun' || typeof document === 'undefined' || navigator.userAgent.includes('jsdom')) return null
  if (textureCache.has(body.id)) return textureCache.get(body.id)
  const canvas = document.createElement('canvas')
  canvas.width = body.type === 'moon' ? 512 : 1024
  canvas.height = canvas.width / 2
  const ctx = canvas.getContext('2d')
  if (!ctx) return null
  drawBody(ctx, body, canvas.width, canvas.height, seededRandom(body.id))
  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  texture.wrapS = RepeatWrapping
  texture.minFilter = LinearFilter
  texture.magFilter = LinearFilter
  texture.needsUpdate = true
  textureCache.set(body.id, texture)
  return texture
}
