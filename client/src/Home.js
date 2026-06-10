import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const features = [
    {
      icon: "📊",
      title: "Real-Time Analytics",
      desc: "Live pie charts, bar graphs, and node distribution updated every 5 seconds.",
      accent: "#378ADD",
    },
    {
      icon: "🚨",
      title: "Instant Fraud Alerts",
      desc: "Suspicious transactions flagged immediately with risk scoring and visual cues.",
      accent: "#E24B4A",
    },
    {
      icon: "🧠",
      title: "AI Risk Explanation",
      desc: "Every flagged transaction comes with an AI-generated reasoning breakdown.",
      accent: "#EF9F27",
    },
    {
      icon: "📄",
      title: "PDF Report Export",
      desc: "One-click export of full analytics and node statistics to a PDF report.",
      accent: "#1D9E75",
    },
    {
      icon: "🔍",
      title: "Smart Filtering",
      desc: "Search by sender and filter by risk level — High, Medium, or Low — instantly.",
      accent: "#9b6dff",
    },
    {
      icon: "⚡",
      title: "Transaction Simulator",
      desc: "Inject test transactions and see risk scores calculated in real time.",
      accent: "#3dd6f5",
    },
  ];

  const steps = [
    { num: "01", label: "Receive", desc: "Transaction enters the pipeline" },
    { num: "02", label: "Analyze", desc: "Risk rules calculate a score" },
    { num: "03", label: "Store", desc: "Saved to MongoDB instantly" },
    { num: "04", label: "Monitor", desc: "Dashboard reflects live state" },
  ];

  const tech = ["React", "Node.js", "Express.js", "MongoDB", "Chart.js", "jsPDF"];

  return (
    <div style={{
      minHeight: "100vh",
      background: "#060e1a",
      color: "#e8f0f8",
      fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
      overflowX: "hidden",
    }}>

      {/* NAV */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "#07111fcc",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid #1e3352",
        padding: "0 48px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: "64px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "30px", height: "30px", borderRadius: "7px",
            background: "linear-gradient(135deg, #E24B4A, #9b1c1c)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "15px",
          }}>🛡</div>
          <span style={{ fontWeight: 700, fontSize: "15px", letterSpacing: "-0.01em" }}>FraudGuard</span>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button onClick={() => navigate("/dashboard")} style={navBtnStyle("#378ADD")}>
            Dashboard
          </button>
          <button onClick={() => navigate("/simulate")} style={navBtnStyle("#1D9E75")}>
            Simulator
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        position: "relative",
        padding: "100px 48px 80px",
        textAlign: "center",
        overflow: "hidden",
      }}>
        {/* Background glow blobs */}
        <div style={{
          position: "absolute", top: "-80px", left: "50%", transform: "translateX(-50%)",
          width: "700px", height: "400px",
          background: "radial-gradient(ellipse, #E24B4A18 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", top: "60px", left: "10%",
          width: "300px", height: "300px",
          background: "radial-gradient(circle, #378ADD12, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", top: "60px", right: "10%",
          width: "300px", height: "300px",
          background: "radial-gradient(circle, #1D9E7512, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          background: "#E24B4A18", border: "1px solid #E24B4A40",
          borderRadius: "20px", padding: "6px 16px",
          fontSize: "12px", fontWeight: 600, color: "#E24B4A",
          letterSpacing: "0.06em", textTransform: "uppercase",
          marginBottom: "28px",
        }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#E24B4A", display: "inline-block" }} />
          Real-time Fraud Intelligence
        </div>

        <h1 style={{
          fontSize: "clamp(36px, 5vw, 64px)",
          fontWeight: 800,
          margin: "0 auto 24px",
          maxWidth: "900px",
          lineHeight: 1.1,
          letterSpacing: "-0.03em",
          background: "linear-gradient(135deg, #e8f0f8 30%, #7a8fa6)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}>
          Fraud Detection &amp;<br />Transaction Monitoring
        </h1>

        <p style={{
          fontSize: "18px", color: "#7a8fa6", maxWidth: "620px",
          margin: "0 auto 48px", lineHeight: 1.7,
        }}>
          Detect suspicious transactions, monitor fraud analytics, generate reports,
          and test transactions using AI-powered risk analysis.
        </p>

        <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => navigate("/dashboard")} style={{
            padding: "14px 32px", fontSize: "15px", fontWeight: 600,
            background: "#378ADD", color: "#fff",
            border: "none", borderRadius: "10px", cursor: "pointer",
            letterSpacing: "-0.01em",
            transition: "all 0.15s",
          }}
            onMouseEnter={e => e.target.style.background = "#2563eb"}
            onMouseLeave={e => e.target.style.background = "#378ADD"}
          >
            Open Dashboard →
          </button>
          <button onClick={() => navigate("/simulate")} style={{
            padding: "14px 32px", fontSize: "15px", fontWeight: 600,
            background: "transparent", color: "#e8f0f8",
            border: "1px solid #1e3352", borderRadius: "10px", cursor: "pointer",
            letterSpacing: "-0.01em",
            transition: "all 0.15s",
          }}
            onMouseEnter={e => { e.target.style.borderColor = "#1D9E75"; e.target.style.color = "#1D9E75"; }}
            onMouseLeave={e => { e.target.style.borderColor = "#1e3352"; e.target.style.color = "#e8f0f8"; }}
          >
            Try Simulator
          </button>
        </div>
      </section>

      {/* STATS BAR */}
      <section style={{
        margin: "0 48px 80px",
        background: "#0a1628",
        border: "1px solid #1e3352",
        borderRadius: "16px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
        overflow: "hidden",
      }}>
        {[
          { val: "24/7", label: "Fraud Monitoring", accent: "#E24B4A" },
          { val: "< 1s", label: "Detection Speed", accent: "#378ADD" },
          { val: "AI", label: "Risk Scoring Engine", accent: "#EF9F27" },
          { val: "PDF", label: "Instant Reports", accent: "#1D9E75" },
        ].map((s, i, arr) => (
          <div key={s.label} style={{
            padding: "32px 28px",
            borderRight: i < arr.length - 1 ? "1px solid #1e3352" : "none",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", inset: 0,
              background: `radial-gradient(ellipse at 50% 0%, ${s.accent}12, transparent 70%)`,
              pointerEvents: "none",
            }} />
            <p style={{ margin: "0 0 6px", fontSize: "32px", fontWeight: 800, color: s.accent, letterSpacing: "-0.03em" }}>
              {s.val}
            </p>
            <p style={{ margin: 0, fontSize: "13px", color: "#7a8fa6" }}>{s.label}</p>
          </div>
        ))}
      </section>

      {/* FEATURES */}
      <section style={{ padding: "0 48px 80px" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <p style={{ margin: "0 0 8px", fontSize: "12px", fontWeight: 600, color: "#378ADD", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Capabilities
          </p>
          <h2 style={{ margin: 0, fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 700, letterSpacing: "-0.02em" }}>
            Key Features
          </h2>
        </div>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "16px",
        }}>
          {features.map((f) => (
            <div key={f.title} style={{
              background: "#0a1628",
              border: "1px solid #1e3352",
              borderRadius: "14px",
              padding: "24px",
              transition: "border-color 0.2s",
              cursor: "default",
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = f.accent + "60"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "#1e3352"}
            >
              <div style={{
                width: "40px", height: "40px", borderRadius: "10px",
                background: f.accent + "18",
                border: `1px solid ${f.accent}30`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "20px", marginBottom: "16px",
              }}>{f.icon}</div>
              <h3 style={{ margin: "0 0 8px", fontSize: "15px", fontWeight: 600, letterSpacing: "-0.01em" }}>
                {f.title}
              </h3>
              <p style={{ margin: 0, fontSize: "13px", color: "#7a8fa6", lineHeight: 1.6 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: "0 48px 80px" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <p style={{ margin: "0 0 8px", fontSize: "12px", fontWeight: 600, color: "#EF9F27", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Pipeline
          </p>
          <h2 style={{ margin: 0, fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 700, letterSpacing: "-0.02em" }}>
            How It Works
          </h2>
        </div>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "0",
          background: "#0a1628",
          border: "1px solid #1e3352",
          borderRadius: "16px",
          overflow: "hidden",
        }}>
          {steps.map((s, i) => (
            <div key={s.num} style={{
              padding: "32px 28px",
              borderRight: i < steps.length - 1 ? "1px solid #1e3352" : "none",
              position: "relative",
            }}>
              <p style={{ margin: "0 0 12px", fontSize: "40px", fontWeight: 800, color: "#1e3352", letterSpacing: "-0.04em", lineHeight: 1 }}>
                {s.num}
              </p>
              <h3 style={{ margin: "0 0 6px", fontSize: "16px", fontWeight: 600 }}>{s.label}</h3>
              <p style={{ margin: 0, fontSize: "13px", color: "#7a8fa6", lineHeight: 1.5 }}>{s.desc}</p>
              {i < steps.length - 1 && (
                <div style={{
                  position: "absolute", right: "-10px", top: "50%", transform: "translateY(-50%)",
                  fontSize: "18px", color: "#1e3352", zIndex: 1,
                }}>›</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* TECH STACK */}
      <section style={{ padding: "0 48px 80px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <p style={{ margin: "0 0 8px", fontSize: "12px", fontWeight: 600, color: "#1D9E75", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Built With
          </p>
          <h2 style={{ margin: 0, fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 700, letterSpacing: "-0.02em" }}>
            Technologies
          </h2>
        </div>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          {tech.map((t) => (
            <div key={t} style={{
              background: "#0a1628",
              border: "1px solid #1e3352",
              borderRadius: "10px",
              padding: "10px 22px",
              fontSize: "14px",
              fontWeight: 500,
              color: "#7a8fa6",
              transition: "all 0.15s",
              cursor: "default",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#378ADD50"; e.currentTarget.style.color = "#e8f0f8"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#1e3352"; e.currentTarget.style.color = "#7a8fa6"; }}
            >{t}</div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "0 48px 80px" }}>
        <div style={{
          background: "#0a1628",
          border: "1px solid #1e3352",
          borderRadius: "20px",
          padding: "64px 48px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse at 50% 0%, #E24B4A0f, transparent 60%)",
            pointerEvents: "none",
          }} />
          <p style={{ margin: "0 0 8px", fontSize: "12px", fontWeight: 600, color: "#E24B4A", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Get Started
          </p>
          <h2 style={{ margin: "0 0 16px", fontSize: "clamp(24px, 3vw, 40px)", fontWeight: 700, letterSpacing: "-0.02em" }}>
            Ready to Explore?
          </h2>
          <p style={{ margin: "0 0 40px", fontSize: "16px", color: "#7a8fa6", maxWidth: "480px", marginLeft: "auto", marginRight: "auto" }}>
            Monitor transactions, detect fraud, and analyze risk in real time.
          </p>
          <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => navigate("/dashboard")} style={{
              padding: "14px 36px", fontSize: "15px", fontWeight: 600,
              background: "#E24B4A", color: "#fff",
              border: "none", borderRadius: "10px", cursor: "pointer",
              transition: "background 0.15s",
            }}
              onMouseEnter={e => e.target.style.background = "#c73b3a"}
              onMouseLeave={e => e.target.style.background = "#E24B4A"}
            >
              Launch Dashboard →
            </button>
            <button onClick={() => navigate("/simulate")} style={{
              padding: "14px 36px", fontSize: "15px", fontWeight: 600,
              background: "transparent", color: "#e8f0f8",
              border: "1px solid #1e3352", borderRadius: "10px", cursor: "pointer",
              transition: "all 0.15s",
            }}
              onMouseEnter={e => { e.target.style.borderColor = "#1D9E75"; e.target.style.color = "#1D9E75"; }}
              onMouseLeave={e => { e.target.style.borderColor = "#1e3352"; e.target.style.color = "#e8f0f8"; }}
            >
              Try Simulator
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        borderTop: "1px solid #1e3352",
        padding: "24px 48px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "12px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{
            width: "24px", height: "24px", borderRadius: "6px",
            background: "linear-gradient(135deg, #E24B4A, #9b1c1c)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "12px",
          }}>🛡</div>
          <span style={{ fontSize: "13px", fontWeight: 600 }}>FraudGuard</span>
        </div>
        <p style={{ margin: 0, fontSize: "12px", color: "#4a6480" }}>
          Real-time fraud detection &amp; transaction monitoring system
        </p>
      </footer>

      <style>{`
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #07111f; }
        ::-webkit-scrollbar-thumb { background: #1e3352; border-radius: 3px; }
      `}</style>
    </div>
  );
}

function navBtnStyle(accent) {
  return {
    padding: "7px 18px",
    fontSize: "13px",
    fontWeight: 500,
    background: "transparent",
    border: `1px solid ${accent}40`,
    borderRadius: "8px",
    color: accent,
    cursor: "pointer",
  };
}

export default Home;
