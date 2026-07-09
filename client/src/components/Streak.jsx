import { useEffect, useState } from "react";
import { getStreak } from "../api/api";

function Streak({ refreshKey }) {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    getStreak()
      .then((res) => setStreak(res.data.streak))
      .catch(() => setStreak(0));
  }, [refreshKey]);

  if (streak === 0) return null;

  return (
    <p
      style={{
        fontFamily: "Helvetica Neue, sans-serif",
        fontSize: "0.85rem",
        color: "#b8542f",
        marginBottom: "1rem",
      }}
    >
      {streak} day{streak !== 1 ? "s" : ""} streak
    </p>
  );
}

export default Streak;
