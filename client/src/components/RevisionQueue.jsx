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
            <div className="topic-name">{s.topic}</div>
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
