import BASE_URL from "./config";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Field({ label, type = "text", placeholder, value, onChange }) {
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
          background: "#07111f", border: "1px solid #1e3352",
          borderRadius: "10px", color: "#e8f0f8",
          fontSize: "14px", outline: "none",
          transition: "border-color 0.15s", boxSizing: "border-box",
        }}
        onFocus={e => e.target.style.borderColor = "#378ADD"}
        onBlur={e => e.target.style.borderColor = "#1e3352"}
      />
    </div>
  );
}

export default function Register() {
  const navigate = useNavigate();

  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState("");
  const [loading, setLoading]   = useState(false);

  const validate = () => {
    if (!name.trim())     return "Full name is required.";
    if (!email.trim())    return "Email is required.";
    if (!email.includes("@")) return "Enter a valid email address.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    if (password !== confirm) return "Passwords do not match.";
    return "";
  };

  const handleRegister = async () => {
    const err = validate();
    if (err) { setError(err); return; }
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/register`, { name, email, password });
      setSuccess(res.data.message);
      // Redirect to login after 1.5 seconds
      setTimeout(() => navigate("/login"), 1500);
    } catch (e) {
      setError(e.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#060e1a",
      color: "#e8f0f8", fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "24px",
    }}>
      <div style={{ width: "100%", maxWidth: "420px" }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{
            width: "48px", height: "48px", borderRadius: "12px",
            background: "linear-gradient(135deg, #E24B4A, #9b1c1c)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "22px", margin: "0 auto 16px",
          }}>🛡</div>
          <h1 style={{ margin: "0 0 6px", fontSize: "24px", fontWeight: 800, letterSpacing: "-0.02em" }}>
            Create Account
          </h1>
          <p style={{ margin: 0, fontSize: "14px", color: "#4a6480" }}>
            Join FraudGuard to monitor transactions
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: "#0a1628", border: "1px solid #1e3352",
          borderRadius: "16px", padding: "32px",
        }}>
          <Field label="Full Name"        placeholder="e.g. Ali Hassan"         value={name}     onChange={e => { setName(e.target.value);     setError(""); }} />
          <Field label="Email"            placeholder="e.g. ali@example.com"    value={email}    onChange={e => { setEmail(e.target.value);    setError(""); }} />
          <Field label="Password"         placeholder="Min 6 characters"        value={password} onChange={e => { setPassword(e.target.value); setError(""); }} type="password" />
          <Field label="Confirm Password" placeholder="Repeat your password"    value={confirm}  onChange={e => { setConfirm(e.target.value);  setError(""); }} type="password" />

          {/* Error message */}
          {error && (
            <div style={{
              background: "#FCEBEB", border: "1px solid #E24B4A40",
              borderRadius: "8px", padding: "10px 14px",
              fontSize: "13px", color: "#791F1F", marginBottom: "16px",
            }}>⚠ {error}</div>
          )}

          {/* Success message */}
          {success && (
            <div style={{
              background: "#EAF3DE", border: "1px solid #1D9E7540",
              borderRadius: "8px", padding: "10px 14px",
              fontSize: "13px", color: "#27500A", marginBottom: "16px",
            }}>✓ {success} Redirecting to login…</div>
          )}

          <button
            onClick={handleRegister}
            disabled={loading}
            style={{
              width: "100%", padding: "12px", fontSize: "14px", fontWeight: 600,
              background: loading ? "#1e3352" : "#378ADD",
              color: loading ? "#4a6480" : "#fff",
              border: "none", borderRadius: "10px",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background 0.15s",
            }}
          >
            {loading ? "Creating Account…" : "Create Account"}
          </button>
        </div>

        {/* Link to Login */}
        <p style={{ textAlign: "center", marginTop: "20px", fontSize: "14px", color: "#4a6480" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#378ADD", textDecoration: "none", fontWeight: 600 }}>
            Login here
          </Link>
        </p>

      </div>

      <style>{`* { box-sizing: border-box; } input::placeholder { color: #2a3f58; }`}</style>
    </div>
  );
}