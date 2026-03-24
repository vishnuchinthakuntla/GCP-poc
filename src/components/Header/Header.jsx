import React from 'react'
import useAgentStore from '../../stores/useAgentStore'
import './Header.css'

/* ── Header ── */

const Header = ({ onMenuToggle }) => {
  const info = useAgentStore(s => s.header.info)
  const wsConnected = useAgentStore(s => s.wsConnected)

  return (
    <header>
      {/* top nav bar */}
      <div className="header">
        {/* Brand */}
        <div className="header__brand">
          <button className="header__hamburger" onClick={onMenuToggle} aria-label="Toggle menu">
            ☰
          </button>
          <div className="header__logo">
            <div className="header__logo-inner">
              <span className="header__logo-globe">🌐</span>
              <div>
                <div className="header__logo-name">Covalense</div>
                <div className="header__logo-badge">Global</div>
              </div>
            </div>
            <span className="header__logo-tagline">Collaborate. Innovate. Accelerate</span>
          </div>
        </div>

        {/* Title */}
        <div className="header__title-area">
          <div className="header__title">{info.title || 'AUREUS UNITY COMMAND CENTRE'}</div>
          <div className="header__subtitle">
            {info.subtitle || 'Real-time intelligence'}
            <span>·</span>
            {info.agent_count || 7} agents
            <span>·</span>
            Last refresh: {info.last_refresh || '—'}
          </div>
        </div>

        {/* Meta */}
        <div className="header__meta">
          <span className="header__welcome">Welcome, {info.user_name || 'Jayadev Thimmaraju'}</span>
          <span className="header__agent-badge">{info.agent_count || 7} AGENTS</span>
          <span className="header__live-badge">
            {wsConnected && <span className="header__live-dot" />}
            {wsConnected ? 'LIVE' : 'OFFLINE'}
          </span>
        </div>
      </div>
    </header>
  )
}

export default Header