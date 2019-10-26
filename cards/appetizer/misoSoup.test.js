import test from 'ava';
import Card from '../card';
import appetizers from './index';

const misoSoup = appetizers.find(appetizer => appetizer.name === 'miso soup');

const [misoMock, misoMock2] = [0, 1].map(() => new Card({ ...misoSoup }));

const noPlayedPlayer = { name: 'dingle-card' };
const playedPlayer = misoMock2;

test.afterEach(() => {
  [misoMock, misoMock2].map(card => card.reset());
});

test('plays for 3 if nobody else played one', t => {
  misoSoup.play({
    card: misoMock,
    allPlayedCards: [noPlayedPlayer, misoMock],
  });
  t.is(3, misoMock.value);
});

test('plays for 0 if any other player played one', t => {
  misoSoup.play({
    card: misoMock,
    allPlayedCards: [playedPlayer, misoMock],
  });

  t.is(0, misoMock.value);
});
