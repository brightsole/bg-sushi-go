const { setup } = require('./setup');

const board = setup({ playerCount: 4 });

console.time('game');
board.playAGame();
console.timeEnd('game');
