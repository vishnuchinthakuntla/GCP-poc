import React, { useState } from 'react';
import './TicketsTable.css';
import useAgentStore from '../../stores/useAgentStore';
import { STATUS_CLS } from './TicketsDrawer';

/** What `transformTicketData(sampleTicketRawData)` would produce. */
const sampleTransformedTickets = [
    {
        id: 'TKT-1001',
        name: 'ETL_Sales_Daily',
        desc: 'ETL_Sales_Daily pipeline alert triggered. Investigation in progress.',
        prio: 'P1',
        status: 'CRITICAL',
        age: '2h 15m',
        ageCls: 'crit',
        domain: 'Sales',
        source: 'ADF',
        owner: 'John',
        pipeline: 'ETL_Sales_Daily',
        sla: 'BREACHED',
        rcaCause: 'Source database timeout during extraction phase',
        adoTicketId: 'ADO-5501',
        slABreach: 'YES',
        ticketType: 1,
    },
    {
        id: 'TKT-1002',
        name: 'DQ_Finance_Check',
        desc: 'DQ_Finance_Check pipeline alert triggered. Investigation in progress.',
        prio: 'P2',
        status: 'IN PROGRESS',
        age: '1h 30m',
        ageCls: 'warn',
        domain: 'Finance',
        source: 'Databricks',
        owner: 'Jane',
        pipeline: 'DQ_Finance_Check',
        sla: 'OK',
        rcaCause: 'Schema drift detected in upstream table',
        adoTicketId: 'ADO-5502',
        slABreach: 'NO',
        ticketType: 0,
    },
    {
        id: 'TKT-1003',
        name: 'Ingest_Marketing_Events',
        desc: 'Ingest_Marketing_Events pipeline alert triggered. Investigation in progress.',
        prio: 'P3',
        status: 'PENDING',
        age: '0h 45m',
        ageCls: 'ok',
        domain: 'Marketing',
        source: 'ADF',
        owner: 'Alice',
        pipeline: 'Ingest_Marketing_Events',
        sla: 'OK',
        rcaCause: 'Delayed API response from third-party provider',
        adoTicketId: 'ADO-5503',
        slABreach: 'NO',
        ticketType: 0,
    },
    {
        id: 'TKT-1004',
        name: 'Sync_HR_Records',
        desc: 'Sync_HR_Records pipeline alert triggered. Investigation in progress.',
        prio: 'P4',
        status: 'OPEN',
        age: '0h 10m',
        ageCls: 'ok',
        domain: 'HR',
        source: 'Synapse',
        owner: 'Bob',
        pipeline: 'Sync_HR_Records',
        sla: 'OK',
        rcaCause: 'Incremental watermark mismatch',
        adoTicketId: 'ADO-5504',
        slABreach: 'NO',
        ticketType: 0,
    },
    {
        id: 'TKT-1005',
        name: 'ETL_Inventory_Refresh',
        desc: 'ETL_Inventory_Refresh pipeline alert triggered. Investigation in progress.',
        prio: 'P1',
        status: 'CRITICAL',
        age: '3h 5m',
        ageCls: 'crit',
        domain: 'Supply Chain',
        source: 'ADF',
        owner: 'Charlie',
        pipeline: 'ETL_Inventory_Refresh',
        sla: 'BREACHED',
        rcaCause: 'Partition skew causing OOM in Spark cluster',
        adoTicketId: 'ADO-5505',
        slABreach: 'YES',
        ticketType: 1,
    },
    {
        id: 'TKT-1006',
        name: 'Report_Customer360',
        desc: 'Report_Customer360 pipeline alert triggered. Investigation in progress.',
        prio: 'P2',
        status: 'IN PROGRESS',
        age: '1h 0m',
        ageCls: 'warn',
        domain: 'Customer',
        source: 'PowerBI',
        owner: 'Diana',
        pipeline: 'Report_Customer360',
        sla: 'OK',
        rcaCause: 'Data refresh token expired for linked service',
        adoTicketId: 'ADO-5506',
        slABreach: 'NO',
        ticketType: 0,
    },
];

function TicketsTable() {
    const tickets = sampleTransformedTickets //Array.from(useAgentStore(s => s.header.tickets))
    const [activeFilter, setActiveFilter] = useState('all');
    const onOpenDrawer = useAgentStore(s => s.openTicketDrawer)

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
                            // const globalIdx = tickets.indexOf(t);
                            return (
                                <tr key={t.id + i} className={`tr-${t.prio.toLowerCase()}`} style={{ animation: `feed-in .3s ${i * 0.04}s ease both` }}>
                                    <td onClick={() => onOpenDrawer(t)}><span className="t-id">{t.adoTicketId}</span></td>
                                    <td onClick={() => onOpenDrawer(t)}><div className="t-name">{t.name}</div></td>
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