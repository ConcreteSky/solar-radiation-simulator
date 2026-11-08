import { useCallback, useMemo, useState } from 'react'
import SolarSystemScene from './components/SolarSystem/SolarSystemScene.jsx'
import ResultPanel from './components/ResultPanel/ResultPanel.jsx'
import SimulationControls from './components/SimulationControls/SimulationControls.jsx'
import { celestialBodies, sun } from './data/catalog.js'
import useSimulationClock from './hooks/useSimulationClock.js'

const SESSION_START_MS = Date.now()

export default function App() {
  const [selectedBodyId, setSelectedBodyId] = useState(null)
  const [analysisTimestampMs, setAnalysisTimestampMs] = useState(SESSION_START_MS)
  const [resetViewSignal, setResetViewSignal] = useState(0)
  const simulation = useSimulationClock(SESSION_START_MS)

  const selectedBody = useMemo(
    () => [sun, ...celestialBodies].find((body) => body.id === selectedBodyId) ?? null,
    [selectedBodyId],
  )

  const selectBody = useCallback((bodyId) => {
    setSelectedBodyId(bodyId)
    if (bodyId) {
      setAnalysisTimestampMs(simulation.getTimestampMs())
    }
  }, [simulation.getTimestampMs])

  const togglePlaying = useCallback(() => {
    if (simulation.playing && selectedBodyId && selectedBodyId !== 'sun') {
      setAnalysisTimestampMs(simulation.getTimestampMs())
    }
    simulation.setPlaying(!simulation.playing)
  }, [selectedBodyId, simulation.getTimestampMs, simulation.playing, simulation.setPlaying])

  return (
    <main className="app-shell" data-selected-body-id={selectedBodyId === 'sun' ? '' : selectedBodyId ?? ''}>
      <section className="map-section">
        <header className="app-header">
          <div className="brand-block">
            <span className="brand-mark" aria-hidden="true" />
            <div>
              <p>Solar environment laboratory</p>
              <h1>Solar Radiation Simulator</h1>
            </div>
          </div>
          <nav className="viewport-actions" aria-label="Viewport controls">
            <SimulationControls
              playing={simulation.playing}
              onTogglePlaying={togglePlaying}
            />
            <button
              className="reset-view-button"
              type="button"
              onClick={() => {
                setSelectedBodyId(null)
                setResetViewSignal((value) => value + 1)
              }}
            >
              Reset view
            </button>
          </nav>
        </header>

        <div className="scene-shell" aria-label="Interactive 3D Solar System destination map">
          <SolarSystemScene
            bodies={celestialBodies}
            selectedBodyId={selectedBodyId}
            onSelectBody={selectBody}
            resetViewSignal={resetViewSignal}
            getSimulationTimestampMs={simulation.getTimestampMs}
            focusTimestampMs={analysisTimestampMs}
          />
        </div>

        <p className="viewport-hint">Drag to orbit <span /> Scroll to zoom <span /> Select a world to inspect</p>
        {selectedBody && selectedBody.id !== 'sun' && <SceneInspector body={selectedBody} />}
        <p className="map-disclaimer">
          Coplanar Keplerian positions are approximate. Distances and sizes are compressed only for display.
        </p>
      </section>

      <ResultPanel
        body={selectedBody}
        bodies={celestialBodies}
        simulationTimestampMs={analysisTimestampMs}
      />
    </main>
  )
}

function titleCase(value) {
  return value == null ? 'Not established' : String(value).replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function SceneInspector({ body }) {
  const environment = body.solarEnvironment
  const magnetic = environment?.magnetic
  const particle = environment?.particleEnvironment
  return (
    <aside className="scene-inspector" aria-live="polite" aria-label={`${body.name} scene inspector`}>
      <header>
        <p>{titleCase(body.type)}</p>
        <h2>{body.name}</h2>
      </header>
      <dl>
        <div><dt>Magnetic structure</dt><dd>{titleCase(magnetic?.family)}</dd></div>
        <div><dt>Shielding</dt><dd>{titleCase(magnetic?.shielding)}</dd></div>
        <div><dt>Radiation context</dt><dd data-hazard={particle?.radiationLevel === 'extreme' ? 'high' : undefined}>{titleCase(particle?.radiationLevel)}</dd></div>
        <div><dt>Particle exposure</dt><dd>{titleCase(particle?.solarWindExposure)}</dd></div>
      </dl>
      <div className="scene-particle-legend"><i aria-hidden="true" /><span>Neon green pulses show charged solar particles</span></div>
      <p>{environment?.summary}</p>
      <a href="#light-analysis">Open full scientific analysis</a>
    </aside>
  )
}
