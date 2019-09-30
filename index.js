const { setup } = require('./setup');

// // for a consistent setup, the following is nice
// const validEight = [
//   'soy sauce',
//   'miso soup',
//   'dumpling',
//   'sashimi',
//   'nigiri',
//   'spoon',
//   'fruit',
//   'maki',
// ];
// const board = setup({ playerCount: 8, cardTypeNames: validEight });

const board = setup({ playerCount: 7 });

console.time('game');
board.playAGame();
console.timeEnd('game');
