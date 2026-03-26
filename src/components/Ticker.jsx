import React from 'react';
import { formatElapsedTime } from '../utils';
import './Ticker.css';

export const sampleTicketRawData = [
    {
        ticketId: 'TKT-1001',
        pipelineName: 'ETL_Sales_Daily',
        pipelineType: 'ADF',
        domain: 'Sales',
        priority: 'P1',
        status: 'CRITICAL',
        elapsedTime: '2 hrs 15 mins',
        assignedTo: 'john.doe@company.com',
        slA_Breach: 'YES',
        rootcause: 'Source database timeout during extraction phase',
        adoTicketNo: 'ADO-5501',
        ticketType: 1,
        duration: '00:00:00'
    },
    {
        ticketId: 'TKT-1002',
        pipelineName: 'DQ_Finance_Check',
        pipelineType: 'Databricks',
        domain: 'Finance',
        priority: 'P2',
        status: 'IN PROGRESS',
        elapsedTime: '1 hrs 30 mins',
        assignedTo: 'jane.smith@company.com',
        slA_Breach: 'NO',
        rootcause: 'Schema drift detected in upstream table',
        adoTicketNo: 'ADO-5502',
        ticketType: 0,
        duration: '00:00:00'
    },
    {
        ticketId: 'TKT-1003',
        pipelineName: 'Ingest_Marketing_Events',
        pipelineType: 'ADF',
        domain: 'Marketing',
        priority: 'P3',
        status: 'PENDING',
        elapsedTime: '0 hrs 45 mins',
        assignedTo: 'alice.wonder@company.com',
        slA_Breach: 'NO',
        rootcause: 'Delayed API response from third-party provider',
        adoTicketNo: 'ADO-5503',
        ticketType: 0,
        duration: '00:00:00'
    },
    {
        ticketId: 'TKT-1004',
        pipelineName: 'Sync_HR_Records',
        pipelineType: 'Synapse',
        domain: 'HR',
        priority: 'P4',
        status: 'To Do',
        elapsedTime: '0 hrs 10 mins',
        assignedTo: 'bob.martin@company.com',
        slA_Breach: 'NO',
        rootcause: 'Incremental watermark mismatch',
        adoTicketNo: 'ADO-5504',
        ticketType: 0,
        duration: '00:00:00'
    },
    {
        ticketId: 'TKT-1005',
        pipelineName: 'ETL_Inventory_Refresh',
        pipelineType: 'ADF',
        domain: 'Supply Chain',
        priority: 'P1',
        status: 'CRITICAL',
        elapsedTime: '3 hrs 5 mins',
        assignedTo: 'charlie.kumar@company.com',
        slA_Breach: 'YES',
        rootcause: 'Partition skew causing OOM in Spark cluster',
        adoTicketNo: 'ADO-5505',
        ticketType: 1,
        duration: '00:00:00'
    },
    {
        ticketId: 'TKT-1006',
        pipelineName: 'Report_Customer360',
        pipelineType: 'PowerBI',
        domain: 'Customer',
        priority: 'P2',
        status: 'IN PROGRESS',
        elapsedTime: '1 hrs 0 mins',
        assignedTo: 'diana.lee@company.com',
        slA_Breach: 'NO',
        rootcause: 'Data refresh token expired for linked service',
        adoTicketNo: 'ADO-5506',
        ticketType: 0,
        duration: '00:00:00'
    },
];


function Ticker({ tickerTickets = sampleTicketRawData }) {
    if (!tickerTickets || tickerTickets.length === 0) {
        return (
            <div className="ticker-wrap">
                <div className="ticker-scroll-zone">
                    <div className="ticker-inner">
                        <span className="ticker-event" style={{ paddingLeft: 500, color: '#2563eb' }}>
                            No Open P1/P2 Tickets
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="ticker-wrap">
            <div className="ticker-scroll-zone">
                <div className="ticker-inner">
                    {tickerTickets.map((ticket, i) => {
                        const isP1 = ticket.priority === 'P1';
                        const priorityClass = isP1 ? 'p1-event' : 'p2-event';
                        const dotColor = isP1 ? '#f43f5e' : '#f59e0b';
                        const agingClass = ticket.slA_Breach === 'YES' ? 'aging-crit' : 'aging-warn';
                        return (
                            <span key={i} className={`ticker-event ${priorityClass}`}>
                                <span className="dot" style={{ background: dotColor }}></span>
                                <b>{ticket.pipelineName}</b>({ticket.priority})
                                <span className={`aging-badge ${agingClass}`}>
                                    ⏱ {formatElapsedTime(ticket.elapsedTime)}
                                </span>
                                Owner: {ticket.assignedTo ?? 'Unassigned'}
                            </span>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default React.memo(Ticker);
