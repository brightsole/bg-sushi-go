// const { Signale } = require('signale');
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

const playerCount = Math.round(Math.random() * 6) + 2;
const exampleGame = setup({ playerCount });

console.log('players: ', playerCount);
console.time('game');
exampleGame.playAGame();
console.timeEnd('game');

const { winner, players } = exampleGame;
console.log('winner: ', winner, 'wins with: ', winner.boardState.score);
console.log(
  'average player score: ',
  players.reduce((sum, player) => sum + player.boardState.score, 0) /
    playerCount
);

// grab some stats from many random games!
// const progressLog = new Signale({ interactive: true, scope: 'progress' });
// const TIMES = 2000;

// const [winnerSum, allPlayersSum, playerSum] = Array.from(Array(TIMES)).reduce(
//   (sums, _, i) => {
//     if (!(i % (TIMES / 100)))
//       progressLog.info(`${Math.round((100 * i) / TIMES)}%`);
//     const board = setup({ playerCount });
//     board.playAGame();
//     return [
//       sums[0] + board.winner.boardState.score,
//       sums[1] + board.players.reduce((all, p) => all + p.boardState.score, 0),
//       sums[2] + board.players.length,
//     ];
//   },
//   [0, 0, 0]
// );
// console.log(
//   'winnerAvg: ',
//   winnerSum / TIMES,
//   '\nallPlayersAvg: ',
//   allPlayersSum / (TIMES * playerSum),
//   allPlayersSum,
//   playerSum
// );
