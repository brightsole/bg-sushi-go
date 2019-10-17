import test from 'ava';
import appetizers from './index';

const edamame = appetizers.find(appetizer => appetizer.name === 'edamame');
const eMock = { name: 'edamame' };

const noPlayedPlayer = [];
const playedPlayer = [eMock];

test('0 other players, 0 cards scores correctly', t => {
  t.is(
    0,
    edamame.value({ cardsOfTypePlayed: [], otherCardsOfType: [noPlayedPlayer] })
  );
  t.is(
    0,
    edamame.value({
      cardsOfTypePlayed: [],
      otherCardsOfType: [noPlayedPlayer, noPlayedPlayer, noPlayedPlayer],
    })
  );
});

test('0 other players, 1+ edamame scores zero too', t => {
  t.is(
    0,
    edamame.value({
      cardsOfTypePlayed: [eMock],
      otherCardsOfType: [noPlayedPlayer],
    })
  );
  t.is(
    0,
    edamame.value({
      cardsOfTypePlayed: [eMock, eMock, eMock],
      otherCardsOfType: [noPlayedPlayer, noPlayedPlayer],
    })
  );
});

test('1 other player scores 1x edamame', t => {
  t.is(
    3 * 1,
    edamame.value({
      cardsOfTypePlayed: [eMock, eMock, eMock],
      otherCardsOfType: [playedPlayer],
    })
  );
  t.is(
    2 * 1,
    edamame.value({
      cardsOfTypePlayed: [eMock, eMock],
      otherCardsOfType: [playedPlayer, noPlayedPlayer, noPlayedPlayer],
    })
  );
});

test('2-4 other player score 2-4x edamame', t => {
  t.is(
    2 * 3,
    edamame.value({
      cardsOfTypePlayed: [eMock, eMock, eMock],
      otherCardsOfType: [playedPlayer, playedPlayer, noPlayedPlayer],
    })
  );
  t.is(
    3,
    edamame.value({
      cardsOfTypePlayed: [eMock],
      otherCardsOfType: [playedPlayer, playedPlayer, playedPlayer],
    })
  );
  t.is(
    2 * 3,
    edamame.value({
      cardsOfTypePlayed: [eMock, eMock],
      otherCardsOfType: [playedPlayer, playedPlayer, playedPlayer],
    })
  );
  t.is(
    4 * 3,
    edamame.value({
      cardsOfTypePlayed: [eMock, eMock, eMock],
      otherCardsOfType: Array.from(Array(8))
        .map(() => playedPlayer)
        .concat([noPlayedPlayer, noPlayedPlayer]),
    })
  );
});

test('greater than 4 other player scores x4 edamame', t => {
  t.is(
    4 * 2,
    edamame.value({
      cardsOfTypePlayed: [eMock, eMock],
      otherCardsOfType: Array.from(Array(8)).map(() => playedPlayer),
    })
  );
});
