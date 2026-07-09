import { useEffect, useState } from "react";
import axios from "axios";

function Explanation({ refreshKey }) {
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:5000/attempts/explain")
      .then((res) => setExplanation(res.data.explanation))
      .catch(() => setExplanation(""))
      .finally(() => setLoading(false));
  }, [refreshKey]);

  if (loading) return null;
  if (!explanation) return null;

  return (
    <div
      style={{
        marginTop: "1.5rem",
        padding: "1rem 0",
        borderTop: "1px solid #e5e5e0",
        fontFamily: "Helvetica Neue, sans-serif",
        fontSize: "0.9rem",
        color: "#444",
        lineHeight: "1.6",
      }}
    >
      {explanation}
    </div>
  );
}

export default Explanation;
