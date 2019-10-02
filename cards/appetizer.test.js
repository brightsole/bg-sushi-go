import test from 'ava';
import appetizers from './appetizer';

const onigiri = appetizers.find(appetizer => appetizer.name === 'onigiri');

const rectangleCard = { shapes: { rectangle: 1 } };
const triangleCard = { shapes: { triangle: 1 } };
const circleCard = { shapes: { circle: 1 } };
const squareCard = { shapes: { square: 1 } };

test('0 onigiri cards are scored correctly', t => {
  t.is(0, onigiri.value([]));
});

test('onigiri 1x0x0x0 shapes is scored correctly', t => {
  t.is(1, onigiri.value([rectangleCard]));
});

test('onigiri 1x1x0x0 shapes is scored correctly', t => {
  t.is(4, onigiri.value([squareCard, triangleCard]));
});

test('onigiri 1x1x1x0 shapes is scored correctly', t => {
  t.is(9, onigiri.value([rectangleCard, triangleCard, squareCard]));
});

test('onigiri 1x1x1x1 shapes is scored correctly', t => {
  t.is(
    16,
    onigiri.value([rectangleCard, triangleCard, squareCard, circleCard])
  );
});

test('onigiri 2x1x1x1 shapes is scored correctly', t => {
  t.is(
    16 + 1,
    onigiri.value([
      rectangleCard,
      triangleCard,
      squareCard,
      circleCard,
      circleCard,
    ])
  );
});

test('onigiri 2x2x1x1 shapes is scored correctly', t => {
  t.is(
    16 + 4,
    onigiri.value([
      rectangleCard,
      triangleCard,
      triangleCard,
      squareCard,
      squareCard,
      circleCard,
    ])
  );
});

test('onigiri 2x2x2x1 shapes is scored correctly', t => {
  t.is(
    16 + 9,
    onigiri.value([
      rectangleCard,
      triangleCard,
      triangleCard,
      squareCard,
      squareCard,
      circleCard,
      circleCard,
    ])
  );
});

test('onigiri 2x2x2x2 shapes is scored correctly', t => {
  t.is(
    16 + 16,
    onigiri.value([
      rectangleCard,
      rectangleCard,
      triangleCard,
      triangleCard,
      circleCard,
      circleCard,
      squareCard,
      squareCard,
    ])
  );
});
