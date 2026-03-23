import React from 'react'

const AgentCard = ({ agent, selected, onClick }) => {
  const { label, count, icon, bg, borderColor, numColor, status = 'idle', active = 0, processed = 0 } = agent

  return (
    <button
      className={`agent-card${selected ? ' agent-card--selected' : ''}`}
      style={{ background: bg, borderColor: selected ? borderColor : 'transparent' }}
      onClick={onClick}
      aria-pressed={selected}
    >
      <span className="agent-card__icon">{icon}</span>
      <div className="agent-card__label">{label}</div>
      <div className="agent-card__count" style={{ color: numColor }}>{count}</div>
      <div className="agent-card__status">
        <span className={`agent-card__status-dot agent-card__status-dot--${status}`} />
        {active > 0 ? `${active} ACTIVE` : processed > 0 ? `${processed} DONE` : 'IDLE'}
      </div>
    </button>
  )
}



export default AgentCard