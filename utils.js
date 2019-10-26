const selectRandom = max => Math.floor(Math.random() * (max + 1));

module.exports.stdDev = (allPlayerScores, allPlayerAverage) => {
  const squaredDiffs = allPlayerScores.flatMap(scores =>
    scores.map(score => (score - allPlayerAverage) ** 2)
  );
  const avgSquaredDiffs =
    squaredDiffs.reduce((sum, sDiff) => sum + sDiff, 0) / squaredDiffs.length;
  return Math.sqrt(avgSquaredDiffs);
};

module.exports.selectUniqueRandoms = (
  maxIndex,
  numberToSelect,
  resultArray = [],
  possibleRemaining
) => {
  if (resultArray.length === numberToSelect) return resultArray;
  const remaining = possibleRemaining || Array.from(Array(maxIndex + 1).keys());

  const random = selectRandom(remaining.length - 1);

  const result = resultArray.concat(remaining[random]);
  const remains = [
    ...remaining.slice(0, random),
    ...(remaining.length === random ? [] : remaining.slice(random + 1)),
  ];

  return module.exports.selectUniqueRandoms(
    maxIndex,
    numberToSelect,
    result,
    remains
  );
};

const shuffleOnce = arrayToShuffle =>
  this.selectUniqueRandoms(
    arrayToShuffle.length,
    arrayToShuffle.length,
    [],
    arrayToShuffle
  );

const applyMultiple = (startingValue, times, appliedFunction) =>
  Array.from(Array(times)).reduce(
    result => appliedFunction(result),
    startingValue
  );

module.exports.shuffle = arrayToShuffle =>
  applyMultiple(arrayToShuffle, 7, shuffleOnce);

module.exports.turnCount = playerCount => {
  if (playerCount < 4) return 10;
  if (playerCount < 6) return 9;
  if (playerCount < 8) return 8;
  return 7; // 8 players
};
