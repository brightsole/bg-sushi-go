import test from 'ava';
import rolls from './index';

const temaki = rolls.find(roll => roll.name === 'temaki');

const tMock = { name: 'temaki' };

const noPlayedPlayer = [];
const onePlayedPlayer = [tMock];
const twoPlayedPlayer = [tMock, tMock];

test('scores 0 for none played & 2 players as loser', t => {
  t.is(
    0,
    temaki.value({ cardsOfTypePlayed: [], otherCardsOfType: [onePlayedPlayer] })
  );
  t.is(
    0,
    temaki.value({ cardsOfTypePlayed: [], otherCardsOfType: [twoPlayedPlayer] })
  );
});

test('scores -4 for none played & 2+ players', t => {
  t.is(
    -4,
    temaki.value({
      cardsOfTypePlayed: [],
      otherCardsOfType: [noPlayedPlayer, onePlayedPlayer],
    })
  );
  t.is(
    -4,
    temaki.value({
      cardsOfTypePlayed: [],
      otherCardsOfType: [noPlayedPlayer, noPlayedPlayer, twoPlayedPlayer],
    })
  );
  t.is(
    -4,
    temaki.value({
      cardsOfTypePlayed: [tMock],
      otherCardsOfType: [twoPlayedPlayer, onePlayedPlayer],
    })
  );
});

test('scores 4-4 (0) for min & max played by all & 2+ players', t => {
  t.is(
    0,
    temaki.value({
      cardsOfTypePlayed: [tMock],
      otherCardsOfType: [onePlayedPlayer, onePlayedPlayer],
    })
  );
  t.is(
    0,
    temaki.value({
      cardsOfTypePlayed: [],
      otherCardsOfType: [noPlayedPlayer, noPlayedPlayer],
    })
  );
});

test('scores 4 when played maximum', t => {
  t.is(
    4,
    temaki.value({
      cardsOfTypePlayed: [tMock],
      otherCardsOfType: [noPlayedPlayer],
    })
  );
  t.is(
    4,
    temaki.value({
      cardsOfTypePlayed: [tMock, tMock],
      otherCardsOfType: [onePlayedPlayer],
    })
  );
  t.is(
    4,
    temaki.value({
      cardsOfTypePlayed: [tMock, tMock, tMock],
      otherCardsOfType: [twoPlayedPlayer],
    })
  );
  t.is(
    4,
    temaki.value({
      cardsOfTypePlayed: [tMock, tMock, tMock],
      otherCardsOfType: [twoPlayedPlayer, onePlayedPlayer, noPlayedPlayer],
    })
  );
});

test('scores 4 when played tied for maximum, with 1 loser', t => {
  t.is(
    4,
    temaki.value({
      cardsOfTypePlayed: [tMock],
      otherCardsOfType: [onePlayedPlayer, noPlayedPlayer],
    })
  );
  t.is(
    4,
    temaki.value({
      cardsOfTypePlayed: [tMock, tMock],
      otherCardsOfType: [twoPlayedPlayer, onePlayedPlayer],
    })
  );
});
