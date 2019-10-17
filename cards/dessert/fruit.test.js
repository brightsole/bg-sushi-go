import test from 'ava';
import desserts from './index';

const fruit = desserts.find(dessert => dessert.name === 'fruit');

// const types = [
//   { shapes: { orange: 2 }, count: 2 },
//   { shapes: { pineapple: 2 }, count: 2 },
//   { shapes: { watermelon: 2 }, count: 2 },
//   { shapes: { pineapple: 1, orange: 1 }, count: 3 },
//   { shapes: { watermelon: 1, orange: 1 }, count: 3 },
//   { shapes: { pineapple: 1, watermelon: 1 }, count: 3 },
// ];

test.only('-6 when none played', t => {
  t.is(-2 - 2 - 2, fruit.value({ cardsOfTypePlayed: [] }));
});
