import { useState, useEffect, useRef } from "react";
import Uploader from "./components/Uploader";
import RiskDashboard from "./components/RiskDashboard";
import ClauseList from "./components/ClauseList";
import { analyzeContract } from "./services/groq";

function GridBackground() {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
      backgroundImage: `
        linear-gradient(rgba(0,200,160,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,200,160,0.03) 1px, transparent 1px)
      `,
      backgroundSize: "40px 40px",
    }}>
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at 20% 50%, rgba(0,200,160,0.04) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(248,113,113,0.04) 0%, transparent 60%)",
      }} />
    </div>
  );
}

export default function App() {
  const [clauses, setClauses] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fileName, setFileName] = useState("");
  const [analysisTime, setAnalysisTime] = useState(null);
  const startTime = useRef();

  async function handleTextExtracted(text, name) {
    setIsLoading(true);
    setError(null);
    setClauses(null);
    setFileName(name || "document.pdf");
    startTime.current = Date.now();
    try {
      const result = await analyzeContract(text);
      setAnalysisTime(((Date.now() - startTime.current) / 1000).toFixed(1));
      setClauses(result);
    } catch (err) {
      setError("Analysis failed. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const dateStr = now.toLocaleDateString([], { day: "2-digit", month: "short", year: "numeric" });

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <GridBackground />
      <div style={{ position: "relative", zIndex: 1 }}>

        <header style={{
          height: "48px", padding: "0 24px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          borderBottom: "1px solid var(--border)",
          background: "rgba(6,10,10,0.95)", backdropFilter: "blur(20px)",
          position: "sticky", top: 0, zIndex: 100,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{
                width: "22px", height: "22px", borderRadius: "5px",
                background: "var(--teal)", display: "flex",
                alignItems: "center", justifyContent: "center",
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                  stroke="#060a0a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
              </div>
              <span style={{ fontWeight: 700, fontSize: "13px", color: "var(--text)", letterSpacing: "0.5px" }}>
                CONTRACT<span style={{ color: "var(--teal)" }}>SCAN</span>
              </span>
            </div>
            <div style={{ height: "14px", width: "1px", background: "var(--border2)" }} />
            <span style={{ fontSize: "11px", color: "var(--text3)", fontWeight: 400 }}>
              AI Risk Analysis Platform
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <span style={{ fontSize: "11px", color: "var(--text3)", fontFamily: "monospace" }}>
              {dateStr} · {timeStr}
            </span>
            <div style={{ height: "14px", width: "1px", background: "var(--border2)" }} />
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--teal)", animation: "pulse 2s infinite" }} />
              <span style={{ fontSize: "11px", color: "var(--text2)", fontWeight: 500 }}>SYSTEM ONLINE</span>
            </div>
          </div>
        </header>

        <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px 60px" }}>

          {!clauses && !isLoading && (
            <div style={{ animation: "fadeUp 0.5s ease forwards" }}>
              <div style={{ padding: "64px 0 40px" }}>
                <p style={{ fontSize: "11px", fontWeight: 600, color: "var(--teal)", letterSpacing: "3px", marginBottom: "16px" }}>
                  AI-POWERED · REAL-TIME · FREE
                </p>
                <h1 style={{
                  fontSize: "52px", fontWeight: 800, lineHeight: 1.0,
                  letterSpacing: "-2px", color: "var(--text)", marginBottom: "16px",
                }}>
                  Contract Risk<br />
                  <span style={{ color: "var(--teal)" }}>Intelligence</span>
                </h1>
                <p style={{ fontSize: "15px", color: "var(--text2)", maxWidth: "420px", lineHeight: 1.7 }}>
                  Upload any legal document and get an instant AI-powered risk breakdown — every clause analyzed, scored, and explained in plain English.
                </p>

                <div style={{ display: "flex", gap: "32px", marginTop: "40px" }}>
                  {[
                    { value: "< 20s", label: "Analysis time" },
                    { value: "100%", label: "Client-side" },
                    { value: "LLaMA 3.3", label: "AI model" },
                  ].map(s => (
                    <div key={s.label}>
                      <p style={{ fontSize: "22px", fontWeight: 800, color: "var(--teal)", letterSpacing: "-0.5px" }}>{s.value}</p>
                      <p style={{ fontSize: "11px", color: "var(--text3)", marginTop: "2px" }}>{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Uploader onTextExtracted={handleTextExtracted} isLoading={isLoading} />

              {error && (
                <div style={{
                  marginTop: "12px", background: "var(--red-dim)",
                  border: "1px solid var(--border-red)", borderRadius: "8px",
                  padding: "12px 16px", color: "var(--red)", fontSize: "13px",
                }}>
                  {error}
                </div>
              )}
            </div>
          )}

          {isLoading && (
            <div style={{ paddingTop: "120px", textAlign: "center", animation: "fadeIn 0.3s ease forwards" }}>
              <div style={{
                width: "48px", height: "48px", margin: "0 auto 24px",
                border: "2px solid var(--border2)",
                borderTop: "2px solid var(--teal)",
                borderRadius: "50%", animation: "spin 0.8s linear infinite",
              }} />
              <p style={{ color: "var(--teal)", fontWeight: 700, fontSize: "16px", marginBottom: "8px", letterSpacing: "1px" }}>
                ANALYZING DOCUMENT
              </p>
              <p style={{ color: "var(--text3)", fontSize: "12px", marginBottom: "32px" }}>
                Extracting clauses · Assessing risk · Generating insights
              </p>
              <div style={{ display: "flex", justifyContent: "center", gap: "6px" }}>
                {["Clause extraction", "Risk scoring", "Plain English", "Recommendations"].map((s, i) => (
                  <div key={s} style={{
                    fontSize: "11px", padding: "4px 10px", borderRadius: "4px",
                    border: "1px solid var(--border2)", color: "var(--text3)",
                    animation: `pulse 1.5s infinite ${i * 0.3}s`,
                  }}>{s}</div>
                ))}
              </div>
            </div>
          )}

          {clauses && !isLoading && (
            <div style={{ animation: "fadeUp 0.4s ease forwards" }}>
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "16px 0 16px", borderBottom: "1px solid var(--border)",
                marginBottom: "16px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <div>
                    <p style={{ fontSize: "18px", fontWeight: 800, color: "var(--text)", letterSpacing: "-0.5px" }}>
                      Risk Analysis Dashboard
                    </p>
                    <p style={{ fontSize: "11px", color: "var(--text3)", marginTop: "2px" }}>
                      {fileName} · {clauses.length} clauses · analyzed in {analysisTime}s
                    </p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 12px", borderRadius: "6px", border: "1px solid var(--border)", background: "var(--card)" }}>
                    <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--teal)" }} />
                    <span style={{ fontSize: "11px", color: "var(--text2)" }}>Analysis complete</span>
                  </div>
                  <button
                    onClick={() => { setClauses(null); setError(null); setFileName(""); }}
                    style={{
                      fontSize: "11px", fontWeight: 600, padding: "6px 14px",
                      borderRadius: "6px", border: "1px solid var(--border2)",
                      background: "transparent", color: "var(--teal)",
                      letterSpacing: "0.5px", transition: "all 0.15s",
                    }}
                    onMouseOver={e => e.currentTarget.style.background = "var(--teal-dim)"}
                    onMouseOut={e => e.currentTarget.style.background = "transparent"}
                  >
                    NEW ANALYSIS
                  </button>
                </div>
              </div>

              <RiskDashboard clauses={clauses} />

              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                borderBottom: "1px solid var(--border)", paddingBottom: "10px", margin: "20px 0 12px",
              }}>
                <p style={{ fontSize: "11px", fontWeight: 600, color: "var(--text2)", letterSpacing: "1px" }}>
                  CLAUSE BREAKDOWN
                </p>
                <p style={{ fontSize: "11px", color: "var(--text3)" }}>Click to expand</p>
              </div>
              <ClauseList clauses={clauses} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}