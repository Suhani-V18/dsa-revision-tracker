import { useState } from "react";
import { reviewCode } from "../api/api";

function CodeReview() {
  const [code, setCode] = useState("");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const [feedback, setFeedback] = useState("");
  const [similarProblems, setSimilarProblems] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleReview = async () => {
    if (!code || !topic) return;
    setLoading(true);
    setFeedback("");
    setSimilarProblems([]);
    try {
      const res = await reviewCode({ code, topic, difficulty });
      setFeedback(res.data.feedback);
      setSimilarProblems(res.data.similarProblems || []);
    } catch (err) {
      setFeedback("Review failed. Try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <span className="section-label">Get hint-based code review</span>

      <label>Topic</label>
      <select value={topic} onChange={(e) => setTopic(e.target.value)}>
        <option value="">Select a topic</option>
        <option value="Array">Array</option>
        <option value="String">String</option>
        <option value="Linked List">Linked List</option>
        <option value="Stack">Stack</option>
        <option value="Tree">Tree</option>
        <option value="Graph">Graph</option>
        <option value="DP">DP</option>
        <option value="Greedy">Greedy</option>
        <option value="Backtracking">Backtracking</option>
        <option value="Binary Search">Binary Search</option>
      </select>

      <label>Difficulty</label>
      <select
        value={difficulty}
        onChange={(e) => setDifficulty(e.target.value)}
      >
        <option value="Easy">Easy</option>
        <option value="Medium">Medium</option>
        <option value="Hard">Hard</option>
      </select>

      <label>Your code</label>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        rows={10}
        style={{
          width: "100%",
          padding: "0.65rem 0.75rem",
          border: "1px solid #dcd9cf",
          background: "#fff",
          fontFamily: "'SF Mono', Consolas, monospace",
          fontSize: "0.85rem",
          borderRadius: "2px",
          resize: "vertical",
        }}
        placeholder="Paste your solution here..."
      />

      <button onClick={handleReview} disabled={loading}>
        {loading ? "Reviewing..." : "Get hints"}
      </button>

      {feedback && (
        <div
          style={{
            marginTop: "1.25rem",
            padding: "1rem 1.1rem",
            background: "#faf6f0",
            fontFamily: "Helvetica Neue, sans-serif",
            fontSize: "0.88rem",
            color: "#444",
            lineHeight: "1.6",
            borderLeft: "3px solid #a8532e",
            borderRadius: "2px",
          }}
        >
          {feedback}
        </div>
      )}

      {similarProblems.length > 0 && (
        <div
          style={{
            marginTop: "0.9rem",
            padding: "1rem 1.1rem",
            background: "#f6efe8",
            borderLeft: "3px solid #966b1f",
            borderRadius: "2px",
          }}
        >
          <p
            style={{
              fontFamily: "Helvetica Neue, sans-serif",
              fontSize: "0.78rem",
              color: "#8a8272",
              marginBottom: "0.6rem",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            Practice this pattern elsewhere
          </p>
          {similarProblems.map((title, i) => (
            <div key={i} style={{ marginBottom: "0.35rem" }}>
              <a
                href={`https://leetcode.com/problemset/?search=${encodeURIComponent(
                  title
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#a8532e",
                  fontFamily: "Helvetica Neue, sans-serif",
                  fontSize: "0.87rem",
                }}
              >
                {title}
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CodeReview;
