import { BrowserRouter, Routes, Route } from "react-router-dom";

// Existing pages
import Home             from "./Home";
import Dashboard        from "./Dashboard";
import SimulateTransaction from "./SimulateTransaction";
import History          from "./History";
import AddTransaction   from "./AddTransaction";
import Navbar           from "./Navbar";

// New auth pages
import Login            from "./Login";
import Register         from "./Register";
import ProtectedRoute   from "./ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>

        {/* ── Public routes — anyone can visit ── */}
        <Route path="/"         element={<Home />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ── Protected routes — login required ── */}
        {/* adminOnly={true} means only admin can access, others get redirected */}
        <Route path="/dashboard" element={
          <ProtectedRoute adminOnly={true}>
            <Dashboard />
          </ProtectedRoute>
        } />

        <Route path="/simulate" element={
          <ProtectedRoute>
            <SimulateTransaction />
          </ProtectedRoute>
        } />

        <Route path="/history" element={
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        } />

        <Route path="/add-transaction" element={
          <ProtectedRoute>
            <AddTransaction />
          </ProtectedRoute>
        } />

      </Routes>
    </BrowserRouter>
  );
}

export default App;