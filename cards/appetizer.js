const misoSoup = {
  name: 'miso soup',
  color: 'blue-green',
  value: '3, discard if other played on turn',
};
const edamame = {
  minPlayers: 3,
  name: 'edamame',
  color: 'purple',
  value: '1 x opponent with edamame (max 4)',
};
const dumpling = {
  name: 'dumpling',
  color: 'light-blue',
  value: '1, 3, 6, 10, 15',
};
const tofu = {
  name: 'tofu',
  value: 'x1: 2, x2: 6, x3+: 0',
  color: 'light-green',
};
const sashimi = { name: 'sashimi', value: 'x3: 10', color: 'bright-green' };
const eel = { name: 'eel', value: 'x1: -3, x2+: 7', color: 'blue-purple' };
const tempura = { name: 'tempura', value: 'x2: 5', color: 'light-pink' };
const onigiri = {
  name: 'onigiri',
  color: 'bright-pink',
  value: 'x shape: 1, 4, 9, 16',
  types: [
    { shape: 'triangle', count: 2 },
    { shape: 'circle', count: 2 },
    { shape: 'square', count: 2 },
    { shape: 'flat', count: 2 },
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
