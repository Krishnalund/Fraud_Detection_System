import BASE_URL from "./config";
import jsPDF from "jspdf";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const RISK_BG = { High: "#FCEBEB", Medium: "#FAEEDA", Low: "#EAF3DE" };
const RISK_TEXT = { High: "#791F1F", Medium: "#633806", Low: "#27500A" };

function StatCard({ label, value, sub, accent }) {
  return (
    <div style={{
      background: "#0f1c2e",
      border: `1px solid ${accent}30`,
      borderRadius: "14px",
      padding: "20px 24px",
      flex: "1",
      minWidth: "140px",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: 0, right: 0,
        width: "80px", height: "80px",
        background: `radial-gradient(circle at top right, ${accent}22, transparent 70%)`,
      }} />
      <p style={{ margin: "0 0 8px", fontSize: "12px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "#7a8fa6" }}>{label}</p>
      <p style={{ margin: "0 0 4px", fontSize: "28px", fontWeight: 700, color: "#e8f0f8", letterSpacing: "-0.02em" }}>{value}</p>
      {sub && <p style={{ margin: 0, fontSize: "12px", color: accent }}>{sub}</p>}
    </div>
  );
}

function RiskBadge({ level }) {
  if (!level) return null;
  return (
    <span style={{
      display: "inline-block",
      padding: "3px 10px",
      borderRadius: "20px",
      fontSize: "11px",
      fontWeight: 600,
      background: RISK_BG[level] || "#f0f0f0",
      color: RISK_TEXT[level] || "#333",
      letterSpacing: "0.04em",
    }}>{level}</span>
  );
}

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [total, setTotal] = useState(0);
  const [frauds, setFrauds] = useState(0);
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");
  const [nodeStats, setNodeStats] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const [transRes, totalRes, fraudRes, nodeRes] = await Promise.all([
        axios.get(`${BASE_URL}/transactions`, { headers }),
        axios.get(`${BASE_URL}/total-transactions`, { headers }),
        axios.get(`${BASE_URL}/total-frauds`, { headers }),
        axios.get(`${BASE_URL}/node-stats`, { headers }),
      ]);
      const txData = transRes.data;
      setTransactions(txData);
      setTotal(totalRes.data.total);
      setFrauds(fraudRes.data.total);
      setAlerts(txData.filter(t => t.isFraud));
      setNodeStats(nodeRes.data);
      setLastUpdated(new Date());
    } catch (error) {
      console.log(error);
    }
  };

  const fraudPct = total > 0 ? ((frauds / total) * 100).toFixed(1) : "0.0";

  const filtered = transactions.filter((t) => {
    const matchSearch = (t.sender || "").toLowerCase().includes(search.toLowerCase());
    const matchRisk = riskFilter === "All" || t.riskLevel === riskFilter;
    return matchSearch && matchRisk;
  });

  const doughnutData = {
    labels: ["Fraudulent", "Safe"],
    datasets: [{
      data: [frauds, total - frauds],
      backgroundColor: ["#E24B4A", "#1D9E75"],
      borderColor: ["#0f1c2e"],
      borderWidth: 3,
      hoverOffset: 6,
    }],
  };

  const barData = {
    labels: ["Total", "Frauds", "Safe"],
    datasets: [{
      data: [total, frauds, total - frauds],
      backgroundColor: ["#378ADD", "#E24B4A", "#1D9E75"],
      borderRadius: 6,
      borderSkipped: false,
    }],
  };

  const nodeChartData = {
    labels: nodeStats.map((n) => n._id),
    datasets: [{
      data: nodeStats.map((n) => n.count),
      backgroundColor: ["#378ADD", "#E24B4A", "#EF9F27", "#1D9E75"],
      borderRadius: 6,
      borderSkipped: false,
    }],
  };

  const chartOpts = (title) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#0a1628",
        titleColor: "#7a8fa6",
        bodyColor: "#e8f0f8",
        borderColor: "#1e3352",
        borderWidth: 1,
        padding: 12,
      },
    },
    scales: {
      x: { grid: { color: "#1e3352" }, ticks: { color: "#7a8fa6", font: { size: 11 } } },
      y: { grid: { color: "#1e3352" }, ticks: { color: "#7a8fa6", font: { size: 11 } } },
    },
  });

  const doughnutOpts = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "72%",
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#0a1628",
        titleColor: "#7a8fa6",
        bodyColor: "#e8f0f8",
        borderColor: "#1e3352",
        borderWidth: 1,
        padding: 12,
      },
    },
  };

  // ─── Drop-in replacement for generatePDF in Dashboard.js ───
