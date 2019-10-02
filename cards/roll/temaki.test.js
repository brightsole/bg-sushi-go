import test from 'ava';
import appetizers from './index';

const temaki = appetizers.find(appetizer => appetizer.name === 'temaki');

const tMock = { setScore: () => {} };

const noPlayedPlayer = { playedCards: [{ name: 'dinglebop-sushi' }] };
const onePlayedPlayer = { playedCards: [{ name: 'temaki' }] };
const twoPlayedPlayer = {
  playedCards: [{ name: 'temaki' }, { name: 'temaki' }],
};

test('scores 0 for none played & 2 players as loser', t => {
  t.is(0, temaki.value([], [onePlayedPlayer]));
  t.is(0, temaki.value([], [twoPlayedPlayer]));
});

test('scores -4 for none played & 2+ players', t => {
  t.is(-4, temaki.value([], [noPlayedPlayer, onePlayedPlayer]));
  t.is(-4, temaki.value([], [noPlayedPlayer, noPlayedPlayer, twoPlayedPlayer]));
  t.is(-4, temaki.value([tMock], [twoPlayedPlayer, onePlayedPlayer]));
});

test('scores 4-4 (0) for min & max played by all & 2+ players', t => {
  t.is(0, temaki.value([tMock], [onePlayedPlayer, onePlayedPlayer]));
  t.is(0, temaki.value([], [noPlayedPlayer, noPlayedPlayer]));
});

test('scores 4 when played maximum', t => {
  t.is(4, temaki.value([tMock], [noPlayedPlayer]));
  t.is(4, temaki.value([tMock, tMock], [onePlayedPlayer]));
  t.is(4, temaki.value([tMock, tMock, tMock], [twoPlayedPlayer]));
  t.is(
    4,
    temaki.value(
      [tMock, tMock, tMock],
      [twoPlayedPlayer, onePlayedPlayer, noPlayedPlayer]
    )
  );
});

test('scores 4 when played tied for maximum, with 1 loser', t => {
  t.is(4, temaki.value([tMock], [onePlayedPlayer, noPlayedPlayer]));
  t.is(4, temaki.value([tMock, tMock], [twoPlayedPlayer, onePlayedPlayer]));
});
