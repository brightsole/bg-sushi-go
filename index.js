const { Signale } = require('signale');
const { stdDev } = require('./utils');
const { setup } = require('./setup');
const { worst } = require('./ai');

/**
 * This is one of many valid formats supported thus far. I picked it for the
 * following reasons to start getting valid feedback on the efficacy of the ai
 * that are currently being designed.
 *
 * nigiri: only one option, and it's great
 * specials: limited
 *    * wasabi accounted for in nigiri scoring, but not chosen
 *    * only tea and soy sauce are simple value sum calcs like others
 * rolls: any will do, but temaki is arguably the simplest
 * appetizers: any will do, _(tested given priority)_
 */
const simplestFullyScoringGame = [
  'soy sauce',
  'pudding',
  'edamame',
  'sashimi',
  'onigiri',
  'nigiri',
  'temaki',
  'tea',
];

const progressLog = new Signale({ interactive: true, scope: 'progress' });

const PLAYER_COUNT = 6;
const GAMES_PLAYED = 200;

const allGamesFinalScores = Array.from(Array(GAMES_PLAYED)).reduce(
  (sums, _, i) => {
    if (!((i + 1) % (GAMES_PLAYED / 100)))
      progressLog.info(`${Math.round((100 * (i + 1)) / GAMES_PLAYED)}%`);

    const [board, history] = setup({
      log: { player: true },
      playerCount: PLAYER_COUNT,
      cardTypeNames: simplestFullyScoringGame,
      inputPlayers: [{ scoringAlgorithm: worst, id: 'worst' }],
    });

    board.playAGame();
    if (i === 100) console.log(history.getPlayerHistory(board.winner.id));

    return [
      ...sums,
      board.players
        .map(p => p.boardState.score)
        .sort((a, b) => (a > b ? -1 : 1)),
    ];
  },
  []
);

const winnerAvg =
  allGamesFinalScores.reduce((sum, playerScores) => sum + playerScores[0], 0) /
  GAMES_PLAYED;

const allPlayerAverage =
  allGamesFinalScores.reduce(
    (sum, playerScores) =>
      sum + playerScores.reduce((total, score) => total + score, 0),
    0
  ) /
  (GAMES_PLAYED * PLAYER_COUNT);

// log results!
console.log(
  'winnerAvg: ',
  winnerAvg,
  '\nallPlayersAvg: ',
  allPlayerAverage,
  '\nscore standard dev: ',
  stdDev(allGamesFinalScores, allPlayerAverage)
);
