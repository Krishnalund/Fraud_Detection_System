import axios from "axios";
import React, { useState } from "react";
import BASE_URL from "./config";
const RISK_CONFIG = {
  High:   { bg: "#FCEBEB", color: "#791F1F", accent: "#E24B4A" },
  Medium: { bg: "#FAEEDA", color: "#633806", accent: "#EF9F27" },
  Low:    { bg: "#EAF3DE", color: "#27500A", accent: "#1D9E75" },
};

function Field({ label, value, onChange, type = "text", placeholder, required }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <label style={{
        display: "block", fontSize: "12px", fontWeight: 600,
        color: "#4a6480", textTransform: "uppercase", letterSpacing: "0.07em",
        marginBottom: "8px",
      }}>
        {label} {required && <span style={{ color: "#E24B4A" }}>*</span>}
      </label>
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
          boxSizing: "border-box",
        }}
        onFocus={e => e.target.style.borderColor = "#378ADD"}
        onBlur={e => e.target.style.borderColor = "#1e3352"}
      />
    </div>
  );
}

function SelectField({ label, value, onChange, options, required }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <label style={{
        display: "block", fontSize: "12px", fontWeight: 600,
        color: "#4a6480", textTransform: "uppercase", letterSpacing: "0.07em",
        marginBottom: "8px",
      }}>
        {label} {required && <span style={{ color: "#E24B4A" }}>*</span>}
      </label>
      <select
        value={value}
        onChange={onChange}
        style={{
          width: "100%", padding: "11px 14px",
          background: "#07111f",
          border: "1px solid #1e3352",
          borderRadius: "10px",
          color: value ? "#e8f0f8" : "#2a3f58",
          fontSize: "14px",
          outline: "none",
          cursor: "pointer",
          transition: "border-color 0.15s",
          boxSizing: "border-box",
          appearance: "none",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%234a6480' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 14px center",
        }}
        onFocus={e => e.target.style.borderColor = "#378ADD"}
        onBlur={e => e.target.style.borderColor = "#1e3352"}
      >
        <option value="">Select {label}</option>
        {options.map(opt => (
          <option key={opt} value={opt} style={{ background: "#07111f", color: "#e8f0f8" }}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

function ScoreBar({ score }) {
  const pct = Math.min(100, Math.max(0, score));
  const color = pct >= 70 ? "#E24B4A" : pct >= 30 ? "#EF9F27" : "#1D9E75";
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
        <span style={{ fontSize: "12px", color: "#4a6480" }}>Risk Score</span>
        <span style={{ fontSize: "14px", fontWeight: 700, color }}>{pct}</span>
      </div>
      <div style={{ height: "6px", background: "#1e3352", borderRadius: "99px", overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${pct}%`,
          background: color, borderRadius: "99px",
          transition: "width 0.8s cubic-bezier(0.4,0,0.2,1)",
        }} />
      </div>
    </div>
  );
}

export default function AddTransaction() {
  const now = () => new Date().toISOString().slice(0, 16); // for datetime-local input

  const [form, setForm] = useState({
    sender: "",
    receiver: "",
    amount: "",
    location: "",
    device: "",
    ipAddress: "",
    transactionTime: now(),
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const set = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    setError("");
  };

  const validate = () => {
    if (!form.sender.trim())    return "Sender name is required.";
    if (!form.receiver.trim())  return "Receiver name is required.";
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0)
      return "Enter a valid amount greater than 0.";
    if (!form.location)         return "Please select a location.";
    if (!form.device)           return "Please select a device type.";
    if (!form.ipAddress.trim()) return "IP Address is required.";
    return "";
  };

  const submit = async () => {
    const err = validate();
    if (err) { setError(err); return; }
    setError("");
    setLoading(true);
    setResult(null);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`${BASE_URL}/transactions`, {
        sender:          form.sender.trim(),
        receiver:        form.receiver.trim(),
        amount:          Number(form.amount),
        location:        form.location,
        device:          form.device,
        ipAddress:       form.ipAddress.trim(),
        transactionTime: new Date(form.transactionTime).toISOString(),
      }, { headers: { Authorization: `Bearer ${token}` } });
      setResult(res.data);
      setSubmitted(true);
    } catch (e) {
      setError("Could not connect to server. Make sure the backend is running on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setForm({ sender: "", receiver: "", amount: "", location: "", device: "", ipAddress: "", transactionTime: now() });
    setResult(null);
    setError("");
    setSubmitted(false);
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
          <span style={{ fontSize: "14px", color: "#4a6480" }}>Add Transaction</span>
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
              background: "#1D9E7518", border: "1px solid #1D9E7540",
              borderRadius: "20px", padding: "5px 14px",
              fontSize: "11px", fontWeight: 600, color: "#1D9E75",
              letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: "12px",
            }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#1D9E75", display: "inline-block" }} />
              Manual Entry
            </div>
            <h1 style={{ margin: "0 0 8px", fontSize: "26px", fontWeight: 800, letterSpacing: "-0.02em" }}>
              Add Transaction
            </h1>
            <p style={{ margin: 0, fontSize: "14px", color: "#4a6480", lineHeight: 1.6 }}>
              Submit a real transaction with full details for fraud analysis and permanent storage.
            </p>
          </div>

          <div style={{
            background: "#0a1628", border: "1px solid #1e3352",
            borderRadius: "16px", padding: "28px",
          }}>
            {/* Row 1: Sender & Receiver */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <Field label="Sender" placeholder="e.g. Ali" value={form.sender} onChange={set("sender")} required />
              <Field label="Receiver" placeholder="e.g. Sara" value={form.receiver} onChange={set("receiver")} required />
            </div>

            {/* Amount */}
            <Field label="Amount (PKR)" placeholder="e.g. 50000" type="number" value={form.amount} onChange={set("amount")} required />

            {/* Row 2: Location & Device */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <SelectField label="Location" value={form.location} onChange={set("location")} options={["Local", "Foreign"]} required />
              <SelectField label="Device" value={form.device} onChange={set("device")} options={["Mobile", "Desktop", "Unknown"]} required />
            </div>

            {/* IP Address */}
            <Field label="IP Address" placeholder="e.g. 192.168.1.100" value={form.ipAddress} onChange={set("ipAddress")} required />

            {/* Transaction Time */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{
                display: "block", fontSize: "12px", fontWeight: 600,
                color: "#4a6480", textTransform: "uppercase", letterSpacing: "0.07em",
                marginBottom: "8px",
              }}>Transaction Time</label>
              <input
                type="datetime-local"
                value={form.transactionTime}
                onChange={set("transactionTime")}
                style={{
                  width: "100%", padding: "11px 14px",
                  background: "#07111f", border: "1px solid #1e3352",
                  borderRadius: "10px", color: "#e8f0f8",
                  fontSize: "14px", outline: "none",
                  transition: "border-color 0.15s", boxSizing: "border-box",
                  colorScheme: "dark",
                }}
                onFocus={e => e.target.style.borderColor = "#378ADD"}
                onBlur={e => e.target.style.borderColor = "#1e3352"}
              />
            </div>

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
              <button onClick={submit} disabled={loading || submitted} style={{
                flex: 1, padding: "12px", fontSize: "14px", fontWeight: 600,
                background: submitted ? "#1D9E7530" : loading ? "#1e3352" : "#1D9E75",
                color: submitted ? "#1D9E75" : loading ? "#4a6480" : "#fff",
                border: submitted ? "1px solid #1D9E7560" : "none",
                borderRadius: "10px",
                cursor: (loading || submitted) ? "not-allowed" : "pointer",
                transition: "background 0.15s",
              }}>
                {submitted ? "✓ Saved" : loading ? "Saving…" : "Submit Transaction"}
              </button>
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
              <div style={{ fontSize: "48px", marginBottom: "16px", opacity: 0.4 }}>📋</div>
              <p style={{ margin: "0 0 8px", fontSize: "16px", fontWeight: 600, color: "#4a6480" }}>
                No Result Yet
              </p>
              <p style={{ margin: 0, fontSize: "13px", color: "#2a3f58" }}>
                Fill in all fields and click "Submit Transaction" to see the fraud analysis result here.
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
                border: "3px solid #1e3352", borderTopColor: "#1D9E75",
                animation: "spin 0.8s linear infinite",
              }} />
              <p style={{ margin: 0, fontSize: "14px", color: "#4a6480" }}>Saving transaction…</p>
            </div>
          )}

          {result && risk && (
            <div style={{
              background: "#0a1628", border: `1px solid ${risk.accent}40`,
              borderRadius: "16px", overflow: "hidden",
            }}>
              {/* Header */}
              <div style={{
                padding: "20px 24px", borderBottom: "1px solid #1e3352",
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}>
                <div>
                  <p style={{ margin: "0 0 4px", fontSize: "12px", fontWeight: 600, color: "#4a6480", textTransform: "uppercase", letterSpacing: "0.07em" }}>
                    Transaction Saved
                  </p>
                  <p style={{ margin: 0, fontSize: "15px", fontWeight: 600 }}>
                    {form.sender} → {form.receiver}
                  </p>
                </div>
                <span style={{
                  padding: "6px 16px", borderRadius: "20px", fontSize: "13px", fontWeight: 700,
                  background: risk.bg, color: risk.color,
                }}>{result.riskLevel} Risk</span>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Score bar */}
                <div style={{ background: "#07111f", borderRadius: "10px", padding: "16px", marginBottom: "16px" }}>
                  <ScoreBar score={result.riskScore} />
                </div>

                {/* Key facts */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px" }}>
                  {[
                    { label: "Amount",     value: `PKR ${Number(form.amount).toLocaleString()}` },
                    { label: "Risk Score", value: result.riskScore },
                    { label: "Fraud Flag", value: result.fraudDetected ? "⚠ Yes" : "✓ No", color: result.fraudDetected ? "#E24B4A" : "#1D9E75" },
                    { label: "Risk Level", value: result.riskLevel, color: risk.accent },
                    { label: "Location",   value: form.location },
                    { label: "Device",     value: form.device },
                  ].map(item => (
                    <div key={item.label} style={{ background: "#07111f", borderRadius: "8px", padding: "12px 14px" }}>
                      <p style={{ margin: "0 0 4px", fontSize: "11px", color: "#4a6480", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        {item.label}
                      </p>
                      <p style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: item.color || "#e8f0f8" }}>
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Reasons */}
                {result.reasons?.length > 0 && (
                  <div>
                    <p style={{ margin: "0 0 12px", fontSize: "12px", fontWeight: 600, color: "#4a6480", textTransform: "uppercase", letterSpacing: "0.07em" }}>
                      Risk Reasons
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {result.reasons.map((reason, i) => (
                        <div key={i} style={{
                          display: "flex", alignItems: "flex-start", gap: "10px",
                          background: "#07111f", borderRadius: "8px", padding: "12px 14px",
                          borderLeft: `3px solid ${risk.accent}`,
                        }}>
                          <span style={{ fontSize: "12px", color: risk.accent, flexShrink: 0, marginTop: "1px" }}>
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <p style={{ margin: 0, fontSize: "13px", color: "#b0c4d8", lineHeight: 1.5 }}>{reason}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* No reasons = Low risk */}
                {(!result.reasons || result.reasons.length === 0) && (
                  <div style={{
                    background: "#07111f", borderRadius: "8px", padding: "16px",
                    borderLeft: "3px solid #1D9E75", textAlign: "center",
                  }}>
                    <p style={{ margin: 0, fontSize: "13px", color: "#1D9E75" }}>
                      ✓ No suspicious signals detected — transaction looks safe.
                    </p>
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
          div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
