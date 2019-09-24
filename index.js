const { setup } = require('./setup');

const board = setup({ playerCount: 8 });

console.time('game');
board.playAGame();
console.timeEnd('game');
