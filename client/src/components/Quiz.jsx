import { useState } from "react";
import { getQuiz } from "../api/api";

function Quiz() {
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadQuiz = async () => {
    setLoading(true);
    setError("");
    setSubmitted(false);
    setAnswers({});
    try {
      const res = await getQuiz();
      setQuiz(res.data.quiz);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load quiz.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (qIndex, optionIndex) => {
    if (submitted) return;
    setAnswers({ ...answers, [qIndex]: optionIndex });
  };

  const score = quiz
    ? quiz.filter((q, i) => answers[i] === q.correctIndex).length
    : 0;

  return (
    <div
      style={{
        marginTop: "2.5rem",
        paddingTop: "1.5rem",
        borderTop: "1px solid #e5e5e0",
      }}
    >
      <p
        style={{
          fontFamily: "Helvetica Neue, sans-serif",
          fontSize: "0.8rem",
          color: "#666",
          marginBottom: "0.5rem",
        }}
      >
        Weekly quiz — based on your weak topics
      </p>

      {!quiz && (
        <button onClick={loadQuiz} disabled={loading}>
          {loading ? "Generating..." : "Start this week's quiz"}
        </button>
      )}

      {error && (
        <p style={{ color: "#c0392b", fontSize: "0.85rem" }}>{error}</p>
      )}

      {quiz && (
        <div style={{ marginTop: "1rem" }}>
          {quiz.map((q, i) => (
            <div key={i} style={{ marginBottom: "1.5rem" }}>
              <p
                style={{
                  fontFamily: "Helvetica Neue, sans-serif",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  marginBottom: "0.5rem",
                }}
              >
                {i + 1}. {q.question}
              </p>
              {q.options.map((opt, oi) => {
                const isSelected = answers[i] === oi;
                const isCorrect = submitted && oi === q.correctIndex;
                const isWrong =
                  submitted && isSelected && oi !== q.correctIndex;
                return (
                  <div
                    key={oi}
                    onClick={() => handleAnswer(i, oi)}
                    style={{
                      padding: "0.5rem 0.75rem",
                      marginBottom: "0.4rem",
                      border:
                        "1px solid " +
                        (isCorrect
                          ? "#2d6a4f"
                          : isWrong
                          ? "#a13d2c"
                          : "#d5d5d0"),
                      background: isCorrect
                        ? "#e6f2ec"
                        : isWrong
                        ? "#f6e5e1"
                        : isSelected
                        ? "#f0eee8"
                        : "#fff",
                      fontFamily: "Helvetica Neue, sans-serif",
                      fontSize: "0.85rem",
                      cursor: submitted ? "default" : "pointer",
                    }}
                  >
                    {opt}
                  </div>
                );
              })}
            </div>
          ))}

          {!submitted ? (
            <button onClick={() => setSubmitted(true)}>Submit quiz</button>
          ) : (
            <p
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: "0.9rem",
                fontWeight: 500,
              }}
            >
              Score: {score} / {quiz.length}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default Quiz;
