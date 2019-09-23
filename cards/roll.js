const temaki = {
  name: 'temaki',
  color: 'dark-purple',
  shapes: { temaki: 1 },
  valueDescription: 'most 4, min -4 | 2p: min 0',
};
const uramaki = {
  name: 'uramaki',
  color: 'bright-green',
  valueDescription: 'first to 10: 8, 5, 2',
  types: [
    { count: 4, shapes: { uramaki: 3 } },
    { count: 4, shapes: { uramaki: 4 } },
    { count: 4, shapes: { uramaki: 5 } },
  ],
};
const maki = {
  name: 'maki',
  color: 'red',
  valueDescription: 'max: 6, 3 | 6p+: 6, 4, 2',
  types: [
    { count: 4, shapes: { maki: 1 } },
    { count: 5, shapes: { maki: 2 } },
    { count: 3, shapes: { maki: 3 } },
  ],
};

// unique to these cards:
// 1. uramaki are scored immediately, and then flipped
// 2. scoring depends on player count

module.exports = [uramaki, temaki, maki];
