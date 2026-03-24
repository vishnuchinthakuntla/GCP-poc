import React, { useEffect } from "react";
import useAgentStore from "../../stores/useAgentStore";

export const STATUS_CLS = {
    'CRITICAL': 'ts-critical',
    'HIGH': 'ts-high',
    'MEDIUM': 'ts-medium',
    'LOW': 'ts-low',
    'OPEN': 'ts-open',
    'IN PROGRESS': 'ts-inprogress',
    'PENDING': 'ts-pending',
};

export default function TicketDrawer() {
    const ticket = useAgentStore(s => s.selectedTicket)
    const closeTicketDrawer = useAgentStore(s => s.closeTicketDrawer)

    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape' && ticket) closeTicketDrawer(); };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [ticket, closeTicketDrawer]);


    if (!ticket) return null;



    let rcaDetails = null;
    try { rcaDetails = JSON.parse(JSON.parse(ticket.rcaCause)); } catch { try { rcaDetails = JSON.parse(ticket.rcaCause); } catch { /* ignore */ } }

    return (
        <>
            <div className={`ticket-drawer-overlay${ticket ? ' open' : ''}`} onClick={closeTicketDrawer}></div>
            <div className={`ticket-drawer${ticket ? ' open' : ''}`}>
                <div className="td-header">
                    <div className="td-header-id">{ticket.id}</div>
                    <div className="td-header-title">{ticket.name}</div>
                    <div className="td-close" onClick={closeTicketDrawer}>✕</div>
                </div>
                <div className="td-body">
                    <div className="td-hero">
                        <span className={`td-prio-badge tdp-${ticket.prio.toLowerCase()}`}>{ticket.prio}</span>
                        <div className="td-hero-info">
                            <div className="td-hero-name">{ticket.name}</div>
                            <div className="td-hero-desc">{ticket.desc}</div>
                        </div>
                    </div>
                    <div>
                        <div className="td-section-title">Ticket Details</div>
                        <div className="td-grid">
                            <div className="td-field"><div className="td-field-label">Status</div><div className="td-field-val"><span className={`t-status ${STATUS_CLS[ticket.status] || 'ts-open'}`}>{ticket.status}</span></div></div>
                            <div className="td-field"><div className="td-field-label">Owner</div><div className="td-field-val" style={{ fontSize: 13 }}>{ticket.owner}</div></div>
                            <div className="td-field"><div className="td-field-label">Age</div><div className="td-field-val" style={{ color: ticket.ageCls === 'crit' ? '#f43f5e' : ticket.ageCls === 'warn' ? '#f59e0b' : 'var(--text-sub)' }}>{ticket.age}</div></div>
                            <div className="td-field"><div className="td-field-label">SLA</div><div className="td-field-val" style={{ color: ticket.sla === 'BREACHED' ? '#f43f5e' : ticket.sla === 'AT RISK' ? '#f59e0b' : '#10b981', fontWeight: ticket.sla === 'BREACHED' ? 800 : 700 }}>{ticket.sla}</div></div>
                            {rcaDetails && (
                                <>
                                    <div className="td-field" style={{ gridColumn: '1/-1' }}>
                                        <div className="td-field-label">Root Cause</div>
                                        <div className="td-field-val" style={{ fontSize: 12, whiteSpace: 'normal' }}>{rcaDetails.rootCause}</div>
                                    </div>
                                    <div className="td-field" style={{ gridColumn: '1/-1' }}>
                                        <div className="td-field-label">RCA Details</div>
                                        <div className="td-field-val" style={{ fontSize: 12, whiteSpace: 'normal', maxHeight: 160, overflowY: 'auto', paddingRight: 6 }}>
                                            <p><strong>Pipeline:</strong> {rcaDetails.pipelineName}</p>
                                            <p><strong>Classification:</strong> {rcaDetails.classification}</p>
                                            <p><strong>Severity:</strong> {rcaDetails.severity}</p>
                                            <p><strong>Category:</strong> {rcaDetails.rootCauseCategory}</p>
                                            <p><strong>Confidence:</strong> {rcaDetails.confidence}</p>
                                            {rcaDetails.immediateRecommendations && (
                                                <div><strong>Immediate Recommendations:</strong>
                                                    <ul>{rcaDetails.immediateRecommendations.map((r, i) => <li key={i}>{r}</li>)}</ul>
                                                </div>
                                            )}
                                            {rcaDetails.preventiveRecommendations && (
                                                <div><strong>Preventive Recommendations:</strong>
                                                    <ul>{rcaDetails.preventiveRecommendations.map((r, i) => <li key={i}>{r}</li>)}</ul>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                            <div className="live-log">
                                <div className="live-log-header">
                                    <div className="live-log-title td-field-label">Live Log</div>
                                    {/* <div className="live-log-actions">
                                        <button className="live-log-action-btn">Clear</button>
                                        <button className="live-log-action-btn">Copy</button>
                                    </div> */}
                                </div>
                                <div className="live-log-body">
                                    <div className="live-log-entry">
                                        <div className="live-log-entry-timestamp">2022-01-01 12:00:00</div>
                                        <div className="live-log-entry-message">Log message</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button className="td-action-btn" onClick={() => window.open(``, '_blank')}>
                        VIEW TICKET
                    </button>
                </div>
            </div>
        </>
    );
}