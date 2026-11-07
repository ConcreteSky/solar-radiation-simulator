import { memo } from 'react'

function SimulationControls({
  playing,
  onTogglePlaying,
}) {
  return (
    <button
      className="playback-toggle"
      type="button"
      aria-pressed={!playing}
      onClick={onTogglePlaying}
    >
      <span className="playback-icon" aria-hidden="true">{playing ? 'Ⅱ' : '▶'}</span>
      {playing ? 'Pause' : 'Play'}
    </button>
  )
}

export default memo(SimulationControls)
