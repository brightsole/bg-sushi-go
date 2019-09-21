const selectRandom = max => Math.floor(Math.random() * (max + 1));

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
