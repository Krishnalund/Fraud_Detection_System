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

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Both email and password are required.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/login", { email, password });

      // ─── Save token and user info in localStorage ───────
      // This is the "wristband" — we store it so the user
      // stays logged in even if they refresh the page
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      // ────────────────────────────────────────────────────

      // Redirect based on role
      if (res.data.user.role === "admin") {
        navigate("/dashboard"); // admin goes to full dashboard
      } else {
        navigate("/history");   // regular user goes to their history
      }
    } catch (e) {
      setError(e.response?.data?.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Allow pressing Enter key to submit
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#060e1a",
      color: "#e8f0f8", fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "24px",
    }}>
      <div style={{ width: "100%", maxWidth: "400px" }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{
            width: "48px", height: "48px", borderRadius: "12px",
            background: "linear-gradient(135deg, #E24B4A, #9b1c1c)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "22px", margin: "0 auto 16px",
          }}>🛡</div>
          <h1 style={{ margin: "0 0 6px", fontSize: "24px", fontWeight: 800, letterSpacing: "-0.02em" }}>
            Welcome Back
          </h1>
          <p style={{ margin: 0, fontSize: "14px", color: "#4a6480" }}>
            Login to your FraudGuard account
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: "#0a1628", border: "1px solid #1e3352",
          borderRadius: "16px", padding: "32px",
        }}>
          <Field
            label="Email" placeholder="your@email.com"
            value={email} onChange={e => { setEmail(e.target.value); setError(""); }}
          />
          <div onKeyDown={handleKeyDown}>
            <Field
              label="Password" type="password" placeholder="Your password"
              value={password} onChange={e => { setPassword(e.target.value); setError(""); }}
            />
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background: "#FCEBEB", border: "1px solid #E24B4A40",
              borderRadius: "8px", padding: "10px 14px",
              fontSize: "13px", color: "#791F1F", marginBottom: "16px",
            }}>⚠ {error}</div>
          )}

          <button
            onClick={handleLogin}
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
            {loading ? "Logging in…" : "Login →"}
          </button>
        </div>

        {/* Link to Register */}
        <p style={{ textAlign: "center", marginTop: "20px", fontSize: "14px", color: "#4a6480" }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "#378ADD", textDecoration: "none", fontWeight: 600 }}>
            Register here
          </Link>
        </p>

      </div>

      <style>{`* { box-sizing: border-box; } input::placeholder { color: #2a3f58; }`}</style>
    </div>
  );
}