const greenTeaIceCream = {
  value: 'x4: 12',
  color: 'cyan-green',
  name: 'green tea ice cream',
};
const pudding = {
  name: 'pudding',
  color: 'light-pink',
  value: 'most: 6, least: -6',
};
const fruit = {
  name: 'fruit',
  color: 'orange-pink',
  value: '-2, 0, 1, 3, 6, 10',
  types: [
    { shape: 'x2 orange', count: 2 },
    { shape: 'x2 watermelon', count: 2 },
    { shape: 'x2 pineapple', count: 2 },
    { shape: 'watermelon orange', count: 3 },
    { shape: 'pineapple orange', count: 3 },
    { shape: 'pineapple watermelon', count: 3 },
  ],
};

module.exports = [greenTeaIceCream, pudding, fruit];
