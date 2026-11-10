# Visual asset sources and scientific treatment

The 3D viewport uses local, mission-derived global mosaics whenever a trustworthy map exists. Surface images are display assets only and never enter the simulator's calculations. The app does not generate procedural craters, stripes, continents, storms, or other fictional terrain.

## Global surface maps used in the viewport

| Bodies | Mission or product | Source and credit |
| --- | --- | --- |
| Earth | MODIS Blue Marble | [NASA/GSFC Scientific Visualization Studio](https://svs.gsfc.nasa.gov/2915); NASA/GSFC and NASA Earth Observatory |
| Mercury | MESSENGER MDIS global basemap | [USGS Astrogeology](https://astrogeology.usgs.gov/search/map/mercury_messenger_mdis_nac_global_mosaic_1km); NASA/JHUAPL/Carnegie/USGS |
| Venus | Magellan radar global mosaic | [NASA 3D Resources](https://science.nasa.gov/3d-resources/venus/); NASA/JPL-Caltech |
| Moon | LRO LROC WAC global morphology mosaic | [USGS Astrogeology](https://astrogeology.usgs.gov/search/map/moon_lro_lroc_wac_global_morphology_mosaic_100m); NASA/GSFC/ASU/USGS |
| Mars | Viking global mosaic | [NASA 3D Resources](https://science.nasa.gov/3d-resources/mars/); NASA/JPL-Caltech/USGS |
| Phobos and Deimos | Viking global mosaics | [Phobos](https://science.nasa.gov/3d-resources/mars-phobos/) and [Deimos](https://science.nasa.gov/3d-resources/mars-deimos/); NASA/JPL-Caltech |
| Jupiter | Voyager global mosaic | [NASA 3D Resources](https://science.nasa.gov/3d-resources/jupiter/); NASA/JPL-Caltech |
| Saturn | NASA atmospheric visualization map | [NASA Saturn 3D model](https://science.nasa.gov/resource/saturn-3d-model/); NASA Visualization Technology Applications and Development |
| Uranus and Neptune | NASA atmospheric visualization-model maps | [Uranus](https://science.nasa.gov/resource/uranus-3d-model/) and [Neptune](https://science.nasa.gov/resource/neptune-3d-model/); NASA Visualization Technology Applications and Development |
| Io, Europa, Ganymede, and Callisto | Voyager/USGS global mosaics | [Io](https://science.nasa.gov/3d-resources/jupiter-io-a/), [Europa](https://science.nasa.gov/3d-resources/jupiter-europa/), [Ganymede](https://science.nasa.gov/3d-resources/jupiter-ganymede/), and [Callisto](https://science.nasa.gov/3d-resources/jupiter-callisto/); USGS/JPL-Caltech |
| Titan | Cassini ISS 938 nm global mosaic | [NASA/JPL Titan Mosaic: The Surface Under the Haze](https://science.nasa.gov/resource/titan-mosaic-the-surface-under-the-haze/); NASA/JPL-Caltech/University of Arizona |
| Rhea, Iapetus, and Dione | Voyager global mosaics | [Rhea](https://science.nasa.gov/3d-resources/saturn-rhea/), [Iapetus](https://science.nasa.gov/3d-resources/saturn-iapetus/), and [Dione](https://science.nasa.gov/3d-resources/saturn-dione/); NASA/JPL-Caltech |
| Titania, Oberon, Umbriel, and Ariel | Voyager global mosaics | [Titania](https://science.nasa.gov/3d-resources/uranus-titania/), [Oberon](https://science.nasa.gov/3d-resources/uranus-oberon/), [Umbriel](https://science.nasa.gov/3d-resources/uranus-umbriel/), and [Ariel](https://science.nasa.gov/3d-resources/uranus-ariel/); USGS/JPL-Caltech |
| Triton | Voyager/USGS global mosaic | [NASA 3D Resources](https://science.nasa.gov/3d-resources/neptune-triton/); USGS/JPL-Caltech |
| Ceres | Dawn Framing Camera global mosaic | [USGS Astrogeology](https://astrogeology.usgs.gov/search/map/ceres_dawn_fc_global_mosaic_400m); DLR/NASA/JPL-Caltech/UCLA/MPS/IDA/USGS |
| Pluto | New Horizons LORRI/MVIC global mosaic | [USGS Astrogeology](https://astrogeology.usgs.gov/search/map/pluto_new_horizons_lorri_mvic_global_mosaic_300m); NASA/JHUAPL/SwRI/USGS |
| Eris, Haumea, and Makemake | NASA scientific visualization models | [Eris](https://science.nasa.gov/resource/eris-3d-model/), [Haumea](https://science.nasa.gov/resource/haumea-3d-model/), and [Makemake](https://science.nasa.gov/resource/makemake-3d-model/); NASA Visualization Technology Applications and Development |
| Proteus, Nereid, and Larissa | Voyager 2 encounter photographs | [Proteus](https://science.nasa.gov/neptune/moons/proteus/), [Nereid](https://science.nasa.gov/photojournal/nereid/), and [Larissa](https://science.nasa.gov/neptune/moons/larissa/); NASA/JPL |

The checked-in copies are web-resolution equirectangular derivatives so the app remains fast and does not make runtime requests to third-party servers. `frontend/src/data/surfaceTextureRegistry.js` is the authoritative body-to-treatment registry.

## Incomplete coverage and reconstructions

Saturn, Uranus, and Neptune do not have fixed solid surfaces. Their maps are NASA visualization products based on observed atmospheric appearance, not claims of permanent geography. Eris, Haumea, and Makemake have not been resolved well enough for measured global surface maps, so the viewport uses NASA's official scientific visualization models and preserves Haumea's measured elongated shape.

Proteus, Nereid, and Larissa have only sparse Voyager coverage. The viewport displays their real encounter photographs over measured-color body shapes instead of pretending that a complete map exists.

## Renderer processing

All photographic mosaics receive sRGB color management, dense sphere geometry, high roughness, and restrained illumination. Exact-black no-data pixels in partial mission mosaics are filled with the body's measured catalog color, preventing unmapped regions from becoming featureless black holes while leaving photographed terrain intact. Bright icy maps retain directional shading and contrast rather than using the former map-wide emissive wash.
