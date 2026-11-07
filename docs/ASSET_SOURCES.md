# Visual asset sources and processing

Earth uses NASA's real equirectangular Blue Marble mosaic from `frontend/src/assets/textures/earth-blue-marble.png`. Other planet and moon surfaces are generated at runtime by `frontend/src/data/planetTextureFactory.js`. The renderer no longer ships or reuses the former flat project SVGs.

## Scientific appearance references

- NASA/GSFC Scientific Visualization Studio, [Blue Marble — A Seamless Image Mosaic of the Earth](https://svs.gsfc.nasa.gov/2915): the 2048×1024 MODIS-derived global map used directly for Earth. Credit: NASA/GSFC; Blue Marble data courtesy of Reto Stöckli, NASA/GSFC and NASA Earth Observatory.
- NASA/JPL, [Solar System Montage — High Resolution 2001 Version](https://science.nasa.gov/photojournal/solar-system-montage-high-resolution-2001-version/): mission-observed color and large-scale appearance for Mercury, Venus, the Moon, Mars, Jupiter, Saturn, Uranus, and Neptune.
- NASA Science, [Our Solar System Images](https://science.nasa.gov/gallery/our-solar-system-images/): mission imagery used to check recognizable surface, cloud-band, ring, and color characteristics.
- NASA/ESA Hubble OPAL, [Hubble's Decade-Long Views of the Outer Solar System Planets](https://science.nasa.gov/asset/hubble/hubbles-decade-long-views-of-the-outer-solar-system-planets/): current reference for the banding, storms, and restrained enhanced-color appearance of the giant planets.
- NASA/JPL, [The New Solar System](https://science.nasa.gov/photojournal/the-new-solar-system/): cross-body reference for the Galilean moons and major planets.

## Processing and art direction

For Earth, the app applies sRGB color management, neutral tone control, material roughness, and a low map-based emissive fill to the NASA texture so geography remains readable on the night side. It does not invent or redraw continents.

For other bodies, the app constructs equirectangular `CanvasTexture` maps from deterministic drawing instructions. The process uses reference-based natural palettes and recognizable large-scale features, then applies controlled contrast and material roughness in Three.js:

- Mars and Mercury: multi-scale albedo noise, impact structures, dark terrain, and a Martian polar cap.
- Jupiter and Saturn: nonuniform atmospheric banding; Jupiter includes a restrained Great Red Spot analogue.
- Uranus and Neptune: subtle atmospheric bands rather than flat single-color spheres; Neptune includes a dark storm feature.
- Pluto: high-contrast surface variation and a bright Tombaugh Regio-inspired region.
- Io, Europa, Ganymede, Callisto, Titan, Triton, and smaller moons: family-specific volcanic, fractured-ice, haze, or cratered treatments.

These textures are visual interpretation, not cartographic products and never enter scientific calculations. Natural planet colors are intentionally independent of the graphite/violet interface palette.
