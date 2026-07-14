import { useEffect, useState } from "react";
import { getReadiness } from "../api/api";

function ReadinessScore({ refreshKey }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    getReadiness().then((res) => setData(res.data));
  }, [refreshKey]);

  if (!data || data.readinessScore === 0) return null;

  return (
    <div
      style={{
        marginBottom: "2rem",
        paddingBottom: "1.5rem",
        borderBottom: "1px solid #e5e5e0",
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
        <span
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "2rem",
            fontWeight: 400,
          }}
        >
          {data.readinessScore}
        </span>
        <span
          style={{
            fontFamily: "Helvetica Neue, sans-serif",
            fontSize: "0.85rem",
            color: "#888",
          }}
        >
          / 100 readiness
        </span>
      </div>
      <div
        style={{
          display: "flex",
          gap: "16px",
          marginTop: "0.5rem",
          fontFamily: "Helvetica Neue, sans-serif",
          fontSize: "0.75rem",
          color: "#999",
        }}
      >
        <span>Mastery {data.breakdown.mastery}</span>
        <span>Coverage {data.breakdown.coverage}</span>
        <span>Consistency {data.breakdown.consistency}</span>
        <span>Volume {data.breakdown.volume}</span>
      </div>
    </div>
  );
}

export default ReadinessScore;
