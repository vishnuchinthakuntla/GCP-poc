import React, { useState } from 'react'
import useAgentStore from '../../stores/useAgentStore'
import './ObserverPanel.css'

// ── helpers ───────────────────────────────────────────────────────────────────

function timeAgo(isoString) {
  if (!isoString) return ''
  const seconds = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000)
  if (seconds < 0) return 'just now'
  if (seconds < 60) return `${seconds}s ago`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

// ── RunTile ───────────────────────────────────────────────────────────────────

const severityClass = (s) =>
  `run-tile__severity run-tile__severity--${(s || 'unknown').toLowerCase()}`

const RunTile = ({ item }) => {
  const shortId = item.run_id
    ? item.run_id.length > 14 ? '…' + item.run_id.slice(-12) : item.run_id
    : item.thread_id?.slice(-12) || '—'

  const durationLabel = item.duration_ms != null
    ? item.duration_ms < 1000
      ? `${item.duration_ms}ms`
      : `${(item.duration_ms / 1000).toFixed(1)}s`
    : null

  return (
    <div className="run-tile">
      <div className="run-tile__header">
        <span className="run-tile__run-id" title={item.run_id}>{shortId}</span>
        <span className="run-tile__age">{item.age_label || timeAgo(item.created_at)}</span>
      </div>

      <div className="run-tile__pipeline" title={item.pipeline_name}>
        {item.pipeline_name || '—'}
      </div>

      <div className="run-tile__meta">
        <span className={`run-tile__status-dot run-tile__status-dot--${item.status}`} />
        {item.severity && (
          <span className={severityClass(item.severity)}>{item.severity}</span>
        )}
        {item.event_type && (
          <span style={{ fontSize: 9, color: '#aaa' }}>{item.event_type}</span>
        )}
        {durationLabel && (
          <span className="run-tile__duration">⏱ {durationLabel}</span>
        )}
      </div>

      {item.agent_summary && (
        <div className="run-tile__summary">{item.agent_summary}</div>
      )}
    </div>
  )
}

// ── FeedItem ──────────────────────────────────────────────────────────────────

const FeedItem = ({ item }) => {
  const time = item.timestamp
    ? new Date(item.timestamp).toLocaleTimeString('en-GB', {
        hour: '2-digit', minute: '2-digit', second: '2-digit',
      })
    : ''
  return (
    <div className="feed-item">
      <span className={`feed-item__dot feed-item__dot--${item.level || 'info'}`} />
      <span className="feed-item__text">{item.message}</span>
      <span className="feed-item__time">{time}</span>
    </div>
  )
}

// ── Shimmer ───────────────────────────────────────────────────────────────────

const Shimmer = () => (
  <div className="panel-column__loading">
    {[80, 55, 70, 45, 65].map((w, i) => (
      <div key={i} className="shimmer" style={{ width: `${w}%` }} />
    ))}
  </div>
)

// ── PanelColumn ───────────────────────────────────────────────────────────────

const PanelColumn = ({
  title, count, loading,
  emptyImg, emptyTitle, emptySub,
  children,
}) => (
  <div className="panel-column">
    <div className="panel-column__header">
      <span className="panel-column__title">{title}</span>
      <span className="panel-column__badge">{count}</span>
    </div>

    <div className={`panel-column__body${!loading && !children ? ' panel-column__body--empty' : ''}`}>
      {loading ? (
        <Shimmer />
      ) : children ? (
        children
      ) : (
        <>
          <span className="panel-column__empty-img">{emptyImg}</span>
          <span className="panel-column__empty-title">{emptyTitle}</span>
          <span className="panel-column__empty-sub">{emptySub}</span>
        </>
      )}
    </div>
  </div>
)

// ── ObserverPanel ─────────────────────────────────────────────────────────────

const ObserverPanel = ({
  agentId,
  agentLabel,
  agentIcon,
  isActive = true,
  onClose,
}) => {
  // Read everything from the Zustand store — no local WS, no local fetch
  const panel = useAgentStore(s => s.panel)
  const { queued, inProgress, processed, liveFeed, loading } = panel

  const [activeTab, setActiveTab] = useState('processed')

  return (
    <section className="observer-panel" aria-label={`${agentLabel} panel`}>

      {/* header */}
      <div className="observer-panel__header">
        <span className="observer-panel__icon">{agentIcon}</span>
        <span className="observer-panel__title">{agentLabel}</span>
        <span className={`observer-panel__status observer-panel__status--${isActive ? 'active' : 'inactive'}`}>
          {isActive ? 'ACTIVE' : 'INACTIVE'}
        </span>

        {/* tab switcher for third column */}
        <div style={{ display: 'flex', gap: 6, marginRight: 8 }}>
          {['processed', 'livefeed'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                fontSize: 10, fontWeight: 700, padding: '2px 8px',
                borderRadius: 4, border: '1.5px solid',
                borderColor: activeTab === tab ? '#3b5bdb' : '#dde3f0',
                background: activeTab === tab ? '#eef3ff' : 'transparent',
                color: activeTab === tab ? '#3b5bdb' : '#999',
                cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.5px',
              }}
            >
              {tab === 'processed' ? `Processed ${processed.count}` : 'Live Feed'}
            </button>
          ))}
        </div>

        <button className="observer-panel__close" onClick={onClose} aria-label="Close panel">
          ✕
        </button>
      </div>

      {/* columns */}
      <div className="observer-panel__columns">

        {/* Queued */}
        <PanelColumn
          title="Queued"
          count={queued.count}
          loading={loading}
          emptyImg="📬"
          emptyTitle="Queue is Empty"
          emptySub="No runs waiting for this agent."
        >
          {!loading && queued.items.length > 0
            ? queued.items.map((i, idx) => <RunTile key={i.log_id || idx} item={i} />)
            : null}
        </PanelColumn>

        {/* In Progress */}
        <PanelColumn
          title="In Progress"
          count={inProgress.count}
          loading={loading}
          emptyImg="🤖"
          emptyTitle="Agent is standing by"
          emptySub="No runs being processed right now."
        >
          {!loading && inProgress.items.length > 0
            ? inProgress.items.map((i, idx) => <RunTile key={i.log_id || idx} item={i} />)
            : null}
        </PanelColumn>

        {/* Processed / Live Feed (tab-switched) */}
        {activeTab === 'processed' ? (
          <PanelColumn
            title="Processed"
            count={processed.count}
            loading={loading}
            emptyImg="✅"
            emptyTitle="No runs processed yet"
            emptySub="Completed runs will appear here."
          >
            {!loading && processed.items.length > 0
              ? processed.items.map((i, idx) => <RunTile key={i.log_id || idx} item={i} />)
              : null}
          </PanelColumn>
        ) : (
          <PanelColumn
            title="Live Feed"
            count={liveFeed.count}
            loading={loading}
            emptyImg="📡"
            emptyTitle="No Live Feed Available"
            emptySub="The agent has not reported any recent activity."
          >
            {!loading && liveFeed.items.length > 0
              ? liveFeed.items.map((i, idx) => <FeedItem key={i.event_id || idx} item={i} />)
              : null}
          </PanelColumn>
        )}
      </div>
    </section>
  )
}

export default ObserverPanel