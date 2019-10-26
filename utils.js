const stdDev = (allPlayerScores, allPlayerAverage) => {
  const squaredDiffs = allPlayerScores.flatMap(scores =>
    scores.map(score => (score - allPlayerAverage) ** 2)
  );
  const avgSquaredDiffs =
    squaredDiffs.reduce((sum, sDiff) => sum + sDiff, 0) / squaredDiffs.length;
  return Math.sqrt(avgSquaredDiffs);
};

const turnCount = playerCount => {
  if (playerCount < 4) return 10;
  if (playerCount < 6) return 9;
  if (playerCount < 8) return 8;
  return 7; // 8 players
};

module.exports = {
  turnCount,
  stdDev,
};
