import React, { useState } from 'react';
import './TicketsTable.css';
import useAgentStore from '../../stores/useAgentStore';

function TicketsTable({ onOpenDrawer }) {
    const tickets = Array.from(useAgentStore(s => s.header.tickets))
    const [activeFilter, setActiveFilter] = useState('all');

    const filtered = activeFilter === 'all' ? tickets
        : activeFilter === 'SLA' ? tickets.filter((t) => t.slABreach === 'YES')
            : activeFilter === 'HUMAN' ? tickets.filter((t) => t.ticketType === 1)
                : activeFilter === 'SH' ? tickets.filter((t) => t.ticketType === 2)
                    : tickets.filter((t) => t.prio === activeFilter);

    function handleFilter(f) {
        setActiveFilter(f);
    }

    const filters = [
        { key: 'all', label: 'ALL' }, { key: 'P1', label: 'P1' }, { key: 'P2', label: 'P2' },
        { key: 'P3', label: 'P3' }, { key: 'P4', label: 'P4' }, { key: 'SLA', label: 'SLA BREACH' },
        { key: 'HUMAN', label: 'HUMAN' }, { key: 'SH', label: 'SELF-HEALING' },
    ];

    return (
        <div className="tickets-section">
            <div className="tickets-section-header">
                <div className="tickets-section-title">OPEN TICKETS</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div className="tickets-filters">
                        {filters.map((f) => (
                            <button key={f.key} className={`tf-btn${activeFilter === f.key ? ' active' : ''}`} onClick={() => handleFilter(f.key)}>
                                {f.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            <div className="tickets-table-wrap">
                <table className="tickets-table">
                    <thead>
                        <tr>
                            <th>TICKET ID</th><th>PIPELINE</th><th>SOURCE</th><th>DOMAIN</th>
                            <th>PRIORITY</th><th>STATUS</th><th>AGE</th><th>OWNER</th><th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr className="no-data">
                                <td colSpan={9} style={{ textAlign: 'center', padding: 12, color: '#0c58b7' }}>
                                    No open tickets at the moment
                                </td>
                            </tr>
                        ) : filtered.map((t, i) => {
                            const globalIdx = tickets.indexOf(t);
                            return (
                                <tr key={t.id + i} className={`tr-${t.prio.toLowerCase()}`} onClick={() => onOpenDrawer(globalIdx)}
                                    style={{ animation: `feed-in .3s ${i * 0.04}s ease both` }}>
                                    <td><span className="t-id">{t.adoTicketId}</span></td>
                                    <td><div className="t-name">{t.name}</div></td>
                                    <td><span className="t-owner">{t.source}</span></td>
                                    <td><span className="t-owner">{t.domain}</span></td>
                                    <td><span className={`t-prio ${t.prio.toLowerCase()}`}>{t.prio}</span></td>
                                    <td><span className={`t-status ${STATUS_CLS[t.status] || 'ts-open'}`}>{t.status}</span></td>
                                    <td><span className={`t-age ${t.ageCls}`}>{t.age}</span></td>
                                    <td><span className="t-owner">{t.owner}</span></td>
                                    <td><span className="t-chevron">›</span></td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default React.memo(TicketsTable);