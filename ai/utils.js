// the utils abstracted from individual ai; consumed in all/some of them

module.exports.arrayMult = (array1, array2) =>
  array1.flatMap(score1 => array2.map(score2 => score2 * score1));

module.exports.arrayAdd = (array1, array2) =>
  array1.flatMap(score1 => array2.map(score2 => score2 + score1));

module.exports.naiivePossibilities = ({
  maxOfThisCard,
  multiplier = 1,
  maxScoreLength,
}) => {
  const possibleCards = Array.from(Array(maxOfThisCard));
  const possibleScores = Array.from(Array(maxScoreLength * multiplier));

  return module.exports.arrayMult(possibleCards, possibleScores);
};
