import { useState } from "react";
import { createProblem, createAttempt, getSimilarProblems } from "../api/api";

function AttemptForm({ onAttemptLogged }) {
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const [link, setLink] = useState("");
  const [expectedTimeMinutes, setExpectedTimeMinutes] = useState("");
  const [timeTakenMinutes, setTimeTakenMinutes] = useState("");
  const [hintsUsed, setHintsUsed] = useState(0);
  const [solvedIndependently, setSolvedIndependently] = useState(true);
  const [confidenceRating, setConfidenceRating] = useState(3);
  const [suggestions, setSuggestions] = useState([]);
  const [weaknessFeedback, setWeaknessFeedback] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const problemRes = await createProblem({
        title,
        topic,
        difficulty,
        link,
        expectedTimeMinutes: Number(expectedTimeMinutes),
      });

      const newProblemId = problemRes.data._id;

      const attemptRes = await createAttempt({
        problemId: newProblemId,
        timeTakenMinutes: Number(timeTakenMinutes),
        hintsUsed: Number(hintsUsed),
        solvedIndependently,
        confidenceRating: Number(confidenceRating),
      });

      if (Number(hintsUsed) >= 2) {
        const simRes = await getSimilarProblems(topic, newProblemId);
        setSuggestions(simRes.data);
        setWeaknessFeedback(attemptRes.data.conceptualFeedback || "");
      } else {
        setSuggestions([]);
        setWeaknessFeedback("");
      }

      setTitle("");
      setTopic("");
      setLink("");
      setExpectedTimeMinutes("");
      setTimeTakenMinutes("");
      setHintsUsed(0);
      onAttemptLogged();
    } catch (err) {
      console.error("Failed to log attempt:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Problem title</label>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <label>Topic</label>
      <select value={topic} onChange={(e) => setTopic(e.target.value)} required>
        <option value="">Select a topic</option>
        <option value="Array">Array</option>
        <option value="String">String</option>
        <option value="Linked List">Linked List</option>
        <option value="Stack">Stack</option>
        <option value="Queue">Queue</option>
        <option value="Tree">Tree</option>
        <option value="Graph">Graph</option>
        <option value="DP">DP</option>
        <option value="Greedy">Greedy</option>
        <option value="Backtracking">Backtracking</option>
        <option value="Binary Search">Binary Search</option>
        <option value="Two Pointer">Two Pointer</option>
        <option value="Sliding Window">Sliding Window</option>
        <option value="Bit Manipulation">Bit Manipulation</option>
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

      <label>Link (optional)</label>
      <input value={link} onChange={(e) => setLink(e.target.value)} />

      <label>Expected time (minutes)</label>
      <input
        type="number"
        value={expectedTimeMinutes}
        onChange={(e) => setExpectedTimeMinutes(e.target.value)}
        required
      />

      <label>Time taken (minutes)</label>
      <input
        type="number"
        value={timeTakenMinutes}
        onChange={(e) => setTimeTakenMinutes(e.target.value)}
        required
      />

      <label>Hints used</label>
      <input
        type="number"
        value={hintsUsed}
        onChange={(e) => setHintsUsed(e.target.value)}
      />

      <label>Solved independently?</label>
      <select
        value={solvedIndependently}
        onChange={(e) => setSolvedIndependently(e.target.value === "true")}
      >
        <option value="true">Yes</option>
        <option value="false">No</option>
      </select>

      <label>Confidence (1-5)</label>
      <input
        type="number"
        min="1"
        max="5"
        value={confidenceRating}
        onChange={(e) => setConfidenceRating(e.target.value)}
      />

      <button type="submit">Log attempt</button>

      {weaknessFeedback && (
        <div
          style={{
            marginTop: "1rem",
            padding: "1rem",
            background: "#f6efe8",
            borderLeft: "3px solid #966b1f",
            fontFamily: "Helvetica Neue, sans-serif",
            fontSize: "0.85rem",
            color: "#444",
            lineHeight: "1.5",
          }}
        >
          {weaknessFeedback}
        </div>
      )}

      {suggestions.length > 0 && (
        <div
          style={{
            marginTop: "1rem",
            padding: "1rem",
            background: "#faf6f0",
            borderLeft: "3px solid #b8542f",
          }}
        >
          <p
            style={{
              fontFamily: "Helvetica Neue, sans-serif",
              fontSize: "0.85rem",
              color: "#444",
              marginBottom: "0.5rem",
            }}
          >
            You used several hints — try these similar problems:
          </p>
          {suggestions.map((p) => (
            <div
              key={p._id}
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: "0.85rem",
                marginBottom: "0.3rem",
              }}
            >
              {p.link ? (
                <a
                  href={p.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#b8542f" }}
                >
                  {p.title}
                </a>
              ) : (
                p.title
              )}
            </div>
          ))}
        </div>
      )}
    </form>
  );
}

export default AttemptForm;
