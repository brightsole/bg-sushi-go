const rolls = require('./roll');
const nigiri = require('./nigiri');
const specials = require('./special');
const desserts = require('./dessert');
const appetizers = require('./appetizer');

// filter card types that cannot be played with x playercount
const byPlayerCount = playerCount => cardType => {
  const { minPlayers, maxPlayers } = cardType;

  if (minPlayers && playerCount < minPlayers) return false;
  if (maxPlayers && playerCount > maxPlayers) return false;
  return true;
};

module.exports = playerCount => ({
  special: {
    count: 3,
    options: specials.filter(byPlayerCount(playerCount)),
  },
  appetizer: {
    count: 8,
    options: appetizers.filter(byPlayerCount(playerCount)),
  },
  nigiri: { count: 12, options: nigiri },
  roll: { count: 12, options: rolls.filter(byPlayerCount(playerCount)) },
  dessert: { count: 15, options: desserts.filter(byPlayerCount(playerCount)) },
});

// evaluate the rooles laterz
module.exports.scoreCards = cards =>
  cards.reduce(
    (result, card) => (typeof card.value === 'number' ? card.value : 0),
    0
  );
