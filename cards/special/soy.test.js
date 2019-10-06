import test from 'ava';
import specials from './index';

const soy = specials.find(special => special.name === 'soy sauce');

const tMock = { name: 'tea', setScore: () => {}, color: 'dark-red' };

// notice, these "cards" could have totally different names and still score as one color
const redCard = { color: 'red' };
const blueCard = { color: 'blue' };
const pooCard = { color: 'dark-brown' };
const newCard = { color: 'new-new-yellow' };

const makePlayer = playedCards => ({ boardState: { playedCards } });

test('scores 0x if played less than most different colors', t => {
  t.is(
    0,
    soy.value({
      cardsOfTypePlayed: [],
      player: makePlayer([redCard]),
      players: [makePlayer([redCard]), makePlayer([redCard])],
    })
  );
  t.is(
    1 * 0,
    soy.value({
      cardsOfTypePlayed: [tMock],
      player: makePlayer([blueCard, pooCard, tMock]),
      players: [
        makePlayer([blueCard, pooCard, tMock]),
        makePlayer([blueCard, pooCard, redCard, newCard]),
      ],
    })
  );
});

test('scores 4x if played more || equal to the most different colors', t => {
  t.is(
    1 * 4,
    soy.value({
      cardsOfTypePlayed: [tMock],
      player: makePlayer([blueCard, pooCard, redCard, tMock]),
      players: [
        makePlayer([blueCard, pooCard, redCard, tMock]),
        makePlayer([blueCard, pooCard, redCard, newCard]),
      ],
    })
  );
  t.is(
    2 * 4,
    soy.value({
      cardsOfTypePlayed: [tMock, tMock],
      player: makePlayer([blueCard, pooCard, redCard, tMock, tMock]),
      players: [
        makePlayer([blueCard, pooCard, redCard, tMock, tMock]),
        makePlayer([blueCard, pooCard, redCard]),
      ],
    })
  );
});
