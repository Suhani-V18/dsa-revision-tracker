function daysSince(date) {
  const diffMs = Date.now() - new Date(date).getTime();
  return diffMs / (1000 * 60 * 60 * 24);
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

    // Adaptive interval: strong topics get a longer "safe" window before they're flagged,
    // weak topics get flagged sooner — same spirit as SM-2's ease factor.
    const performanceStrength = 1 - (hintWeight * 0.5 + timeWeight * 0.5);
    const idealInterval = 5 + performanceStrength * 25; // ranges ~5 to 30 days

    const recencyWeight = Math.min(
      daysSince(mostRecent.date) / idealInterval,
      1
    );

    const weaknessScore =
      recencyWeight * 0.4 + hintWeight * 0.35 + timeWeight * 0.25;

    return {
      topic,
      weaknessScore: Number(weaknessScore.toFixed(2)),
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
