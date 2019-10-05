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
  const { name, count, value, color, types, play } = gameCardType;

  if (types) {
    return types.reduce(
      (cardSet, { count: subCount, ...rest }) =>
        cardSet.concat(
          Array.from(Array(subCount)).map(
            () =>
              new Card({
                name,
                type,
                play,
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
        play,
        type,
        name,
      })
  );
};

// if cardType has value as a function, sum those cards using that function
// otherwise sum the cards using a simple reduce addition
/**
 *
 * @param {Object} params - generic properties for scoring
 * @param {Object} params.playerId - this player's id, used for making generic properties
 * @param {Object} params.cardType - the base card type constructed at start of game
 * @param {Object} params.players - every player, for use in complicated value calcs
 */
module.exports.scoreCards = ({ cardType, players, playerId }) => {
  // what follows are very useful constructed properties made from the generics passed in
  const player = players.find(p => p.id === playerId);

  const cardsOfTypePlayed = player.boardState.playedCards.filter(
    c => c.name === cardType.name
  );
  const otherCardsOfType = players
    .filter(p => p.id !== playerId)
    .map(p => p.boardState.playedCards.filter(c => c.name === cardType.name));

  return typeof cardType.value === 'function'
    ? cardType.value({
        player,
        players,
        otherCardsOfType,
        cardsOfTypePlayed,
      })
    : cardsOfTypePlayed.reduce((total, card) => {
        if (typeof card.value === 'number') return total + card.value;

        return total;
      }, 0);
};
