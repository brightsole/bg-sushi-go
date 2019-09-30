const scoreGreenTea = desserts => {
  const totalScore = desserts.length % 4 === 0 ? desserts.length / 4 : 0;
  // set the score to zero to not double-count
  desserts.forEach(dessert => dessert.setScore(0));
  return totalScore;
};
const greenTeaIceCream = {
  color: 'cyan-green',
  value: scoreGreenTea,
  valueDescription: 'x4: 12',
  name: 'green tea ice cream',
};

const scorePudding = (desserts, otherPlayerBoardstates) => {
  const otherPlayersPuddings = otherPlayerBoardstates.map(boardstate =>
    boardstate.desserts.concat(
      boardstate.playedCards.filter(card => card.isDessert)
    )
  );

  const minOther = otherPlayersPuddings.reduce(
    (min, puddings) => (puddings.length < min ? puddings.length : min),
    100
  );
  const maxOther = otherPlayersPuddings.reduce(
    (max, puddings) => (puddings.length > max ? puddings.length : max),
    0
  );

  const puddingsCount = desserts.length;
  const shouldGainMin = puddingsCount <= minOther ? -6 : 0;
  const shouldGainMax = puddingsCount >= maxOther ? 6 : 0;

  // it's possible to have the fewest & most if all players have the same amount
  const totalScore = shouldGainMin + shouldGainMax;

  // set the score to zero to not double-count
  desserts.forEach(dessert => dessert.setScore(0));
  return totalScore;
};
const pudding = {
  name: 'pudding',
  color: 'light-pink',
  value: scorePudding,
  valueDescription: 'most: 6, least: -6',
};

const fruitScore = numberOfFruit => {
  if (numberOfFruit === 0) return -2;
  if (numberOfFruit === 1) return 0;
  if (numberOfFruit === 2) return 1;
  if (numberOfFruit === 3) return 3;
  if (numberOfFruit === 4) return 6;
  return 10;
};
const scoreFruit = desserts => {
  const [oranges, pineapples, watermelons] = desserts.reduce(
    ([sumOrange, sumPineapple, sumWatermelon], card) => {
      const { orange = 0, pineapple = 0, watermelon = 0 } = card.shapes;

      return [
        sumOrange + orange,
        sumPineapple + pineapple,
        sumWatermelon + watermelon,
      ];
    },
    [0, 0, 0]
  );

  const totalScore = [oranges, pineapples, watermelons].reduce(
    (total, count) => total + fruitScore(count),
    0
  );

  // set the score to zero to not double-count
  desserts.forEach(dessert => dessert.setScore(0));
  return totalScore;
};
const fruit = {
  name: 'fruit',
  value: scoreFruit,
  color: 'orange-pink',
  valueDescription: '-2, 0, 1, 3, 6, 10',
  types: [
    { shapes: { orange: 2 }, count: 2 },
    { shapes: { pineapple: 2 }, count: 2 },
    { shapes: { watermelon: 2 }, count: 2 },
    { shapes: { pineapple: 1, orange: 1 }, count: 3 },
    { shapes: { watermelon: 1, orange: 1 }, count: 3 },
    { shapes: { pineapple: 1, watermelon: 1 }, count: 3 },
  ],
};

module.exports = [greenTeaIceCream, pudding, fruit];
