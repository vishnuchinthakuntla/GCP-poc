"use client";

import React, { useEffect, useMemo } from "react";
import "./ApprovalAgent.css";
import useAgentStore from "../../stores/useAgentStore";

function ApprovalTable() {
  const panel = useAgentStore((s) => s.panel);
  const selectAgent = useAgentStore((s) => s.selectAgent);
  const approveTicket = useAgentStore((s) => s.approveTicket);

  // ✅ Load approval panel once
  useEffect(() => {
    selectAgent("approval");
  }, []);

  const tickets = panel?.queued?.items || [];
  const loading = panel?.loading;

  /* ✅ Handle approve (store-based) */
  const handleApprove = async (threadId) => {
    try {
      await approveTicket(threadId);
      alert("Approved ✅");
    } catch {
      alert("Approval failed ❌");
    }
  };

  /* ✅ Normalize */
  const normalizedTickets = useMemo(() => {
    return (tickets || []).map((t, idx) => {
      let action = {};
      try {
        action = JSON.parse(t.recommended_action || "{}");
      } catch {}

      return {
        id: t.thread_id || idx,
        threadId: t.thread_id,
        pipeline: t.pipeline_name || "—",
        eventType: t.event_type || "—",
        severity: t.severity || "P3",
        status: t.status || "pending_approval",
        action: action.action || "—",
      };
    });
  }, [tickets]);

  return (
    <div className="tickets-section">
      <div className="tickets-section-header">
        <div className="tickets-section-title">HUMAN APPROVAL</div>
      </div>

      <div className="tickets-table-wrap">
        <table className="tickets-table">
          <thead>
            <tr>
              <th>PIPELINE</th>
              <th>EVENT TYPE</th>
              <th>PRIORITY</th>
              <th>RECOMMENDED ACTION</th>
              <th>STATUS</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: 12 }}>
                  Loading...
                </td>
              </tr>
            ) : normalizedTickets.length === 0 ? (
              <tr className="no-data">
                <td colSpan={5} style={{ textAlign: "center", padding: 12 }}>
                  No approval data
                </td>
              </tr>
            ) : (
              normalizedTickets.map((t, i) => (
                <tr
                  key={t.id}
                  className={`tr-${t.severity.toLowerCase()}`}
                  style={{
                    animation: `feed-in .3s ${i * 0.04}s ease both`,
                  }}
                >
                  <td>{t.pipeline}</td>
                  <td>{t.eventType}</td>

                  <td>
                    <span className={`t-prio ${t.severity.toLowerCase()}`}>
                      {t.severity}
                    </span>
                  </td>

                  <td>{t.action}</td>

                  <td>
                    {t.status === "pending_approval" ? (
                      <button
                        className="tf-btn active"
                        onClick={() => handleApprove(t.threadId)}
                      >
                        Approve
                      </button>
                    ) : (
                      <span className="t-status">{t.status}</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ApprovalTable;