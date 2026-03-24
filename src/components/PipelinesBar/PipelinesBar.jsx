import React from 'react'
import useAgentStore from '../../stores/useAgentStore'
import './PipelinesBar.css'

/* ── sub-components ── */

const TicketBadge = ({ label, count, border_color, num_color }) => (
    <span className="ticket-badge" style={{ borderColor: border_color }}>
        <span className="ticket-badge__label">{label}</span>
        <span className="ticket-badge__count" style={{ color: num_color }}>{count}</span>
    </span>
)

const StatBox = ({ value, label, color }) => (
    <div className="stat-box">
        <div className="stat-box__value" style={{ color }}>{value}</div>
        <div className="stat-box__label">{label}</div>
    </div>
)

/* ── Transform store data → component shape ── */

function buildTicketBadges(tickets) {
    return [
        { label: 'P1', count: tickets.P1 ?? 0, border_color: '#e03131', num_color: '#e03131' },
        { label: 'P2', count: tickets.P2 ?? 0, border_color: '#e67700', num_color: '#e67700' },
        { label: 'P3', count: tickets.P3 ?? 0, border_color: '#3b5bdb', num_color: '#3b5bdb' },
        { label: 'P4', count: tickets.P4 ?? 0, border_color: '#868e96', num_color: '#868e96' },
        { label: 'SLA Breach', count: tickets.sla_breach ?? 0, border_color: '#e03131', num_color: '#e03131' },
        { label: 'Human', count: tickets.human ?? 0, border_color: '#9c36b5', num_color: '#9c36b5' },
    ]
}

function PipelinesBar() {

    const tickets = useAgentStore(s => s.header.tickets)
    const pipeline = useAgentStore(s => s.header.pipeline)
    const info = useAgentStore(s => s.header.info)

    const ticketBadges = buildTicketBadges(tickets)

    return (
        <>
            {/* tickets + pipeline bar */}
            <div className="header__tickets-bar">
                <span className="header__tickets-label">Tickets</span>

                <div className="header__tickets-list">
                    {ticketBadges.map(t => <TicketBadge key={t.label} {...t} />)}
                </div>

                <div className="header__pipeline">
                    <div className="header__pipeline-label">
                        <div className="header__pipeline-date">{info.date || ''}</div>
                        <div className="header__pipeline-title">Pipeline Run Summary</div>
                    </div>
                    <div className="header__pipeline-divider" />
                    <StatBox value={pipeline.succeeded ?? 0} label="Completed" color="#2f9e44" />
                    <div className="header__pipeline-divider" />
                    <StatBox value={pipeline.total ?? 0} label="Total" color="#1a3a8f" />
                    <div className="header__pipeline-divider" />
                    <StatBox value={pipeline.remaining ?? 0} label="Remaining" color="#e67700" />
                </div>
            </div>
        </>
    )
}

export default PipelinesBar
