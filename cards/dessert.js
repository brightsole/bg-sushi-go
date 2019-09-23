const greenTeaIceCream = {
  color: 'cyan-green',
  valueDescription: 'x4: 12',
  name: 'green tea ice cream',
};
const pudding = {
  name: 'pudding',
  color: 'light-pink',
  valueDescription: 'most: 6, least: -6',
};
const fruit = {
  name: 'fruit',
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
