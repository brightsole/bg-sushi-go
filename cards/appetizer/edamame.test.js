import test from 'ava';
import appetizers from './index';

const edamame = appetizers.find(appetizer => appetizer.name === 'edamame');

const noPlayedPlayer = { playedCards: [{ name: 'dinglebop-sushi' }] };
const playedPlayer = { playedCards: [{ name: 'edamame' }] };

test('0 other players, 0 cards scores correctly', t => {
  t.is(0, edamame.value([], []));
  t.is(0, edamame.value([], [noPlayedPlayer, noPlayedPlayer, noPlayedPlayer]));
});

test('0 other players, 1+ edamame scores zero too', t => {
  t.is(0, edamame.value([edamame], [noPlayedPlayer]));
  t.is(0, edamame.value([edamame, edamame, edamame], [noPlayedPlayer]));
});

test('1 other player scores 1x edamame', t => {
  t.is(3, edamame.value([edamame, edamame, edamame], [playedPlayer]));
  t.is(2, edamame.value([edamame, edamame], [playedPlayer, noPlayedPlayer]));
});

test('2-4 other player score 2-4x edamame', t => {
  t.is(
    2 * 3,
    edamame.value(
      [edamame, edamame, edamame],
      [playedPlayer, playedPlayer, noPlayedPlayer]
    )
  );
  t.is(3, edamame.value([edamame], [playedPlayer, playedPlayer, playedPlayer]));
  t.is(
    2 * 3,
    edamame.value(
      [edamame, edamame],
      [playedPlayer, playedPlayer, playedPlayer]
    )
  );
  t.is(
    4 * 3,
    edamame.value(
      [edamame, edamame, edamame],
      Array.from(Array(8))
        .map(() => playedPlayer)
        .concat([noPlayedPlayer, noPlayedPlayer])
    )
  );
});

test('greater than 4 other player scores x4 edamame', t => {
  t.is(
    4 * 2,
    edamame.value(
      [edamame, edamame],
      Array.from(Array(8)).map(() => playedPlayer)
    )
  );
});
