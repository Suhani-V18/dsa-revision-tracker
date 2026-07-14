function daysSince(date) {
  const diffMs = Date.now() - new Date(date).getTime();
  return diffMs / (1000 * 60 * 60 * 24);
}

function getMasteryLevel(weaknessScore) {
  if (weaknessScore < 0.3) return "Strong";
  if (weaknessScore <= 0.6) return "Intermediate";
  return "Beginner";
}

export function calculateTopicScores(attempts) {
  const grouped = {};

  attempts.forEach((a) => {
    if (!grouped[a.topic]) grouped[a.topic] = [];
    grouped[a.topic].push(a);
  });

  const scores = Object.entries(grouped).map(([topic, topicAttempts]) => {
    const mostRecent = topicAttempts.reduce((latest, a) =>
      new Date(a.date) > new Date(latest.date) ? a : latest
    );

    const avgHints =
      topicAttempts.reduce((sum, a) => sum + a.hintsUsed, 0) /
      topicAttempts.length;
    const hintWeight = Math.min(avgHints / 3, 1);

    const avgTimeRatio =
      topicAttempts.reduce(
        (sum, a) => sum + a.timeTakenMinutes / a.expectedTimeMinutes,
        0
      ) / topicAttempts.length;
    const timeWeight = Math.min(avgTimeRatio / 2, 1);

    const performanceStrength = 1 - (hintWeight * 0.5 + timeWeight * 0.5);
    const idealInterval = 5 + performanceStrength * 25;

    const recencyWeight = Math.min(
      daysSince(mostRecent.date) / idealInterval,
      1
    );

    const weaknessScore =
      recencyWeight * 0.4 + hintWeight * 0.35 + timeWeight * 0.25;

    return {
      topic,
      weaknessScore: Number(weaknessScore.toFixed(2)),
      masteryLevel: getMasteryLevel(weaknessScore),
      idealInterval: Math.round(idealInterval),
      lastPracticed: mostRecent.date,
      avgHints: Number(avgHints.toFixed(1)),
      avgTimeRatio: Number(avgTimeRatio.toFixed(2)),
    };
  });

  return scores.sort((a, b) => b.weaknessScore - a.weaknessScore);
}

export function calculateStreak(attempts) {
  const dates = [
    ...new Set(attempts.map((a) => new Date(a.date).toDateString())),
  ];
  const sorted = dates.map((d) => new Date(d)).sort((a, b) => b - a);

  let streak = 0;
  let cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  for (const d of sorted) {
    const diff = Math.round((cursor - d) / (1000 * 60 * 60 * 24));
    if (diff === streak) {
      streak++;
    } else if (diff > streak) {
      break;
    }
  }
  return streak;
}

export function calculateReadinessScore(attempts, scores) {
  if (attempts.length === 0) {
    return { readinessScore: 0, breakdown: null };
  }

  const TOTAL_TOPICS = 14;

  const masteryPoints = scores.reduce((sum, s) => {
    if (s.masteryLevel === "Strong") return sum + 1;
    if (s.masteryLevel === "Intermediate") return sum + 0.5;
    return sum;
  }, 0);
  const masteryScore =
    scores.length > 0 ? (masteryPoints / scores.length) * 100 : 0;

  const coverageScore = Math.min((scores.length / TOTAL_TOPICS) * 100, 100);

  const streak = calculateStreak(attempts);
  const consistencyScore = Math.min((streak / 14) * 100, 100);

  const volumeScore = Math.min((attempts.length / 100) * 100, 100);

  const readinessScore = Math.round(
    masteryScore * 0.4 +
      coverageScore * 0.25 +
      consistencyScore * 0.15 +
      volumeScore * 0.2
  );

  return {
    readinessScore,
    breakdown: {
      mastery: Math.round(masteryScore),
      coverage: Math.round(coverageScore),
      consistency: Math.round(consistencyScore),
      volume: Math.round(volumeScore),
    },
  };
}

export function calculateStreakWithTarget(attempts, target) {
  const countsByDay = {};

  attempts.forEach((a) => {
    const day = new Date(a.date).toDateString();
    countsByDay[day] = (countsByDay[day] || 0) + 1;
  });

  const allDays = Object.keys(countsByDay)
    .map((d) => new Date(d))
    .sort((a, b) => a - b);

  if (allDays.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  let longestStreak = 0;
  let runningStreak = 0;
  let prevDay = null;

  for (const day of allDays) {
    const metTarget = countsByDay[day.toDateString()] >= target;

    if (!metTarget) {
      runningStreak = 0;
      prevDay = day;
      continue;
    }

    if (prevDay && (day - prevDay) / (1000 * 60 * 60 * 24) === 1) {
      runningStreak++;
    } else {
      runningStreak = 1;
    }

    longestStreak = Math.max(longestStreak, runningStreak);
    prevDay = day;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const lastDay = allDays[allDays.length - 1];
  const daysSinceLast = Math.round((today - lastDay) / (1000 * 60 * 60 * 24));

  const todayMet = countsByDay[today.toDateString()] >= target;
  const currentStreak =
    daysSinceLast > 1
      ? 0
      : todayMet
      ? runningStreak
      : Math.max(runningStreak - 1, 0);

  return { currentStreak, longestStreak };
}
