import { useState } from "react";

const RISK = {
  high:   { color: "#f87171", bg: "rgba(248,113,113,0.06)", border: "rgba(248,113,113,0.2)", label: "HIGH" },
  medium: { color: "#fbbf24", bg: "rgba(251,191,36,0.06)",  border: "rgba(251,191,36,0.2)",  label: "MED" },
  low:    { color: "#00c8a0", bg: "rgba(0,200,160,0.06)",   border: "rgba(0,200,160,0.2)",   label: "LOW" },
};

const CATEGORIES = ["All","IP","Liability","Termination","Payment","Confidentiality","Non-Compete","Other"];
const RISKS = ["All","high","medium","low"];

export default function ClauseList({ clauses }) {
  const [cat, setCat] = useState("All");
  const [risk, setRisk] = useState("All");
  const [expanded, setExpanded] = useState(null);

  const filtered = clauses.filter(c =>
    (cat === "All" || c.category === cat) &&
    (risk === "All" || c.risk_level === risk)
  );

  return (
    <div>
      <div style={{
        display: "flex", gap: "8px", alignItems: "center",
        marginBottom: "10px", flexWrap: "wrap",
        background: "var(--card)", border: "1px solid var(--border)",
        borderRadius: "8px", padding: "10px 14px",
      }}>
        <span style={{ fontSize: "10px", color: "var(--text3)", fontWeight: 600, letterSpacing: "1px", marginRight: "4px" }}>
          FILTER
        </span>
        <div style={{ width: "1px", height: "14px", background: "var(--border2)", marginRight: "4px" }} />
        {CATEGORIES.map(opt => (
          <button key={opt} onClick={() => setCat(opt)} style={{
            fontSize: "11px", fontWeight: 500, padding: "3px 10px", borderRadius: "4px",
            border: `1px solid ${cat === opt ? "var(--teal)" : "var(--border2)"}`,
            background: cat === opt ? "var(--teal-dim)" : "transparent",
            color: cat === opt ? "var(--teal)" : "var(--text3)",
            transition: "all 0.12s",
          }}>{opt}</button>
        ))}
        <div style={{ width: "1px", height: "14px", background: "var(--border2)", margin: "0 4px" }} />
        {RISKS.map(opt => (
          <button key={opt} onClick={() => setRisk(opt)} style={{
            fontSize: "11px", fontWeight: 500, padding: "3px 10px", borderRadius: "4px",
            border: `1px solid ${risk === opt ? (RISK[opt]?.color || "var(--teal)") : "var(--border2)"}`,
            background: risk === opt ? (opt === "All" ? "var(--teal-dim)" : RISK[opt]?.bg) : "transparent",
            color: risk === opt ? (RISK[opt]?.color || "var(--teal)") : "var(--text3)",
            transition: "all 0.12s",
          }}>{opt.toUpperCase()}</button>
        ))}
        <span style={{ marginLeft: "auto", fontSize: "11px", color: "var(--text3)", fontFamily: "monospace" }}>
          {filtered.length}/{clauses.length} clauses
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        {filtered.map((clause, i) => {
          const s = RISK[clause.risk_level] || RISK.low;
          const isOpen = expanded === i;
          return (
            <div key={i}
              onClick={() => setExpanded(isOpen ? null : i)}
              style={{
                background: isOpen ? "var(--card2)" : "var(--card)",
                border: `1px solid ${isOpen ? s.border : "var(--border)"}`,
                borderLeft: `2px solid ${isOpen ? s.color : "var(--border2)"}`,
                borderRadius: "8px", padding: "12px 16px",
                cursor: "pointer", transition: "all 0.15s",
              }}
              onMouseOver={e => { if (!isOpen) e.currentTarget.style.borderLeftColor = s.color; }}
              onMouseOut={e => { if (!isOpen) e.currentTarget.style.borderLeftColor = "var(--border2)"; }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{
                  fontSize: "9px", fontWeight: 800, letterSpacing: "1px",
                  padding: "2px 7px", borderRadius: "3px",
                  background: s.bg, color: s.color,
                  border: `1px solid ${s.border}`, flexShrink: 0,
                }}>
                  {s.label}
                </span>
                <span style={{
                  fontSize: "10px", fontWeight: 500, color: "var(--text3)",
                  padding: "2px 7px", borderRadius: "3px",
                  border: "1px solid var(--border2)", flexShrink: 0,
                }}>
                  {clause.category}
                </span>
                <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)", letterSpacing: "-0.2px" }}>
                  {clause.title}
                </span>
                {!isOpen && (
                  <span style={{ fontSize: "12px", color: "var(--text3)", marginLeft: "8px", fontWeight: 400 }}>
                    — {clause.plain_english?.slice(0, 80)}...
                  </span>
                )}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                  stroke="var(--text3)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  style={{ marginLeft: "auto", flexShrink: 0, transform: isOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }}>
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </div>

              {isOpen && (
                <div style={{ marginTop: "14px", paddingTop: "14px", borderTop: `1px solid ${s.border}`, animation: "fadeUp 0.2s ease forwards" }}>
                  <p style={{ fontSize: "13px", color: "var(--text2)", lineHeight: 1.7, marginBottom: "14px" }}>
                    {clause.plain_english}
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    <div style={{
                      background: "var(--bg2)", border: "1px solid var(--border)",
                      borderRadius: "6px", padding: "12px 14px",
                    }}>
                      <p style={{ fontSize: "9px", fontWeight: 700, color: "var(--text3)", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "8px" }}>
                        Original Text
                      </p>
                      <p style={{ fontSize: "12px", color: "var(--text3)", fontStyle: "italic", lineHeight: 1.65 }}>
                        "{clause.original_text}"
                      </p>
                    </div>
                    <div style={{
                      background: "rgba(0,200,160,0.04)", border: "1px solid rgba(0,200,160,0.15)",
                      borderRadius: "6px", padding: "12px 14px",
                    }}>
                      <p style={{ fontSize: "9px", fontWeight: 700, color: "var(--text3)", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "8px" }}>
                        Recommended Action
                      </p>
                      <p style={{ fontSize: "12px", color: "var(--teal)", lineHeight: 1.65, fontWeight: 500 }}>
                        {clause.recommended_action}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}