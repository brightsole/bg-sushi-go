import test from 'ava';
import rolls from './index';

const maki = rolls.find(roll => roll.name === 'maki');

const mSingleMock = { shapes: { maki: 1 } };
const mDoubleMock = { shapes: { maki: 2 } };
const mTripleMock = { shapes: { maki: 3 } };

const onePlayedPlayer = [mSingleMock];
const twoPlayedPlayer = [mDoubleMock];
const threePlayedPlayer = [mSingleMock, mDoubleMock];

test('< 6 player, no score', t => {
  t.is(
    0,
    maki.value({
      cardsOfTypePlayed: [],
      otherCardsOfType: [twoPlayedPlayer, onePlayedPlayer],
    })
  );
  t.is(
    0,
    maki.value({
      cardsOfTypePlayed: [mSingleMock],
      otherCardsOfType: [twoPlayedPlayer, threePlayedPlayer],
    })
  );
});

test('< 6 player, second place score', t => {
  t.is(
    3,
    maki.value({
      cardsOfTypePlayed: [],
      otherCardsOfType: [twoPlayedPlayer, twoPlayedPlayer],
    })
  );
  t.is(
    3,
    maki.value({
      cardsOfTypePlayed: [mSingleMock],
      otherCardsOfType: [onePlayedPlayer, threePlayedPlayer],
    })
  );
});

test('< 6 player, winning', t => {
  t.is(
    6,
    maki.value({
      cardsOfTypePlayed: [mSingleMock],
      otherCardsOfType: [onePlayedPlayer, onePlayedPlayer],
    })
  );
  t.is(
    6,
    maki.value({
      cardsOfTypePlayed: [mSingleMock, mTripleMock],
      otherCardsOfType: [onePlayedPlayer, threePlayedPlayer],
    })
  );
});

// > 6 player edge cases
test('> 6 player, no score', t => {
  t.is(
    0,
    maki.value({
      cardsOfTypePlayed: [],
      otherCardsOfType: Array.from(Array(5))
        .map(() => onePlayedPlayer)
        .concat([twoPlayedPlayer, threePlayedPlayer]),
    })
  );
});

test('> 6 player, second place score', t => {
  t.is(
    4,
    maki.value({
      cardsOfTypePlayed: [mSingleMock],
      otherCardsOfType: Array.from(Array(6)).map(() => twoPlayedPlayer),
    })
  );
});

test('> 6 player, third place score', t => {
  t.is(
    2,
    maki.value({
      cardsOfTypePlayed: [mSingleMock],
      otherCardsOfType: Array.from(Array(5))
        .map(() => onePlayedPlayer)
        .concat([twoPlayedPlayer, threePlayedPlayer]),
    })
  );
});
