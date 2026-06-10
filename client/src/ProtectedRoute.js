import { Navigate } from "react-router-dom";

// ─── How this works ───────────────────────────────────────
// Wrap any Route with <ProtectedRoute> to lock it behind login.
// If the user has a token in localStorage → show the page.
// If not → redirect to /login automatically.
//
// Usage in App.js:
//   <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
//
// For admin-only pages:
//   <Route path="/dashboard" element={<ProtectedRoute adminOnly={true}><Dashboard /></ProtectedRoute>} />
// ─────────────────────────────────────────────────────────

export default function ProtectedRoute({ children, adminOnly = false }) {
  const token = localStorage.getItem("token");
  const user  = JSON.parse(localStorage.getItem("user") || "null");

  // No token → not logged in → go to login page
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Admin-only page but user is not admin → go to their history
  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/history" replace />;
  }

  // All good → show the page
  return children;
}