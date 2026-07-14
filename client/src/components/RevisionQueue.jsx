import { useEffect, useState } from "react";
import { getScores, markReviewed } from "../api/api";

function RevisionQueue() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadScores = () => {
    setLoading(true);
    getScores()
      .then((res) => setScores(res.data))
      .catch((err) => console.error("Failed to load scores:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadScores();
  }, []);

  const handleReview = async (topic) => {
    await markReviewed(topic);
    loadScores();
  };

  if (loading) return <p className="subtitle">Loading revision queue...</p>;
  if (scores.length === 0)
    return <p className="subtitle">No attempts logged yet.</p>;

  return (
    <div>
      {scores.map((s) => (
        <div className="queue-item" key={s.topic}>
          <div>
            <div className="topic-name">
              {s.topic}
              <span
                style={{
                  marginLeft: "10px",
                  fontSize: "0.7rem",
                  fontFamily: "Helvetica Neue, sans-serif",
                  fontWeight: 600,
                  padding: "2px 8px",
                  borderRadius: "3px",
                  color:
                    s.masteryLevel === "Strong"
                      ? "#2d6a4f"
                      : s.masteryLevel === "Intermediate"
                      ? "#966b1f"
                      : "#a13d2c",
                  background:
                    s.masteryLevel === "Strong"
                      ? "#e6f2ec"
                      : s.masteryLevel === "Intermediate"
                      ? "#faf1e0"
                      : "#f6e5e1",
                }}
              >
                {s.masteryLevel}
              </span>
            </div>
            <div className="topic-meta">
              Avg hints: {s.avgHints} · Time ratio: {s.avgTimeRatio}x · Last
              practiced: {new Date(s.lastPracticed).toLocaleDateString()}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div className="score-badge">{s.weaknessScore}</div>
            <button
              onClick={() => handleReview(s.topic)}
              style={{
                marginTop: 0,
                padding: "0.4rem 0.8rem",
                fontSize: "0.8rem",
              }}
            >
              Mark reviewed
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default RevisionQueue;
