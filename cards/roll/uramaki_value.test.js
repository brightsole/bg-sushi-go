import test from 'ava';
import rolls from './index';

const uramaki = rolls.find(roll => roll.name === 'uramaki');
const makePlayer = playedCards => ({ boardState: { playedCards } });

// unflipped during play, ready to be scored
const uTripleMock = {
  name: 'uramaki',
  shapes: { uramaki: 3 },
};

// flipped and the one card assigned value during `play` scoring
const uScoredTripleMock = {
  value: 10,
  flipped: true,
  name: 'uramaki',
  shapes: { uramaki: 3 },
};
// flipped and assigned 0 score during `play`
const uFlippedTripleMock = {
  value: 0,
  flipped: true,
  name: 'uramaki',
  shapes: { uramaki: 3 },
};

const firstTenPlayer = [
  uScoredTripleMock,
  uFlippedTripleMock,
  uFlippedTripleMock,
  uFlippedTripleMock,
];

test('ROUND END: assigns 2nd place score for unflipped', t => {
  t.is(
    8,
    uramaki.value({
      cardsOfTypePlayed: [uTripleMock],
      otherCardsOfType: [firstTenPlayer],
      // notice the first-scored player with no unflipped cards
      // and ourself, to make the test accurate to life
      players: [makePlayer(firstTenPlayer), makePlayer([uTripleMock])],
    })
  );
});

test('ROUND END: assigns 3nd place, with a tie for first', t => {
  t.is(
    5,
    uramaki.value({
      cardsOfTypePlayed: [uTripleMock],
      otherCardsOfType: [firstTenPlayer],
      players: [
        makePlayer(firstTenPlayer),
        makePlayer(firstTenPlayer),
        makePlayer([uTripleMock]),
      ],
    })
  );
});

test('ROUND END: assigns highest in case of tie', t => {
  t.is(
    10,
    uramaki.value({
      otherCardsOfType: [[uTripleMock]],
      cardsOfTypePlayed: [uTripleMock],
      players: [makePlayer([uTripleMock]), makePlayer([uTripleMock])],
    })
  );
});

test('ROUND END: assigns 2nd if lost unflipped count', t => {
  t.is(
    8,
    uramaki.value({
      cardsOfTypePlayed: [uTripleMock],
      otherCardsOfType: [[uTripleMock, uTripleMock]],
      players: [
        makePlayer([uTripleMock]),
        makePlayer([uTripleMock, uTripleMock]),
      ],
    })
  );
});

test('ROUND END: drops to 3rd if unscored greater tie', t => {
  t.is(
    5,
    uramaki.value({
      cardsOfTypePlayed: [uTripleMock],
      otherCardsOfType: [
        [uTripleMock, uTripleMock],
        [uTripleMock, uTripleMock],
      ],
      players: [
        makePlayer([uTripleMock]),
        makePlayer([uTripleMock, uTripleMock]),
        makePlayer([uTripleMock, uTripleMock]),
      ],
    })
  );
});
