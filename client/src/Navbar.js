import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  // Read user info from localStorage
  // This is set when user logs in (in Login.js)
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isLoggedIn = !!user;

  const handleLogout = () => {
    // Clear everything from localStorage — user is now logged out
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login"); // send to login page
  };

  const linkStyle = {
    color: "white",
    textDecoration: "none",
    fontWeight: "bold",
    fontSize: "14px",
  };

  return (
    <nav style={{
      backgroundColor: "#07111f",
      borderBottom: "1px solid #1e3352",
      padding: "0 30px",
      height: "60px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}>

      {/* Left — Logo */}
      <Link to="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
        <div style={{
          width: "30px", height: "30px", borderRadius: "7px",
          background: "linear-gradient(135deg, #E24B4A, #9b1c1c)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "14px",
        }}>🛡</div>
        <span style={{ color: "white", fontWeight: 700, fontSize: "15px" }}>FraudGuard</span>
      </Link>

      {/* Right — Nav links */}
      <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>

        {isLoggedIn ? (
          <>
            {/* Show dashboard link only for admin */}
            {user.role === "admin" && (
              <Link to="/dashboard" style={linkStyle}>Dashboard</Link>
            )}

            <Link to="/simulate"        style={linkStyle}>Simulator</Link>
            <Link to="/history"         style={linkStyle}>History</Link>
            <Link to="/add-transaction" style={linkStyle}>Add Transaction</Link>

            {/* User info + logout */}
            <div style={{
              display: "flex", alignItems: "center", gap: "12px",
              borderLeft: "1px solid #1e3352", paddingLeft: "16px",
            }}>
              {/* Show who is logged in */}
              <div style={{ textAlign: "right" }}>
                <p style={{ margin: 0, fontSize: "13px", fontWeight: 600, color: "#e8f0f8" }}>
                  {user.name}
                </p>
                <p style={{ margin: 0, fontSize: "11px", color: user.role === "admin" ? "#E24B4A" : "#1D9E75" }}>
                  {user.role === "admin" ? "Admin" : "User"}
                </p>
              </div>

              {/* Logout button */}
              <button
                onClick={handleLogout}
                style={{
                  padding: "7px 16px", fontSize: "13px", fontWeight: 600,
                  background: "transparent", color: "#E24B4A",
                  border: "1px solid #E24B4A40", borderRadius: "8px",
                  cursor: "pointer", transition: "all 0.15s",
                }}
                onMouseEnter={e => { e.target.style.background = "#E24B4A20"; }}
                onMouseLeave={e => { e.target.style.background = "transparent"; }}
              >
                Logout
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Not logged in — show login/register */}
            <Link to="/login" style={linkStyle}>Login</Link>
            <Link to="/register" style={{
              ...linkStyle,
              background: "#378ADD",
              padding: "7px 16px",
              borderRadius: "8px",
              fontSize: "13px",
            }}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}