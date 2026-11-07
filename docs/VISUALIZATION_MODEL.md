# Visualization model

The 3D scene uses compressed orbital distances and exaggerated body sizes for navigation. Magnetic overlays are selected-body explanatory schematics, not scale models. They are absent for negligible or unknown fields.

The default camera frames the Sun and four inner planets from slightly above the orbital plane. Outer planets are deliberately discovered through navigation rather than fitting the full system into the opening shot. Selecting a body performs a short damped focus move, emphasizes its orbit, and loads only that body's magnetic/particle overlay.

The normal viewport UI exposes only Play/Pause and Reset View. Internal simulation time remains active at one deliberately slow rate but is not displayed. The 3D scene has no generic atmospheric shell; atmosphere data remains part of the scientific analysis and calculations.

The viewport uses a graphite/violet interface layer (`#090A0C`, `#121419`, `#191C22`, `#7B6ED6`, `#9A8BE0`) while planetary surfaces retain reference-based natural colors. The selected-body scene inspector is separate from—and does not replace or alter—the analytical result area below.

The result area uses a four-panel Solar Interaction Profile:

- A — incoming visible photons and charged particles, with irradiance and steady-input proxy;
- B — a field-family-specific magnetic interaction schematic;
- C — magnetic, atmospheric, combined shielding, and surface exposure;
- D — concise environment metrics and evidence state.

The preserved visible-light subsystem appears below as compact percentage bars and color/size descriptors. The former large Light Diagram component remains in source history but is no longer the active selected-body result view.
