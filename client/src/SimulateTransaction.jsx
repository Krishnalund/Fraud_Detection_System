import axios from "axios";
import React, { useState } from "react";

const NAMES = ["Ali", "Sara", "Ahmed", "John", "Ayesha", "David", "Zara", "Omar", "Fatima", "Chris"];

const RISK_CONFIG = {
  High:   { bg: "#FCEBEB", color: "#791F1F", accent: "#E24B4A", bar: "#E24B4A" },
  Medium: { bg: "#FAEEDA", color: "#633806", accent: "#EF9F27", bar: "#EF9F27" },
  Low:    { bg: "#EAF3DE", color: "#27500A", accent: "#1D9E75", bar: "#1D9E75" },
};

function Field({ label, value, onChange, type = "text", placeholder }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <label style={{
        display: "block", fontSize: "12px", fontWeight: 600,
        color: "#4a6480", textTransform: "uppercase", letterSpacing: "0.07em",
        marginBottom: "8px",
      }}>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{
          width: "100%", padding: "11px 14px",
          background: "#07111f",
          border: "1px solid #1e3352",
          borderRadius: "10px",
          color: "#e8f0f8",
          fontSize: "14px",
          outline: "none",
          transition: "border-color 0.15s",
        }}
        onFocus={e => e.target.style.borderColor = "#378ADD"}
        onBlur={e => e.target.style.borderColor = "#1e3352"}
      />
    </div>
  );
}

function ScoreBar({ score }) {
  const pct = Math.min(100, Math.max(0, score));
  const color = pct >= 70 ? "#E24B4A" : pct >= 40 ? "#EF9F27" : "#1D9E75";
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
        <span style={{ fontSize: "12px", color: "#4a6480" }}>Risk Score</span>
        <span style={{ fontSize: "14px", fontWeight: 700, color }}>{pct}</span>
      </div>
      <div style={{
        height: "6px", background: "#1e3352", borderRadius: "99px", overflow: "hidden",
      }}>
        <div style={{
          height: "100%", width: `${pct}%`,
          background: color, borderRadius: "99px",
          transition: "width 0.8s cubic-bezier(0.4,0,0.2,1)",
        }} />
      </div>
    </div>
  );
}

