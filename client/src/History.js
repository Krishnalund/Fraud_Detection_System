import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "./config";
const RISK_CONFIG = {
  High:   { bg: "#FCEBEB", color: "#791F1F", accent: "#E24B4A" },
  Medium: { bg: "#FAEEDA", color: "#633806", accent: "#EF9F27" },
  Low:    { bg: "#EAF3DE", color: "#27500A", accent: "#1D9E75" },
};

function RiskBadge({ level }) {
  const c = RISK_CONFIG[level];
  if (!c) return <span style={{ color: "#4a6480", fontSize: "12px" }}>—</span>;
  return (
    <span style={{
      display: "inline-block", padding: "3px 10px", borderRadius: "20px",
      fontSize: "11px", fontWeight: 700,
      background: c.bg, color: c.color, letterSpacing: "0.04em",
    }}>{level}</span>
  );
}

function StatusBadge({ isFraud }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "4px",
      padding: "3px 10px", borderRadius: "20px",
      fontSize: "11px", fontWeight: 700,
      background: isFraud ? "#FCEBEB" : "#EAF3DE",
      color: isFraud ? "#791F1F" : "#27500A",
    }}>
      {isFraud ? "⚠ Fraud" : "✓ Safe"}
    </span>
  );
}

export default function History() {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");
  const [fraudOnly, setFraudOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState("amount");
  const [sortDir, setSortDir] = useState("desc");

  useEffect(() => { fetchTransactions(); }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${BASE_URL}/transactions`, {
  headers: { Authorization: `Bearer ${token}` }
});
      setTransactions(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field) => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("desc"); }
  };

  const filtered = transactions
    .filter(t => {
      const matchSearch = (t.sender || "").toLowerCase().includes(search.toLowerCase()) ||
                          (t.receiver || "").toLowerCase().includes(search.toLowerCase());
      const matchRisk   = riskFilter === "All" || t.riskLevel === riskFilter;
      const matchFraud  = !fraudOnly || t.isFraud;
      return matchSearch && matchRisk && matchFraud;
    })
    .sort((a, b) => {
      let av = a[sortField], bv = b[sortField];
      if (typeof av === "string") av = av?.toLowerCase();
      if (typeof bv === "string") bv = bv?.toLowerCase();
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

  const total  = transactions.length;
  const frauds = transactions.filter(t => t.isFraud).length;
  const high   = transactions.filter(t => t.riskLevel === "High").length;

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <span style={{ color: "#2a3f58", marginLeft: "4px" }}>↕</span>;
    return <span style={{ color: "#378ADD", marginLeft: "4px" }}>{sortDir === "asc" ? "↑" : "↓"}</span>;
  };

  const thStyle = (field) => ({
    padding: "12px 20px", textAlign: "left",
    fontSize: "11px", fontWeight: 600, color: "#4a6480",
    textTransform: "uppercase", letterSpacing: "0.07em",
    borderBottom: "1px solid #1e3352",
    background: "#07111f", cursor: field ? "pointer" : "default",
    whiteSpace: "nowrap", userSelect: "none",
  });

  return (
    <div style={{
      minHeight: "100vh", background: "#060e1a",
      color: "#e8f0f8", fontFamily: "'Inter','Segoe UI',system-ui,sans-serif",
    }}>

      {/* NAV */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "#07111fcc", backdropFilter: "blur(12px)",
        borderBottom: "1px solid #1e3352",
        padding: "0 32px", height: "64px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "30px", height: "30px", borderRadius: "7px",
            background: "linear-gradient(135deg, #E24B4A, #9b1c1c)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px",
          }}>🛡</div>
          <span style={{ fontWeight: 700, fontSize: "15px" }}>FraudGuard</span>
          <span style={{ color: "#1e3352", fontSize: "18px", margin: "0 4px" }}>/</span>
          <span style={{ fontSize: "14px", color: "#4a6480" }}>History</span>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={fetchTransactions} style={{
            fontSize: "13px", color: "#4a6480", background: "transparent",
            border: "1px solid #1e3352", borderRadius: "8px", padding: "6px 14px",
            cursor: "pointer", transition: "all 0.15s",
          }}
            onMouseEnter={e => { e.currentTarget.style.color = "#e8f0f8"; e.currentTarget.style.borderColor = "#378ADD40"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "#4a6480"; e.currentTarget.style.borderColor = "#1e3352"; }}
          >↻ Refresh</button>
          <a href="/" style={{
            fontSize: "13px", color: "#4a6480", textDecoration: "none",
            border: "1px solid #1e3352", borderRadius: "8px", padding: "6px 14px",
            transition: "all 0.15s",
          }}
            onMouseEnter={e => { e.target.style.color = "#e8f0f8"; e.target.style.borderColor = "#378ADD40"; }}
            onMouseLeave={e => { e.target.style.color = "#4a6480"; e.target.style.borderColor = "#1e3352"; }}
          >← Back</a>
        </div>
      </nav>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 24px" }}>

        {/* HEADER */}
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ margin: "0 0 6px", fontSize: "26px", fontWeight: 800, letterSpacing: "-0.02em" }}>
            Transaction History
          </h1>
          <p style={{ margin: 0, fontSize: "14px", color: "#4a6480" }}>
            Full audit log of all processed transactions
          </p>
        </div>

        {/* STAT PILLS */}
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "24px" }}>
          {[
            { label: "Total", value: total, accent: "#378ADD" },
            { label: "Fraudulent", value: frauds, accent: "#E24B4A" },
            { label: "Safe", value: total - frauds, accent: "#1D9E75" },
            { label: "High Risk", value: high, accent: "#EF9F27" },
          ].map(s => (
            <div key={s.label} style={{
              background: "#0a1628", border: `1px solid ${s.accent}30`,
              borderRadius: "12px", padding: "14px 20px",
              display: "flex", alignItems: "center", gap: "12px",
            }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: s.accent, flexShrink: 0 }} />
              <div>
                <p style={{ margin: 0, fontSize: "11px", color: "#4a6480", textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</p>
                <p style={{ margin: 0, fontSize: "20px", fontWeight: 700, color: "#e8f0f8", lineHeight: 1.2 }}>{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* FILTERS */}
        <div style={{
          background: "#0a1628", border: "1px solid #1e3352",
          borderRadius: "14px", padding: "16px 20px",
          display: "flex", alignItems: "center", gap: "12px",
          flexWrap: "wrap", marginBottom: "16px",
        }}>
          {/* Search */}
          <div style={{ position: "relative", flex: "1", minWidth: "200px" }}>
            <span style={{
              position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)",
              color: "#4a6480", fontSize: "14px", pointerEvents: "none",
            }}>🔍</span>
            <input
              type="text"
              placeholder="Search sender or receiver…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: "100%", padding: "9px 12px 9px 34px",
                background: "#07111f", border: "1px solid #1e3352",
                borderRadius: "9px", color: "#e8f0f8", fontSize: "13px", outline: "none",
              }}
              onFocus={e => e.target.style.borderColor = "#378ADD"}
              onBlur={e => e.target.style.borderColor = "#1e3352"}
            />
          </div>

          {/* Risk filter */}
          <select value={riskFilter} onChange={e => setRiskFilter(e.target.value)} style={{
            padding: "9px 14px", background: "#07111f",
            border: "1px solid #1e3352", borderRadius: "9px",
            color: "#e8f0f8", fontSize: "13px", outline: "none", cursor: "pointer",
          }}>
            <option value="All">All Risk Levels</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {/* Fraud toggle */}
          <button onClick={() => setFraudOnly(f => !f)} style={{
            padding: "9px 16px", fontSize: "13px", fontWeight: 600,
            background: fraudOnly ? "#E24B4A18" : "transparent",
            border: `1px solid ${fraudOnly ? "#E24B4A60" : "#1e3352"}`,
            borderRadius: "9px",
            color: fraudOnly ? "#E24B4A" : "#7a8fa6",
            cursor: "pointer", transition: "all 0.15s",
            display: "flex", alignItems: "center", gap: "6px",
          }}>
            <span style={{
              width: "14px", height: "14px", borderRadius: "4px",
              background: fraudOnly ? "#E24B4A" : "transparent",
              border: `2px solid ${fraudOnly ? "#E24B4A" : "#4a6480"}`,
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              fontSize: "9px", color: "#fff", flexShrink: 0,
            }}>{fraudOnly ? "✓" : ""}</span>
            Frauds Only
          </button>

          {/* Results count */}
          <span style={{ marginLeft: "auto", fontSize: "12px", color: "#4a6480", whiteSpace: "nowrap" }}>
            {filtered.length} of {total} results
          </span>
        </div>

        {/* TABLE */}
        <div style={{
          background: "#0a1628", border: "1px solid #1e3352",
          borderRadius: "14px", overflow: "hidden",
        }}>
          {loading ? (
            <div style={{
              padding: "80px", display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: "16px",
            }}>
              <div style={{
                width: "36px", height: "36px", borderRadius: "50%",
                border: "3px solid #1e3352", borderTopColor: "#378ADD",
                animation: "spin 0.8s linear infinite",
              }} />
              <p style={{ margin: 0, color: "#4a6480", fontSize: "14px" }}>Loading transactions…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: "80px", textAlign: "center" }}>
              <div style={{ fontSize: "40px", marginBottom: "12px", opacity: 0.3 }}>📭</div>
              <p style={{ margin: "0 0 6px", color: "#4a6480", fontSize: "15px", fontWeight: 600 }}>No transactions found</p>
              <p style={{ margin: 0, color: "#2a3f58", fontSize: "13px" }}>Try adjusting your filters</p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={thStyle(null)}>#</th>
                    <th style={thStyle("sender")} onClick={() => handleSort("sender")}>
                      Sender <SortIcon field="sender" />
                    </th>
                    <th style={thStyle("receiver")} onClick={() => handleSort("receiver")}>
                      Receiver <SortIcon field="receiver" />
                    </th>
                    <th style={thStyle("amount")} onClick={() => handleSort("amount")}>
                      Amount <SortIcon field="amount" />
                    </th>
                    <th style={thStyle("riskLevel")} onClick={() => handleSort("riskLevel")}>
                      Risk <SortIcon field="riskLevel" />
                    </th>
                    <th style={thStyle("isFraud")} onClick={() => handleSort("isFraud")}>
                      Status <SortIcon field="isFraud" />
                    </th>
                    <th style={thStyle(null)}>Node</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((t, i) => (
                    <tr key={i}
                      style={{ borderBottom: "1px solid #0f1c2e", transition: "background 0.1s" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#0f1c2e"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <td style={{ padding: "14px 20px", fontSize: "12px", color: "#2a3f58", fontVariantNumeric: "tabular-nums" }}>
                        {i + 1}
                      </td>
                      <td style={{ padding: "14px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <div style={{
                            width: "28px", height: "28px", borderRadius: "50%",
                            background: "#1e3352", flexShrink: 0,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "11px", fontWeight: 700, color: "#7a8fa6",
                          }}>
                            {(t.sender || "?")[0].toUpperCase()}
                          </div>
                          <span style={{ fontSize: "13px", fontWeight: 500 }}>{t.sender || "—"}</span>
                        </div>
                      </td>
                      <td style={{ padding: "14px 20px", fontSize: "13px", color: "#7a8fa6" }}>
                        {t.receiver || "—"}
                      </td>
                      <td style={{ padding: "14px 20px", fontSize: "13px", fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
                        PKR {Number(t.amount || 0).toLocaleString()}
                      </td>
                      <td style={{ padding: "14px 20px" }}>
                        <RiskBadge level={t.riskLevel} />
                      </td>
                      <td style={{ padding: "14px 20px" }}>
                        <StatusBadge isFraud={t.isFraud} />
                      </td>
                      <td style={{ padding: "14px 20px", fontSize: "12px", color: "#4a6480" }}>
                        {t.serverNode || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* FOOTER COUNT */}
        {!loading && filtered.length > 0 && (
          <p style={{ margin: "12px 0 0", fontSize: "12px", color: "#2a3f58", textAlign: "right" }}>
            Showing {filtered.length} transaction{filtered.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        input::placeholder { color: #2a3f58; }
        select option { background: #07111f; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #07111f; }
        ::-webkit-scrollbar-thumb { background: #1e3352; border-radius: 3px; }
      `}</style>
    </div>
  );
}
