import { useEffect, useState } from "react";
import { getTodayCount, getStreakDetailed } from "../api/api";

function DailyTarget({ refreshKey }) {
  const [target, setTarget] = useState(
    () => Number(localStorage.getItem("dailyTarget")) || 3
  );
  const [count, setCount] = useState(0);
  const [editing, setEditing] = useState(false);
  const [streaks, setStreaks] = useState({
    currentStreak: 0,
    longestStreak: 0,
  });

  useEffect(() => {
    getTodayCount().then((res) => setCount(res.data.count));
    getStreakDetailed(target).then((res) => setStreaks(res.data));
  }, [refreshKey, target]);

  const handleSetTarget = (val) => {
    const num = Number(val) || 1;
    setTarget(num);
    localStorage.setItem("dailyTarget", num);
  };

  const percent = Math.min((count / target) * 100, 100);
  const met = count >= target;

  return (
    <div
      style={{
        marginBottom: "2rem",
        paddingBottom: "1.5rem",
        borderBottom: "1px solid #e8e6df",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
        }}
      >
        <span className="section-label" style={{ marginBottom: 0 }}>
          Today's target
        </span>
        {editing ? (
          <input
            type="number"
            defaultValue={target}
            autoFocus
            onBlur={(e) => {
              handleSetTarget(e.target.value);
              setEditing(false);
            }}
            onKeyDown={(e) => e.key === "Enter" && e.target.blur()}
            style={{
              width: "60px",
              padding: "0.2rem 0.4rem",
              fontSize: "0.8rem",
            }}
          />
        ) : (
          <span
            onClick={() => setEditing(true)}
            style={{
              fontFamily: "Helvetica Neue, sans-serif",
              fontSize: "0.78rem",
              color: "#a8532e",
              cursor: "pointer",
            }}
          >
            edit
          </span>
        )}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: "8px",
          marginTop: "0.5rem",
        }}
      >
        <span
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "1.6rem",
            color: met ? "#2d6a4f" : "#1a1a1a",
          }}
        >
          {count}
        </span>
        <span
          style={{
            fontFamily: "Helvetica Neue, sans-serif",
            fontSize: "0.85rem",
            color: "#9a988d",
          }}
        >
          / {target} problems today {met && "— done!"}
        </span>
      </div>

      <div
        style={{
          height: "4px",
          background: "#ece9e1",
          marginTop: "0.6rem",
          borderRadius: "2px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${percent}%`,
            background: met ? "#2d6a4f" : "#a8532e",
            transition: "width 0.3s ease",
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          gap: "16px",
          marginTop: "0.6rem",
          fontFamily: "Helvetica Neue, sans-serif",
          fontSize: "0.78rem",
          color: "#9a988d",
        }}
      >
        <span>
          Current streak: {streaks.currentStreak} day
          {streaks.currentStreak !== 1 ? "s" : ""}
        </span>
        <span>
          Best: {streaks.longestStreak} day
          {streaks.longestStreak !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
}

export default DailyTarget;