export default function SimulateTransaction() {
  const [sender, setSender] = useState("");
  const [receiver, setReceiver] = useState("");
  const [amount, setAmount] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);

  const validate = () => {
    if (!sender.trim()) return "Sender name is required.";
    if (!receiver.trim()) return "Receiver name is required.";
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0)
      return "Enter a valid amount greater than 0.";
    return "";
  };

  const simulate = async () => {
    const err = validate();
    if (err) { setError(err); return; }
    setError("");
    setLoading(true);
    setResult(null);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:5000/simulate-transaction", {
        sender: sender.trim(),
        receiver: receiver.trim(),
        amount: Number(amount),
      }, { headers: { Authorization: `Bearer ${token}` } });
      const tx = res.data.transaction;
      setResult(tx);
      setHistory(prev => [tx, ...prev].slice(0, 5));
    } catch (e) {
      setError("Could not connect to server. Make sure the backend is running on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  const randomize = () => {
    const pick = arr => arr[Math.floor(Math.random() * arr.length)];
    let s = pick(NAMES), r = pick(NAMES);
    while (r === s) r = pick(NAMES);
    setSender(s);
    setReceiver(r);
    setAmount(Math.floor(Math.random() * 95000) + 1000);
    setError("");
    setResult(null);
  };

  const reset = () => {
    setSender(""); setReceiver(""); setAmount("");
    setResult(null); setError("");
  };

  const risk = result ? RISK_CONFIG[result.riskLevel] || RISK_CONFIG.Low : null;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#060e1a",
      color: "#e8f0f8",
      fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
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
          <span style={{ fontSize: "14px", color: "#4a6480" }}>Simulator</span>
        </div>
        <a href="/" style={{
          fontSize: "13px", color: "#4a6480", textDecoration: "none",
          border: "1px solid #1e3352", borderRadius: "8px", padding: "6px 14px",
          transition: "all 0.15s",
        }}
          onMouseEnter={e => { e.target.style.color = "#e8f0f8"; e.target.style.borderColor = "#378ADD40"; }}
          onMouseLeave={e => { e.target.style.color = "#4a6480"; e.target.style.borderColor = "#1e3352"; }}
        >← Back</a>
      </nav>

      <div style={{
        maxWidth: "1000px", margin: "0 auto", padding: "40px 24px",
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px",
      }}>

        {/* LEFT — FORM */}
        <div>
          <div style={{ marginBottom: "28px" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: "#378ADD18", border: "1px solid #378ADD40",
              borderRadius: "20px", padding: "5px 14px",
              fontSize: "11px", fontWeight: 600, color: "#378ADD",
              letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: "12px",
            }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#378ADD", display: "inline-block" }} />
              Transaction Simulator
            </div>
            <h1 style={{ margin: "0 0 8px", fontSize: "26px", fontWeight: 800, letterSpacing: "-0.02em" }}>
              Test a Transaction
            </h1>
            <p style={{ margin: 0, fontSize: "14px", color: "#4a6480", lineHeight: 1.6 }}>
              Submit a transaction to the fraud detection engine and get an instant AI risk assessment.
            </p>
          </div>

          <div style={{
            background: "#0a1628", border: "1px solid #1e3352",
            borderRadius: "16px", padding: "28px",
          }}>
            <Field label="Sender" placeholder="e.g. Ali" value={sender} onChange={e => { setSender(e.target.value); setError(""); }} />
            <Field label="Receiver" placeholder="e.g. Sara" value={receiver} onChange={e => { setReceiver(e.target.value); setError(""); }} />
            <Field label="Amount (PKR)" placeholder="e.g. 50000" type="number" value={amount} onChange={e => { setAmount(e.target.value); setError(""); }} />

            {error && (
              <div style={{
                background: "#FCEBEB", border: "1px solid #E24B4A40",
                borderRadius: "8px", padding: "10px 14px",
                fontSize: "13px", color: "#791F1F", marginBottom: "16px",
              }}>
                ⚠ {error}
              </div>
            )}

            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={simulate} disabled={loading} style={{
                flex: 1, padding: "12px", fontSize: "14px", fontWeight: 600,
                background: loading ? "#1e3352" : "#378ADD",
                color: loading ? "#4a6480" : "#fff",
                border: "none", borderRadius: "10px", cursor: loading ? "not-allowed" : "pointer",
                transition: "background 0.15s",
              }}>
                {loading ? "Analyzing…" : "▶ Run Analysis"}
              </button>
              <button onClick={randomize} style={{
                padding: "12px 16px", fontSize: "14px",
                background: "transparent", color: "#7a8fa6",
                border: "1px solid #1e3352", borderRadius: "10px", cursor: "pointer",
                transition: "all 0.15s",
              }}
                title="Generate random transaction"
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#EF9F2760"; e.currentTarget.style.color = "#EF9F27"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#1e3352"; e.currentTarget.style.color = "#7a8fa6"; }}
              >🎲</button>
              <button onClick={reset} style={{
                padding: "12px 16px", fontSize: "14px",
                background: "transparent", color: "#7a8fa6",
                border: "1px solid #1e3352", borderRadius: "10px", cursor: "pointer",
                transition: "all 0.15s",
              }}
                title="Clear form"
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#E24B4A60"; e.currentTarget.style.color = "#E24B4A"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#1e3352"; e.currentTarget.style.color = "#7a8fa6"; }}
              >✕</button>
            </div>
          </div>

          {/* HISTORY */}
          {history.length > 0 && (
            <div style={{ marginTop: "20px" }}>
              <p style={{ margin: "0 0 12px", fontSize: "12px", fontWeight: 600, color: "#4a6480", textTransform: "uppercase", letterSpacing: "0.07em" }}>
                Recent Simulations
              </p>
              <div style={{
                background: "#0a1628", border: "1px solid #1e3352", borderRadius: "12px", overflow: "hidden",
              }}>
                {history.map((h, i) => {
                  const c = RISK_CONFIG[h.riskLevel] || RISK_CONFIG.Low;
                  return (
                    <div key={i} style={{
                      padding: "12px 16px",
                      borderBottom: i < history.length - 1 ? "1px solid #0f1c2e" : "none",
                      display: "flex", alignItems: "center", gap: "12px",
                    }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: 0, fontSize: "13px", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {h.sender} → {h.receiver}
                        </p>
                        <p style={{ margin: 0, fontSize: "11px", color: "#4a6480" }}>
                          PKR {Number(h.amount).toLocaleString()}
                        </p>
                      </div>
                      <span style={{
                        padding: "2px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 600,
                        background: c.bg, color: c.color,
                      }}>{h.riskLevel}</span>
                      <span style={{ fontSize: "12px", color: h.isFraud ? "#E24B4A" : "#1D9E75" }}>
                        {h.isFraud ? "⚠ Fraud" : "✓ Safe"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT — RESULT */}
        <div>
          {!result && !loading && (
            <div style={{
              height: "100%", minHeight: "400px",
              background: "#0a1628", border: "1px dashed #1e3352",
              borderRadius: "16px",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              textAlign: "center", padding: "40px",
            }}>
              <div style={{ fontSize: "48px", marginBottom: "16px", opacity: 0.4 }}>🔬</div>
              <p style={{ margin: "0 0 8px", fontSize: "16px", fontWeight: 600, color: "#4a6480" }}>
                No Analysis Yet
              </p>
              <p style={{ margin: 0, fontSize: "13px", color: "#2a3f58" }}>
                Fill in the form and click "Run Analysis" to see fraud detection results here.
              </p>
            </div>
          )}

          {loading && (
            <div style={{
              height: "100%", minHeight: "400px",
              background: "#0a1628", border: "1px solid #1e3352",
              borderRadius: "16px",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: "16px",
            }}>
              <div style={{
                width: "40px", height: "40px", borderRadius: "50%",
                border: "3px solid #1e3352", borderTopColor: "#378ADD",
                animation: "spin 0.8s linear infinite",
              }} />
              <p style={{ margin: 0, fontSize: "14px", color: "#4a6480" }}>Analyzing transaction…</p>
            </div>
          )}

          {result && risk && (
            <div style={{
              background: "#0a1628", border: `1px solid ${risk.accent}40`,
              borderRadius: "16px", overflow: "hidden",
            }}>
              {/* Result header */}
              <div style={{
                padding: "20px 24px",
                borderBottom: "1px solid #1e3352",
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}>
                <div>
                  <p style={{ margin: "0 0 4px", fontSize: "12px", fontWeight: 600, color: "#4a6480", textTransform: "uppercase", letterSpacing: "0.07em" }}>
                    Analysis Result
                  </p>
                  <p style={{ margin: 0, fontSize: "15px", fontWeight: 600 }}>
                    {result.sender} → {result.receiver}
                  </p>
                </div>
                <span style={{
                  padding: "6px 16px", borderRadius: "20px", fontSize: "13px", fontWeight: 700,
                  background: risk.bg, color: risk.color,
                }}>{result.riskLevel} Risk</span>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Score bar */}
                <div style={{
                  background: "#07111f", borderRadius: "10px", padding: "16px", marginBottom: "16px",
                }}>
                  <ScoreBar score={result.riskScore} />
                </div>

                {/* Key facts */}
                <div style={{
                  display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px",
                }}>
                  {[
                    { label: "Amount", value: `PKR ${Number(result.amount || 0).toLocaleString()}` },
                    { label: "Risk Score", value: result.riskScore },
                    { label: "Fraud Flag", value: result.isFraud ? "⚠ Yes" : "✓ No", color: result.isFraud ? "#E24B4A" : "#1D9E75" },
                    { label: "Risk Level", value: result.riskLevel, color: risk.accent },
                  ].map(item => (
                    <div key={item.label} style={{
                      background: "#07111f", borderRadius: "8px", padding: "12px 14px",
                    }}>
                      <p style={{ margin: "0 0 4px", fontSize: "11px", color: "#4a6480", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        {item.label}
                      </p>
                      <p style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: item.color || "#e8f0f8" }}>
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* AI Explanation */}
                {result.aiExplanation?.length > 0 && (
                  <div>
                    <p style={{ margin: "0 0 12px", fontSize: "12px", fontWeight: 600, color: "#4a6480", textTransform: "uppercase", letterSpacing: "0.07em" }}>
                      AI Explanation
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {result.aiExplanation.map((reason, i) => (
                        <div key={i} style={{
                          display: "flex", alignItems: "flex-start", gap: "10px",
                          background: "#07111f", borderRadius: "8px", padding: "12px 14px",
                          borderLeft: `3px solid ${risk.accent}`,
                        }}>
                          <span style={{ fontSize: "12px", color: risk.accent, flexShrink: 0, marginTop: "1px" }}>
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <p style={{ margin: 0, fontSize: "13px", color: "#b0c4d8", lineHeight: 1.5 }}>
                            {reason}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        input[type=number]::-webkit-inner-spin-button { opacity: 0.3; }
        input::placeholder { color: #2a3f58; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #07111f; }
        ::-webkit-scrollbar-thumb { background: #1e3352; border-radius: 3px; }
        @media (max-width: 700px) {
          .sim-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
