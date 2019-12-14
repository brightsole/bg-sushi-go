const clone = require('rfdc')({ proto: false, circles: true });
const { default: CardPile } = require('@brightsole/bg-card-pile');
const { selectUniqueIndices, shuffle } = require('@brightsole/bg-utils');
const { generateCardSet, getSetupByPlayerCount } = require('./cards');

const BOARD = { nigiri: 1, roll: 1, dessert: 1, special: 2, appetizer: 3 };

// return the nubmer of cards that need to be added on x round
// with y number of players
const getDessertCardCount = (playerCount, round) => {
  if (round === 1) return playerCount > 5 ? 7 : 5;
  if (round === 2) return playerCount > 5 ? 5 : 3;
  return playerCount > 5 ? 3 : 2;
};

// remove dessert cards from remainder pool,
// add them to the deck, and shuffle all the above
const addDessertCards = ({ deck, dessertCards, playerCount, round }) => {
  const desserts = shuffle(dessertCards);
  const numberOfDessertCards = getDessertCardCount(playerCount, round);

  const added = desserts.slice(0, numberOfDessertCards);
  const remainder = desserts.slice(numberOfDessertCards);

  return { deck: shuffle([...deck, ...added]), dessertCards: remainder };
};

// create the random array of card type names used to play a game
module.exports.randomGameType = playerCount => {
  const cardtypeOptions = getSetupByPlayerCount(playerCount);

  return Object.keys(BOARD).reduce((cardNames, cardType) => {
    const count = BOARD[cardType];

    const { options } = cardtypeOptions[cardType];
    const possibleOptions = options.length - 1;

    const selections = selectUniqueIndices({
      max: possibleOptions,
      numberToSelect: count,
    });

    return cardNames.concat(selections.map(index => options[index].name));
  }, []);
};

/**
 * Returns a gameType setup based on an array of card type names passed in
 *
 * WARNING: it's possible to construct game breaking decks this way
 * there is no validation done on types of cards, or checking that they
 * are valid for this number of players
 *
 * @param {String[]} cardTypeNames - array of card type names to select as a game type
 * @param {Number} playerCount - number of players, used to filter options
 */
const createGameType = (cardTypeNames, playerCount) => {
  const cardtypeOptions = getSetupByPlayerCount(playerCount);

  const getType = name =>
    Object.keys(cardtypeOptions).find(key =>
      cardtypeOptions[key].options.some(option => option.name === name)
    );
  const getSelection = name =>
    cardtypeOptions[getType(name)].options.find(option => option.name === name);

  return cardTypeNames.reduce((gameResult, cardTypeName) => {
    const cardType = getType(cardTypeName);
    const selection = {
      ...getSelection(cardTypeName),
      count: cardtypeOptions[cardType].count,
    };

    const preExisting = gameResult[cardType];
    return {
      ...gameResult,
      [cardType]: preExisting ? [...preExisting, selection] : [selection],
    };
  }, {});
};

/**
 * Prep the deck!
 * Gives back a new deck, and the leftover dessert cards,
 * if not on turn 1 it gives back the updated totals
 * always returns data well shuffled
 *
 * @param {Number = 2} playerCount - players for the game
 * @param {Number = 1} round - 1-3, the round of the game
 * @param {Object} gameType - supply a type setup with selected cardtypes
 */
module.exports.prepareDeck = ({
  history,
  playerCount,
  cardTypeNames = module.exports.randomGameType(this.playerCount),
}) => {
  const gameTypeCards = createGameType(cardTypeNames, playerCount);
  history.selectedGametype({ gameTypeCards });

  const allCards = Object.keys(gameTypeCards).reduce((all, type) => {
    const options = gameTypeCards[type];

    const cards = options.flatMap(gameCardType =>
      generateCardSet({ type, gameCardType })
    );
    return all.concat(cards);
  }, []);

  const dessertCards = allCards.filter(card => card.isDessert);
  const deck = allCards.filter(card => !card.isDessert);

  return {
    gameType: gameTypeCards,
    ...addDessertCards({ deck, dessertCards, playerCount, round: 1 }),
    allPossibleCards: allCards.map(clone), // used by player AI to assess value
  };
};

module.exports.Deck = class extends CardPile {
  // return dessert cards not added to the deck
  topUpDesserts = ({ dessertCards, playerCount, round }) => {
    const { deck, dessertCards: remainder } = addDessertCards({
      deck: this.cards,
      dessertCards,
      playerCount,
      round,
    });

    this.cards = deck;
    return remainder;
  };
};
