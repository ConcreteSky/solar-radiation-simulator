# Magnetic fields and visual families

The simulator distinguishes physical interaction families instead of drawing one generic ring around every selected body.

| Family | Examples | Selected-body visual |
| --- | --- | --- |
| `intrinsic_dipole` | Mercury, Earth, Jupiter | smooth nested bow-to-tail envelopes with a compressed sunward boundary and an extended magnetotail; Mercury is compact while Jupiter is large and radiation-emphasized |
| `intrinsic_aligned` | Saturn | clean, nearly axis-aligned envelopes with a large but restrained tail |
| `intrinsic_tilted_offset` | Uranus, Neptune | body-specific opposite tilts and different offsets, rather than one reused template |
| `induced` | Venus, Europa, Callisto, Titan | open lines draped around the obstacle and into a downstream wake; no closed intrinsic dipole |
| `crustal_remnant` | Mars, Moon | separated regional arcs with fewer anomalies on the Moon |
| `intrinsic_mini` | Ganymede | compact mini-magnetosphere envelope nested in the local Jovian environment |
| `parent_plasma` | Io and several outer-planet moons | open, sweeping parent-magnetosphere plasma paths without an invented moon dipole |
| `negligible` / `unknown` | small bodies with insufficient evidence | no invented field overlay |

The Three.js overlay is rendered only for the selected body and uses a limited number of shared line geometries. A sparse particle stream approaches from the Sun-facing direction and is deflected according to the selected interaction family. Extreme local particle environments may use the raspberry hazard accent. Visible light is not bent by these fields.

The field sizes are explanatory rather than to scale. Numeric field ranges are shown only when the source catalog supports them. Unknown and negligible cases receive no invented global structure; at most, direct sparse particle flow is shown.

Primary references and exact URLs are mapped in `data/sources.json`, including NASA/NSSDCA planet fact sheets, NASA magnetosphere pages, Mars Global Surveyor results, and mission pages for Europa, Ganymede, and Titan.
