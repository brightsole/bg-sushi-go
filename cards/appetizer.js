const misoSoup = {
  name: 'miso soup',
  color: 'blue-green',
  valueDescription: '3, discard if other played on turn',
};
const edamame = {
  minPlayers: 3,
  name: 'edamame',
  color: 'purple',
  valueDescription: '1 x opponent with edamame (max 4)',
};
const dumpling = {
  name: 'dumpling',
  color: 'light-blue',
  valueDescription: '1, 3, 6, 10, 15',
};
const tofu = {
  name: 'tofu',
  color: 'light-green',
  valueDescription: 'x1: 2, x2: 6, x3+: 0',
};
const sashimi = {
  name: 'sashimi',
  color: 'bright-green',
  valueDescription: 'x3: 10',
};
const eel = {
  name: 'eel',
  color: 'blue-purple',
  valueDescription: 'x1: -3, x2+: 7',
};
const tempura = {
  name: 'tempura',
  color: 'light-pink',
  valueDescription: 'x2: 5',
};
const onigiri = {
  name: 'onigiri',
  color: 'bright-pink',
  valueDescription: 'x shape: 1, 4, 9, 16',
  types: [
    { shapes: { triangle: 1 }, count: 2 },
    { shapes: { circle: 1 }, count: 2 },
    { shapes: { square: 1 }, count: 2 },
    { shapes: { flat: 1 }, count: 2 },
  ],
};

module.exports = [
  dumpling,
  misoSoup,
  edamame,
  onigiri,
  sashimi,
  tempura,
  tofu,
  eel,
];
