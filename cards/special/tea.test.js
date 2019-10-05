import test from 'ava';
import specials from './index';

const tea = specials.find(appetizer => appetizer.name === 'tea');

const tMock = { name: 'tea', setScore: () => {}, color: 'dark-red' };

// notice, these "cards" could have totally different names and still score as one color
const redCard = { color: 'red' };
const blueCard = { color: 'blue' };
const pooCard = { color: 'dark-brown' };

const makePlayer = playedCards => ({ boardState: { playedCards } });

test('scores 0 for none played & any combo of colors', t => {
  t.is(0, tea.value({ cardsOfTypePlayed: [], player: makePlayer([redCard]) }));
  t.is(
    0,
    tea.value({
      cardsOfTypePlayed: [],
      player: makePlayer([blueCard, pooCard]),
    })
  );
});

// players should always have an equal number of tMock played in their boarstate
// as the number inside of `cardsOfTypePlayed`
test.only('scores 1x times the number of other colors', t => {
  t.is(
    1 * 1,
    tea.value({
      cardsOfTypePlayed: [tMock],
      player: makePlayer([pooCard, redCard, tMock]),
    })
  );
  t.is(
    1 * 2,
    tea.value({
      cardsOfTypePlayed: [tMock],
      player: makePlayer([redCard, redCard, pooCard, pooCard, tMock]),
    })
  );
  t.is(
    2 * 2,
    tea.value({
      cardsOfTypePlayed: [tMock, tMock],
      player: makePlayer([redCard, tMock, tMock]),
    })
  );
  t.is(
    2 * 3,
    tea.value({
      cardsOfTypePlayed: [tMock, tMock],
      player: makePlayer([redCard, redCard, redCard, tMock, tMock]),
    })
  );
});
