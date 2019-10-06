import test from 'ava';
import { Card } from '../card';
import rolls from './index';

// i know, there's only one, but what if we want to make more one day?
const uramaki = rolls.find(roll => roll.name === 'uramaki');

const [triple, quad, quint] = uramaki.types.map(
  type =>
    new Card({
      ...uramaki,
      ...type,
    })
);
const [otherTriple, otherQuad, otherQuint] = uramaki.types.map(
  type =>
    new Card({
      ...uramaki,
      ...type,
    })
);

test.afterEach(() => {
  [triple, quad, quint].map(card => card.reset());
  [otherTriple, otherQuad, otherQuint].map(card => card.reset());
});

test('leaves uramaki unmodified if total with play is < 10', t => {
  uramaki.play({
    card: triple,
    boardState: { playedCards: [quint] },
    existingPlayedCards: [[], [quint]],
  });

  t.is('function', typeof triple.value);
});

test.only('scores played uramaki, and sets unplayed to 0', t => {
  uramaki.play({
    card: quint,
    boardState: { playedCards: [quad, triple] },
    expectedPlayedCards: [[quad, quint, triple], [otherQuad, otherQuint]],
  });

  t.is(quint.value, 10);
  t.is(triple.value, 0);
  t.is(quad.value, 0);
});

test('scores second when another player will score with more', t => {
  uramaki.play({
    card: quint,
    boardState: { playedCards: [triple, triple] }, // total 11
    expectedPlayedCards: [
      [triple, triple, quint], // our player to be filtered
      [otherTriple, otherQuad, otherQuint], // other player that scored more
    ],
  });

  t.is(quint.value, 8);
  t.is(triple.value, 0);
  t.is(quad.value, 0);
});
