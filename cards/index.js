const rolls = require('./roll');
const nigiri = require('./nigiri');
const specials = require('./special');
const desserts = require('./dessert');
const appetizers = require('./appetizer');
const { Card } = require('./card');

// filter card types that cannot be played with x playercount
const byPlayerCount = playerCount => cardType => {
  const { minPlayers, maxPlayers } = cardType;

  if (minPlayers && playerCount < minPlayers) return false;
  if (maxPlayers && playerCount > maxPlayers) return false;
  return true;
};

module.exports.getSetupByPlayerCount = playerCount => ({
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

// ouput all the cards in whatever cardset you pick
module.exports.generateCardSet = ({ type, gameCardType }) => {
  const { count, name, value, color, types } = gameCardType;

  if (types) {
    return types.reduce(
      (cardSet, { count: subCount, ...rest }) =>
        cardSet.concat(
          Array.from(Array(subCount)).map(
            () =>
              new Card({
                name,
                type,
                value,
                color,
                ...rest,
              })
          )
        ),
      []
    );
  }

  return Array.from(Array(count)).map(
    () =>
      new Card({
        color,
        value,
        type,
        name,
      })
  );
};

// TODO: this has a disasterous bug for *at least* dessert scoring
// if the player owns 0 of them, they aren't scored, and that *will usually*
// mean they're scored incorrectly. This scoring method needs refactored
module.exports.scoreCards = (cards, otherPlayerBoardstates) =>
  cards.reduce((total, card) => {
    if (typeof card.value === 'number') return total + card.value;

    // if card has a score function, run it to get the score
    if (typeof card.value === 'function') {
      return total + card.value(cards, otherPlayerBoardstates);
    }

    return total;
  }, 0);
