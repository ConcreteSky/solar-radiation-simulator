# Magnetic fields and visual families

The simulator distinguishes physical interaction families instead of drawing one generic ring around every selected body.

| Family | Examples | Selected-body visual |
| --- | --- | --- |
| `intrinsic_dipole` | Mercury, Earth, Jupiter | smooth nested bow-to-tail envelopes with a compressed sunward boundary and an extended magnetotail; Mercury is compact while Jupiter is large and radiation-emphasized |
| `intrinsic_aligned` | Saturn | clean, nearly axis-aligned envelopes with a large but restrained tail |
| `intrinsic_tilted_offset` | Uranus, Neptune | opposite axial tilts, asymmetric flanks, and different tail pinches rather than one reused template |
| `induced` | Venus, Europa, Callisto, Titan | body-specific draped envelopes with fewer shells and restrained opacity; no claimed intrinsic dipole |
| `crustal_remnant` | Mars, Moon | only two faint, compact shells with distinct short-tail shapes, signaling weak regional influence rather than a global dipole |
| `intrinsic_mini` | Ganymede | compact mini-magnetosphere envelope nested in the local Jovian environment |
| `parent_plasma` | Io and several outer-planet moons | individually tilted, faint parent-plasma envelopes without an invented moon dipole |
| `negligible` / `unknown` | small bodies with insufficient evidence | no invented field overlay |

The Three.js overlay is rendered only for the selected body. Every supported body has a reviewed visual profile that independently controls shell count, sunward compression, tail length and pinch, vertical extent, tilt, asymmetry, and opacity rather than inheriting one family-wide silhouette. Visible light is not bent by these fields.

Larger neon-green heads and short directional trails represent charged solar-wind particles approaching from the Sun-facing direction. The color, size, motion, and explicit viewport legend keep them visually separate from neutral stars and asteroid-belt debris.

The field sizes are explanatory rather than to scale. Numeric field ranges are shown only when the source catalog supports them. Unknown and negligible cases receive no invented global structure; at most, direct sparse particle flow is shown.

Primary references and exact URLs are mapped in `data/sources.json`, including NASA/NSSDCA planet fact sheets, NASA magnetosphere pages, Mars Global Surveyor results, and mission pages for Europa, Ganymede, and Titan.
