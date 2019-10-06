import test from 'ava';
import { Card } from '../card';
import nigiriTypes from './index';

// i know, there's only one, but what if we want to make more one day?
const nigiri = nigiriTypes.find(n => n.name === 'nigiri');

const activeWasabi = { flip: () => {}, name: 'wasabi' };
const consumedWasabi = { flip: () => {}, name: 'wasabi', flipped: true };

const [single, triple, double] = nigiri.types.map(
  type =>
    new Card({
      ...nigiri,
      ...type,
    })
);

test.afterEach(() => {
  [single, double, triple].map(card => card.setScore(card.default));
});

test('refuses to change value when played with no active wasabi', t => {
  nigiri.play({
    card: single,
    boardState: { playedCards: [] },
  });
  nigiri.play({
    card: double,
    boardState: { playedCards: [consumedWasabi, triple] },
  });

  t.is(1, single.value);
  t.is(2, double.value);
});

test('changes value x3 with at least one active wasabi', t => {
  nigiri.play({
    card: single,
    boardState: { playedCards: [activeWasabi] },
  });
  nigiri.play({
    card: triple,
    boardState: { playedCards: [consumedWasabi, activeWasabi] },
  });
  t.is(1 * 3, single.value);
  t.is(3 * 3, triple.value);
});
