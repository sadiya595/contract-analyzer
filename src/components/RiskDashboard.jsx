import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar } from "recharts";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: "#0c1212", border: "1px solid rgba(0,200,160,0.2)",
        borderRadius: "6px", padding: "7px 12px",
        fontSize: "12px", color: "#e2e8e8", fontWeight: 500,
      }}>
        {payload[0].name}: <span style={{ color: "#00c8a0" }}>{payload[0].value}</span>
      </div>
    );
  }
  return null;
};

export default function RiskDashboard({ clauses }) {
  const high = clauses.filter(c => c.risk_level === "high").length;
  const medium = clauses.filter(c => c.risk_level === "medium").length;
  const low = clauses.filter(c => c.risk_level === "low").length;
  const total = clauses.length;

  const riskScore = Math.round(((high * 3 + medium * 2 + low * 1) / (total * 3)) * 100);
  const scoreColor = riskScore >= 70 ? "#f87171" : riskScore >= 40 ? "#fbbf24" : "#00c8a0";
  const scoreLabel = riskScore >= 70 ? "HIGH RISK" : riskScore >= 40 ? "MODERATE" : "LOW RISK";

  const categoryMap = {};
  clauses.forEach(c => { categoryMap[c.category] = (categoryMap[c.category] || 0) + 1; });
  const categoryData = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));

  const riskData = [
    { name: "High", value: high },
    { name: "Medium", value: medium },
    { name: "Low", value: low },
  ].filter(d => d.value > 0);

  const RISK_COLORS = ["#f87171", "#fbbf24", "#00c8a0"];
  const CAT_COLORS = ["#00c8a0", "#00a882", "#008866", "#006644", "#00c8a0", "#00e5b8", "#80ffe8"];

  const radialData = [{ value: riskScore, fill: scoreColor }];

  return (
    <div style={{ animation: "fadeUp 0.4s ease forwards" }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "220px 1fr 1fr 1fr",
        gap: "12px",
        marginBottom: "12px",
      }}>
        <div style={{
          background: "var(--card)", border: `1px solid ${scoreColor}33`,
          borderRadius: "10px", padding: "20px",
          boxShadow: `0 0 24px ${scoreColor}18`,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        }}>
          <p style={{ fontSize: "10px", fontWeight: 600, color: "var(--text3)", letterSpacing: "1.5px", marginBottom: "12px", textTransform: "uppercase" }}>
            Risk Score
          </p>
          <ResponsiveContainer width={120} height={120}>
            <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%"
              data={radialData} startAngle={90} endAngle={90 - (riskScore / 100) * 360}>
              <RadialBar dataKey="value" cornerRadius={4} background={{ fill: "#1a2a2a" }} />
            </RadialBarChart>
          </ResponsiveContainer>
          <div style={{ marginTop: "-88px", marginBottom: "68px", textAlign: "center", zIndex: 1, position: "relative" }}>
            <p style={{ fontSize: "30px", fontWeight: 800, color: scoreColor, letterSpacing: "-1px", lineHeight: 1 }}>
              {riskScore}
            </p>
            <p style={{ fontSize: "9px", color: scoreColor, fontWeight: 700, letterSpacing: "1px", marginTop: "4px" }}>
              {scoreLabel}
            </p>
          </div>
        </div>

        {[
          { label: "Total Clauses", value: total, color: "var(--teal)", sub: "identified" },
          { label: "High Risk", value: high, color: "#f87171", sub: "require attention" },
          { label: "Medium Risk", value: medium, color: "#fbbf24", sub: "review recommended" },
        ].map(s => (
          <div key={s.label} style={{
            background: "var(--card)", border: "1px solid var(--border)",
            borderRadius: "10px", padding: "20px 24px",
            borderLeft: `2px solid ${s.color}`,
          }}>
            <p style={{ fontSize: "10px", fontWeight: 600, color: "var(--text3)", letterSpacing: "1.5px", marginBottom: "16px", textTransform: "uppercase" }}>
              {s.label}
            </p>
            <p style={{ fontSize: "42px", fontWeight: 800, color: s.color, letterSpacing: "-2px", lineHeight: 1 }}>
              {s.value}
            </p>
            <p style={{ fontSize: "11px", color: "var(--text3)", marginTop: "8px" }}>{s.sub}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "12px" }}>
        <div style={{
          background: "var(--card)", border: "1px solid var(--border)",
          borderRadius: "10px", padding: "20px",
        }}>
          <p style={{ fontSize: "10px", fontWeight: 600, color: "var(--text3)", letterSpacing: "1.5px", marginBottom: "4px", textTransform: "uppercase" }}>
            Risk Distribution
          </p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={riskData} cx="50%" cy="50%" innerRadius={45} outerRadius={70}
                paddingAngle={3} dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
                labelLine={{ stroke: "#4a5e5e", strokeWidth: 0.8 }}>
                {riskData.map((entry, i) => (
                  <Cell key={entry.name} fill={RISK_COLORS[i]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div style={{
          background: "var(--card)", border: "1px solid var(--border)",
          borderRadius: "10px", padding: "20px",
        }}>
          <p style={{ fontSize: "10px", fontWeight: 600, color: "var(--text3)", letterSpacing: "1.5px", marginBottom: "4px", textTransform: "uppercase" }}>
            By Category
          </p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={45} outerRadius={70}
                paddingAngle={3} dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
                labelLine={{ stroke: "#4a5e5e", strokeWidth: 0.8 }}>
                {categoryData.map((entry, i) => (
                  <Cell key={entry.name} fill={CAT_COLORS[i % CAT_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div style={{
          background: "var(--card)", border: "1px solid var(--border)",
          borderRadius: "10px", padding: "20px",
        }}>
          <p style={{ fontSize: "10px", fontWeight: 600, color: "var(--text3)", letterSpacing: "1.5px", marginBottom: "16px", textTransform: "uppercase" }}>
            Risk Breakdown
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {[
              { label: "High Risk", value: high, total, color: "#f87171" },
              { label: "Medium Risk", value: medium, total, color: "#fbbf24" },
              { label: "Low Risk", value: low, total, color: "#00c8a0" },
            ].map(b => (
              <div key={b.label}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span style={{ fontSize: "11px", color: "var(--text2)", fontWeight: 500 }}>{b.label}</span>
                  <span style={{ fontSize: "11px", color: b.color, fontWeight: 700 }}>
                    {b.total > 0 ? Math.round((b.value / b.total) * 100) : 0}%
                  </span>
                </div>
                <div style={{ height: "4px", background: "var(--bg3)", borderRadius: "2px", overflow: "hidden" }}>
                  <div style={{
                    height: "100%", borderRadius: "2px",
                    background: b.color,
                    width: `${b.total > 0 ? (b.value / b.total) * 100 : 0}%`,
                    boxShadow: `0 0 8px ${b.color}80`,
                    transition: "width 1s ease",
                  }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "24px", paddingTop: "16px", borderTop: "1px solid var(--border)" }}>
            <p style={{ fontSize: "10px", color: "var(--text3)", letterSpacing: "1px", marginBottom: "10px", textTransform: "uppercase" }}>
              Categories found
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {Object.keys(categoryMap).map(cat => (
                <span key={cat} style={{
                  fontSize: "10px", fontWeight: 500, padding: "3px 8px",
                  borderRadius: "4px", border: "1px solid var(--border2)",
                  color: "var(--teal)", background: "var(--teal-dim)",
                }}>
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}