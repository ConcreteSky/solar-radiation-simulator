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
| Io, Europa, Ganymede, and Callisto | Voyager/USGS global mosaics | [Io](https://science.nasa.gov/3d-resources/jupiter-io-a/), [Europa](https://science.nasa.gov/3d-resources/jupiter-europa/), [Ganymede](https://science.nasa.gov/3d-resources/jupiter-ganymede/), and [Callisto](https://science.nasa.gov/3d-resources/jupiter-callisto/); USGS/JPL-Caltech |
| Rhea, Iapetus, and Dione | Voyager global mosaics | [Rhea](https://science.nasa.gov/3d-resources/saturn-rhea/), [Iapetus](https://science.nasa.gov/3d-resources/saturn-iapetus/), and [Dione](https://science.nasa.gov/3d-resources/saturn-dione/); NASA/JPL-Caltech |
| Titania, Oberon, Umbriel, and Ariel | Voyager global mosaics | [Titania](https://science.nasa.gov/3d-resources/uranus-titania/), [Oberon](https://science.nasa.gov/3d-resources/uranus-oberon/), [Umbriel](https://science.nasa.gov/3d-resources/uranus-umbriel/), and [Ariel](https://science.nasa.gov/3d-resources/uranus-ariel/); USGS/JPL-Caltech |
| Triton | Voyager/USGS global mosaic | [NASA 3D Resources](https://science.nasa.gov/3d-resources/neptune-triton/); USGS/JPL-Caltech |
| Ceres | Dawn Framing Camera global mosaic | [USGS Astrogeology](https://astrogeology.usgs.gov/search/map/ceres_dawn_fc_global_mosaic_400m); DLR/NASA/JPL-Caltech/UCLA/MPS/IDA/USGS |
| Pluto | New Horizons LORRI/MVIC global mosaic | [USGS Astrogeology](https://astrogeology.usgs.gov/search/map/pluto_new_horizons_lorri_mvic_global_mosaic_300m); NASA/JHUAPL/SwRI/USGS |

The checked-in copies are web-resolution equirectangular derivatives so the app remains fast and does not make runtime requests to third-party servers. `frontend/src/data/surfaceTextureRegistry.js` is the authoritative body-to-treatment registry.

## Bodies without complete observational maps

Saturn, Uranus, Neptune, and Titan are rendered as smooth atmosphere-colored materials. Eris, Haumea, Makemake, Proteus, Nereid, and Larissa use their catalog color/albedo and known shape where available. This is intentional: complete, trustworthy global surface maps are not available for these bodies, and atmospheric cloud patterns change with time.

NASA's downloadable Saturn, Neptune, Titan, and former Pluto 3D textures are explicitly described on their source pages as fictional or painted reconstructions, so they are not used here. Unknown regions are not filled with synthetic terrain.

## Renderer processing

All photographic mosaics receive the same neutral rendering treatment as Earth: sRGB color management, dense sphere geometry, high roughness, and a low map-based emissive fill so recognizable geography remains readable in the dark viewport. The renderer does not alter map content.
