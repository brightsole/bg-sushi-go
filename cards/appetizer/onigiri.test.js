import test from 'ava';
import appetizers from './index';

const onigiri = appetizers.find(appetizer => appetizer.name === 'onigiri');

const rectangleCard = { shapes: { rectangle: 1 } };
const triangleCard = { shapes: { triangle: 1 } };
const circleCard = { shapes: { circle: 1 } };
const squareCard = { shapes: { square: 1 } };

test('0 onigiri cards are scored correctly', t => {
  t.is(0, onigiri.value({ cardsOfTypePlayed: [] }));
});

test('1x0x0x0 shapes is scored correctly', t => {
  t.is(1, onigiri.value({ cardsOfTypePlayed: [rectangleCard] }));
});

test('1x1x0x0 shapes is scored correctly', t => {
  t.is(4, onigiri.value({ cardsOfTypePlayed: [squareCard, triangleCard] }));
});

test('1x1x1x0 shapes is scored correctly', t => {
  t.is(
    9,
    onigiri.value({
      cardsOfTypePlayed: [rectangleCard, triangleCard, squareCard],
    })
  );
});

test('1x1x1x1 shapes is scored correctly', t => {
  t.is(
    16,
    onigiri.value({
      cardsOfTypePlayed: [rectangleCard, triangleCard, squareCard, circleCard],
    })
  );
});

test('2x1x1x1 shapes is scored correctly', t => {
  t.is(
    16 + 1,
    onigiri.value({
      cardsOfTypePlayed: [
        rectangleCard,
        triangleCard,
        squareCard,
        circleCard,
        circleCard,
      ],
    })
  );
});

test('2x2x1x1 shapes is scored correctly', t => {
  t.is(
    16 + 4,
    onigiri.value({
      cardsOfTypePlayed: [
        rectangleCard,
        triangleCard,
        triangleCard,
        squareCard,
        squareCard,
        circleCard,
      ],
    })
  );
});

test('2x2x2x1 shapes is scored correctly', t => {
  t.is(
    16 + 9,
    onigiri.value({
      cardsOfTypePlayed: [
        rectangleCard,
        triangleCard,
        triangleCard,
        squareCard,
        squareCard,
        circleCard,
        circleCard,
      ],
    })
  );
});

test('2x2x2x2 shapes is scored correctly', t => {
  t.is(
    16 + 16,
    onigiri.value({
      cardsOfTypePlayed: [
        rectangleCard,
        rectangleCard,
        triangleCard,
        triangleCard,
        circleCard,
        circleCard,
        squareCard,
        squareCard,
      ],
    })
  );
});

test('handles scoring outside normal game bounds: 6x4x3x2', t => {
  t.is(
    16 + 16 + 9 + 4 + 1 + 1,
    onigiri.value({
      cardsOfTypePlayed: [
        ...Array.from(Array(6)).map(() => rectangleCard),
        ...Array.from(Array(4)).map(() => triangleCard),
        ...Array.from(Array(3)).map(() => squareCard),
        ...Array.from(Array(2)).map(() => circleCard),
      ],
    })
  );
});