// Make sure you have: import jsPDF from "jspdf"; at the top

const generatePDF = () => {
  const doc = new jsPDF();
  const pageW = 210;
  const pageH = 297;

  // ── BACKGROUND ──────────────────────────────────────────
  doc.setFillColor(6, 14, 26);
  doc.rect(0, 0, pageW, pageH, "F");

  // ── HEADER BAR ──────────────────────────────────────────
  doc.setFillColor(10, 22, 40);
  doc.rect(0, 0, pageW, 38, "F");

  // Shield icon placeholder (colored square)
  doc.setFillColor(226, 75, 74);
  doc.roundedRect(14, 8, 20, 20, 3, 3, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.text("FG", 19, 22);

  // App name
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(232, 240, 248);
  doc.text("FraudGuard", 40, 18);

  // Subtitle
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(122, 143, 166);
  doc.text("Fraud Detection & Transaction Monitoring System", 40, 26);

  // Report label on right
  doc.setFontSize(9);
  doc.setTextColor(55, 138, 221);
  doc.text("FRAUD DETECTION REPORT", pageW - 14, 16, { align: "right" });
  doc.setTextColor(122, 143, 166);
  doc.text(`Generated: ${new Date().toLocaleString()}`, pageW - 14, 24, { align: "right" });

  // Header bottom border
  doc.setDrawColor(30, 51, 82);
  doc.setLineWidth(0.5);
  doc.line(0, 38, pageW, 38);

  // ── SUMMARY SECTION TITLE ────────────────────────────────
  let y = 52;
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(122, 143, 166);
  doc.text("SUMMARY OVERVIEW", 14, y);
  doc.setDrawColor(55, 138, 221);
  doc.setLineWidth(0.4);
  doc.line(14, y + 2, 80, y + 2);

  // ── STAT CARDS (4 in a row) ──────────────────────────────
  y += 10;
  const cards = [
    { label: "Total Transactions", value: String(total),       accent: [55, 138, 221] },
    { label: "Total Frauds",       value: String(frauds),      accent: [226, 75, 74]  },
    { label: "Safe Transactions",  value: String(total - frauds), accent: [29, 158, 117] },
    { label: "Fraud Rate",         value: `${fraudPct}%`,      accent: [239, 159, 39] },
  ];

  const cardW = 42;
  const cardGap = 4;
  cards.forEach((card, i) => {
    const x = 14 + i * (cardW + cardGap);

    // Card background
    doc.setFillColor(15, 28, 46);
    doc.roundedRect(x, y, cardW, 28, 3, 3, "F");

    // Accent top border
    doc.setFillColor(...card.accent);
    doc.roundedRect(x, y, cardW, 2, 1, 1, "F");

    // Label
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(122, 143, 166);
    doc.text(card.label.toUpperCase(), x + cardW / 2, y + 10, { align: "center" });

    // Value
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...card.accent);
    doc.text(card.value, x + cardW / 2, y + 22, { align: "center" });
  });

  // ── RISK BREAKDOWN ───────────────────────────────────────
  y += 38;
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(122, 143, 166);
  doc.text("RISK BREAKDOWN", 14, y);
  doc.setDrawColor(239, 159, 39);
  doc.line(14, y + 2, 65, y + 2);

  y += 10;
  const highCount   = transactions.filter(t => t.riskLevel === "High").length;
  const medCount    = transactions.filter(t => t.riskLevel === "Medium").length;
  const lowCount    = transactions.filter(t => t.riskLevel === "Low").length;

  const riskCards = [
    { label: "High Risk",   value: highCount, bg: [252, 235, 235], text: [121, 31, 31],  bar: [226, 75, 74]  },
    { label: "Medium Risk", value: medCount,  bg: [250, 238, 218], text: [99, 56, 6],    bar: [239, 159, 39] },
    { label: "Low Risk",    value: lowCount,  bg: [234, 243, 222], text: [39, 80, 10],   bar: [29, 158, 117] },
  ];

  riskCards.forEach((rc, i) => {
    const x = 14 + i * 64;
    doc.setFillColor(15, 28, 46);
    doc.roundedRect(x, y, 58, 20, 3, 3, "F");
    doc.setFillColor(...rc.bar);
    doc.roundedRect(x, y, 4, 20, 2, 2, "F");
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(122, 143, 166);
    doc.text(rc.label, x + 10, y + 8);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...rc.bar);
    doc.text(String(rc.value), x + 10, y + 17);
  });

  // ── NODE STATISTICS ──────────────────────────────────────
  y += 32;
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(122, 143, 166);
  doc.text("NODE STATISTICS", 14, y);
  doc.setDrawColor(29, 158, 117);
  doc.line(14, y + 2, 65, y + 2);

  y += 10;
  nodeStats.forEach((n, i) => {
    const x = 14 + i * 64;
    doc.setFillColor(15, 28, 46);
    doc.roundedRect(x, y, 58, 16, 3, 3, "F");
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(122, 143, 166);
    doc.text(n._id || "Unknown", x + 8, y + 7);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(55, 138, 221);
    doc.text(String(n.count), x + 8, y + 14);
  });

  // ── RECENT FRAUD TRANSACTIONS TABLE ──────────────────────
  y += 28;
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(122, 143, 166);
  doc.text("RECENT FRAUD TRANSACTIONS", 14, y);
  doc.setDrawColor(226, 75, 74);
  doc.line(14, y + 2, 100, y + 2);

  // Table header
  y += 10;
  doc.setFillColor(15, 28, 46);
  doc.rect(14, y, pageW - 28, 10, "F");

  const cols = [14, 44, 74, 110, 145, 172];
  const headers = ["Sender", "Receiver", "Amount (PKR)", "Risk Level", "Fraud", "Device"];

  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(122, 143, 166);
  headers.forEach((h, i) => doc.text(h, cols[i] + 2, y + 7));

  doc.setDrawColor(30, 51, 82);
  doc.line(14, y + 10, pageW - 14, y + 10);

  // Table rows
  const fraudTxs = transactions.filter(t => t.isFraud).slice(0, 10);
  fraudTxs.forEach((t, i) => {
    y += 10;

    // Alternating row bg
    if (i % 2 === 0) {
      doc.setFillColor(10, 22, 40);
      doc.rect(14, y, pageW - 28, 10, "F");
    }

    // Risk color
    const riskColor =
      t.riskLevel === "High"   ? [226, 75, 74]   :
      t.riskLevel === "Medium" ? [239, 159, 39]  :
                                  [29, 158, 117];

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(232, 240, 248);
    doc.text(t.sender   || "-", cols[0] + 2, y + 7);
    doc.text(t.receiver || "-", cols[1] + 2, y + 7);
    doc.text(`${Number(t.amount || 0).toLocaleString()}`, cols[2] + 2, y + 7);

    // Colored risk level
    doc.setTextColor(...riskColor);
    doc.text(t.riskLevel || "-", cols[3] + 2, y + 7);

    // Fraud flag
    doc.setTextColor(226, 75, 74);
    doc.text("⚠ Yes", cols[4] + 2, y + 7);

    doc.setTextColor(122, 143, 166);
    doc.text(t.device || "-", cols[5] + 2, y + 7);

    doc.setDrawColor(15, 28, 46);
    doc.line(14, y + 10, pageW - 14, y + 10);
  });

  if (fraudTxs.length === 0) {
    y += 10;
    doc.setFontSize(9);
    doc.setTextColor(122, 143, 166);
    doc.text("No fraud transactions found.", 14, y + 7);
  }

  // ── FOOTER ───────────────────────────────────────────────
  doc.setFillColor(10, 22, 40);
  doc.rect(0, pageH - 18, pageW, 18, "F");
  doc.setDrawColor(30, 51, 82);
  doc.line(0, pageH - 18, pageW, pageH - 18);

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(122, 143, 166);
  doc.text("FraudGuard — Real-time Fraud Detection System", 14, pageH - 8);
  doc.text("Page 1 of 1", pageW - 14, pageH - 8, { align: "right" });

  // ── SAVE ─────────────────────────────────────────────────
  doc.save(`FraudGuard_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
};

  return (
    <div style={{
      minHeight: "100vh",
      background: "#060e1a",
      color: "#e8f0f8",
      fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
      padding: "0 0 48px",
    }}>

      {/* TOP NAV */}
      <div style={{
        background: "#07111f",
        borderBottom: "1px solid #1e3352",
        padding: "0 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "64px",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "32px", height: "32px", borderRadius: "8px",
            background: "linear-gradient(135deg, #E24B4A, #B02020)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "16px",
          }}>🛡</div>
          <div>
            <p style={{ margin: 0, fontWeight: 700, fontSize: "15px", letterSpacing: "-0.01em" }}>FraudGuard</p>
            <p style={{ margin: 0, fontSize: "11px", color: "#4a6480" }}>Real-time monitoring</p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {lastUpdated && (
            <span style={{ fontSize: "12px", color: "#4a6480" }}>
              Updated {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <div style={{
            width: "8px", height: "8px", borderRadius: "50%",
            background: "#1D9E75",
            boxShadow: "0 0 8px #1D9E75",
          }} />
          <button onClick={generatePDF} style={{
            background: "transparent",
            border: "1px solid #1e3352",
            borderRadius: "8px",
            color: "#7a8fa6",
            padding: "7px 16px",
            fontSize: "13px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            transition: "all 0.15s",
          }}
            onMouseEnter={(e) => { e.target.style.borderColor = "#378ADD"; e.target.style.color = "#378ADD"; }}
            onMouseLeave={(e) => { e.target.style.borderColor = "#1e3352"; e.target.style.color = "#7a8fa6"; }}
          >
            ↓ Export PDF
          </button>
        </div>
      </div>

      <div style={{ padding: "32px 32px 0" }}>

        {/* PAGE TITLE */}
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ margin: "0 0 4px", fontSize: "22px", fontWeight: 700, letterSpacing: "-0.02em" }}>
            Transaction Intelligence
          </h1>
          <p style={{ margin: 0, fontSize: "14px", color: "#4a6480" }}>
            Monitor and analyze fraudulent activity across your payment network
          </p>
        </div>

        {/* STAT CARDS */}
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "28px" }}>
          <StatCard label="Total Transactions" value={total.toLocaleString()} sub="All time" accent="#378ADD" />
          <StatCard label="Fraudulent" value={frauds.toLocaleString()} sub={`${fraudPct}% of total`} accent="#E24B4A" />
          <StatCard label="Safe Transactions" value={(total - frauds).toLocaleString()} sub="Verified clean" accent="#1D9E75" />
          <StatCard label="Active Alerts" value={alerts.length} sub={alerts.length > 0 ? "Requires attention" : "All clear"} accent="#EF9F27" />
        </div>

        {/* CHARTS ROW */}
        <div style={{ display: "grid", gridTemplateColumns: "280px 1fr 1fr", gap: "20px", marginBottom: "28px" }}>

          {/* Doughnut */}
          <div style={{
            background: "#0a1628",
            border: "1px solid #1e3352",
            borderRadius: "16px",
            padding: "24px",
          }}>
            <p style={{ margin: "0 0 4px", fontSize: "13px", fontWeight: 600, color: "#7a8fa6", textTransform: "uppercase", letterSpacing: "0.06em" }}>Fraud Ratio</p>
            <div style={{ position: "relative", height: "180px", margin: "16px 0" }}>
              <Doughnut data={doughnutData} options={doughnutOpts} />
              <div style={{
                position: "absolute", inset: 0,
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              }}>
                <p style={{ margin: 0, fontSize: "24px", fontWeight: 700, color: "#E24B4A" }}>{fraudPct}%</p>
                <p style={{ margin: 0, fontSize: "11px", color: "#4a6480" }}>fraud rate</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              {[["#E24B4A", "Fraud", frauds], ["#1D9E75", "Safe", total - frauds]].map(([c, l, v]) => (
                <div key={l} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "2px", background: c }} />
                  <span style={{ fontSize: "12px", color: "#7a8fa6" }}>{l} <strong style={{ color: "#e8f0f8" }}>{v}</strong></span>
                </div>
              ))}
            </div>
          </div>

          {/* Bar Chart */}
          <div style={{
            background: "#0a1628",
            border: "1px solid #1e3352",
            borderRadius: "16px",
            padding: "24px",
          }}>
            <p style={{ margin: "0 0 16px", fontSize: "13px", fontWeight: 600, color: "#7a8fa6", textTransform: "uppercase", letterSpacing: "0.06em" }}>Volume Breakdown</p>
            <div style={{ position: "relative", height: "200px" }}>
              <Bar data={barData} options={chartOpts()} />
            </div>
          </div>

          {/* Node Chart */}
          <div style={{
            background: "#0a1628",
            border: "1px solid #1e3352",
            borderRadius: "16px",
            padding: "24px",
          }}>
            <p style={{ margin: "0 0 16px", fontSize: "13px", fontWeight: 600, color: "#7a8fa6", textTransform: "uppercase", letterSpacing: "0.06em" }}>Node Distribution</p>
            <div style={{ position: "relative", height: "200px" }}>
              <Bar data={nodeChartData} options={chartOpts()} />
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "20px" }}>

          {/* TRANSACTIONS TABLE */}
          <div style={{
            background: "#0a1628",
            border: "1px solid #1e3352",
            borderRadius: "16px",
            overflow: "hidden",
          }}>
            <div style={{
              padding: "20px 24px",
              borderBottom: "1px solid #1e3352",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
              flexWrap: "wrap",
            }}>
              <p style={{ margin: 0, fontSize: "14px", fontWeight: 600 }}>
                Transactions
                <span style={{
                  marginLeft: "8px", fontSize: "12px", fontWeight: 500,
                  background: "#1e3352", color: "#7a8fa6",
                  padding: "2px 8px", borderRadius: "20px",
                }}>{filtered.length}</span>
              </p>
              <div style={{ display: "flex", gap: "10px" }}>
                <input
                  placeholder="Search sender…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    background: "#07111f",
                    border: "1px solid #1e3352",
                    borderRadius: "8px",
                    color: "#e8f0f8",
                    padding: "7px 12px",
                    fontSize: "13px",
                    outline: "none",
                    width: "160px",
                  }}
                />
                <select
                  value={riskFilter}
                  onChange={(e) => setRiskFilter(e.target.value)}
                  style={{
                    background: "#07111f",
                    border: "1px solid #1e3352",
                    borderRadius: "8px",
                    color: "#e8f0f8",
                    padding: "7px 12px",
                    fontSize: "13px",
                    outline: "none",
                    cursor: "pointer",
                  }}
                >
                  <option value="All">All Risk</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#07111f" }}>
                    {["Sender", "Receiver", "Amount", "Risk Level", "Status"].map((h) => (
                      <th key={h} style={{
                        padding: "12px 20px",
                        textAlign: "left",
                        fontSize: "11px",
                        fontWeight: 600,
                        color: "#4a6480",
                        textTransform: "uppercase",
                        letterSpacing: "0.07em",
                        borderBottom: "1px solid #1e3352",
                        whiteSpace: "nowrap",
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ padding: "48px", textAlign: "center", color: "#4a6480", fontSize: "14px" }}>
                        No transactions found
                      </td>
                    </tr>
                  ) : filtered.map((t, i) => (
                    <tr key={i} style={{
                      borderBottom: "1px solid #0f1c2e",
                      transition: "background 0.1s",
                    }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#0f1c2e"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                    >
                      <td style={{ padding: "14px 20px", fontSize: "13px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <div style={{
                            width: "28px", height: "28px", borderRadius: "50%",
                            background: "#1e3352",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "11px", fontWeight: 700, color: "#7a8fa6",
                          }}>
                            {(t.sender || "?")[0].toUpperCase()}
                          </div>
                          <span style={{ fontWeight: 500 }}>{t.sender}</span>
                        </div>
                      </td>
                      <td style={{ padding: "14px 20px", fontSize: "13px", color: "#7a8fa6" }}>{t.receiver}</td>
                      <td style={{ padding: "14px 20px", fontSize: "13px", fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
                        ${typeof t.amount === "number" ? t.amount.toLocaleString() : t.amount}
                      </td>
                      <td style={{ padding: "14px 20px" }}>
                        <RiskBadge level={t.riskLevel} />
                      </td>
                      <td style={{ padding: "14px 20px" }}>
                        {t.isFraud ? (
                          <span style={{
                            display: "inline-flex", alignItems: "center", gap: "4px",
                            padding: "3px 10px", borderRadius: "20px",
                            fontSize: "11px", fontWeight: 600,
                            background: "#FCEBEB", color: "#791F1F",
                          }}>⚠ Fraud</span>
                        ) : (
                          <span style={{
                            display: "inline-flex", alignItems: "center", gap: "4px",
                            padding: "3px 10px", borderRadius: "20px",
                            fontSize: "11px", fontWeight: 600,
                            background: "#EAF3DE", color: "#27500A",
                          }}>✓ Safe</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ALERTS PANEL */}
          <div style={{
            background: "#0a1628",
            border: "1px solid #1e3352",
            borderRadius: "16px",
            overflow: "hidden",
            height: "fit-content",
          }}>
            <div style={{
              padding: "20px 24px",
              borderBottom: "1px solid #1e3352",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
              <p style={{ margin: 0, fontSize: "14px", fontWeight: 600 }}>Live Alerts</p>
              {alerts.length > 0 && (
                <span style={{
                  background: "#E24B4A",
                  color: "#fff",
                  fontSize: "11px",
                  fontWeight: 700,
                  padding: "2px 8px",
                  borderRadius: "20px",
                  animation: "pulse 2s infinite",
                }}>{alerts.length}</span>
              )}
            </div>
            <div style={{ padding: "8px 0" }}>
              {alerts.length === 0 ? (
                <div style={{ padding: "32px 24px", textAlign: "center" }}>
                  <div style={{ fontSize: "32px", marginBottom: "8px" }}>✅</div>
                  <p style={{ margin: 0, fontSize: "13px", color: "#4a6480" }}>No active alerts</p>
                </div>
              ) : alerts.map((a, i) => (
                <div key={i} style={{
                  padding: "14px 24px",
                  borderBottom: i < alerts.length - 1 ? "1px solid #0f1c2e" : "none",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  transition: "background 0.1s",
                }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#0f1c2e"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
                  <div style={{
                    width: "32px", height: "32px", borderRadius: "8px",
                    background: "#1e1210",
                    border: "1px solid #E24B4A40",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "14px", flexShrink: 0,
                  }}>⚠</div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ margin: "0 0 2px", fontSize: "13px", fontWeight: 500, color: "#e8f0f8" }}>
                      {a.sender}
                    </p>
                    <p style={{ margin: 0, fontSize: "11px", color: "#4a6480" }}>
                      → {a.receiver}
                    </p>
                  </div>
                  <div style={{
                    marginLeft: "auto",
                    width: "6px", height: "6px", borderRadius: "50%",
                    background: "#E24B4A",
                    boxShadow: "0 0 6px #E24B4A",
                    flexShrink: 0,
                    marginTop: "4px",
                  }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        * { box-sizing: border-box; }
        input::placeholder { color: #4a6480; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #07111f; }
        ::-webkit-scrollbar-thumb { background: #1e3352; border-radius: 3px; }
      `}</style>
    </div>
  );
}
