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
  value: dumplingCards => {
    const count = dumplingCards.length;
    if (count === 0) return 0;
    if (count === 1) return 1;
    if (count === 2) return 3;
    if (count === 3) return 6;
    if (count === 4) return 10;
    return 15;
  },
};
const tofu = {
  name: 'tofu',
  color: 'light-green',
  valueDescription: 'x1: 2, x2: 6, x3+: 0',
  value: tofuCards => {
    const count = tofuCards.length;
    if (count === 1) return 2;
    if (count === 2) return 6;
    return 0;
  },
};
const sashimi = {
  name: 'sashimi',
  color: 'bright-green',
  valueDescription: 'x3: 10',
  value: sashimiCards =>
    sashimiCards.length && sashimiCards.length % 3 === 0
      ? (10 * sashimiCards.length) / 3
      : 0,
};
const eel = {
  name: 'eel',
  color: 'blue-purple',
  valueDescription: 'x1: -3, x2+: 7',
  value: eelCards => (eelCards.length >= 2 ? 7 : -3),
};
const tempura = {
  name: 'tempura',
  color: 'light-pink',
  valueDescription: 'x2: 5',
  value: tempuraCards =>
    tempuraCards.length && tempuraCards.length % 2 === 0
      ? (5 * tempuraCards.length) / 2
      : 0,
};
const onigiri = {
  name: 'onigiri',
  color: 'bright-pink',
  valueDescription: 'x shape: 1, 4, 9, 16',
  value: onigiriCards => {
    const validSets = onigiriCards.reduce(
      (sets, card) => {
        const shape = Object.keys(card.shapes)[0]; // only 1 possible shape

        if (sets[0].includes(shape)) return [sets[0], sets[1].concat(shape)];
        return [sets[0].concat(shape), sets[1]];
      },
      [[], []] // max 2 in any set
    );

    return validSets.reduce((sum, set) => sum + set.length ** 2, 0);
  },
  types: [
    { shapes: { rectangle: 1 }, count: 2 },
    { shapes: { triangle: 1 }, count: 2 },
    { shapes: { circle: 1 }, count: 2 },
    { shapes: { square: 1 }, count: 2 },
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
