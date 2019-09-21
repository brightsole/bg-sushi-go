const nanoid = require('nanoid');
const getSetupByPlayerCount = require('./cards');
const { selectUniqueRandoms, shuffle } = require('./utils');

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

// create the random array of card types used to play a game
const randomGameType = playerCount => {
  const BOARD = { nigiri: 1, roll: 1, dessert: 1, special: 2, appetizer: 3 };
  const cardtypeOptions = getSetupByPlayerCount(playerCount);

  return Object.keys(BOARD).reduce((gameResult, cardType) => {
    const count = BOARD[cardType];

    const { options, count: optionCount } = cardtypeOptions[cardType];
    const possibleOptions = options.length - 1;

    const selections = selectUniqueRandoms(possibleOptions, count);
    return {
      ...gameResult,
      [cardType]: selections.map(index => ({
        count: optionCount,
        ...options[index],
      })),
    };
  }, {});
};

// ouput all the cards in whatever cardset you pick
const generateCardSet = ({ type, gameCardType }) => {
  const { count, name, value, color, types } = gameCardType;

  if (types) {
    return types.reduce(
      (cardSet, { count: subCount, ...rest }) =>
        cardSet.concat(
          Array.from(Array(subCount)).map(() => ({
            name,
            type,
            value,
            color,
            ...rest,
            id: nanoid(),
          }))
        ),
      []
    );
  }

  return Array.from(Array(count)).map(() => ({
    id: nanoid(),
    color,
    value,
    type,
    name,
  }));
};

/**
 * Prep the deck!
 * Gives back a new deck, and the leftover dessert cards,
 * if not on turn 1 it gives back the updated totals
 * always returns data well shuffled
 *
 * @param {Number = 2} playerCount - players for the game
 * @param {Number = 1} round - 1-3, the round of the game
 * @param {Object} preExisting - the deck/dessertRemainder cards
 * @param {Object} gameType - supply a type setup with selected cardtypes
 */
module.exports.prepareDeck = ({
  playerCount,
  preExisting,
  round = 1,
  gameType,
}) => {
  if (!preExisting) {
    const gameTypeCards = gameType || randomGameType(playerCount);
    console.log(
      'gametype selected: ',
      Object.keys(gameTypeCards)
        .flatMap(e => `\n${e}: ${gameTypeCards[e].map(f => f.name).join(', ')}`)
        .join('')
    );

    const allCards = Object.keys(gameTypeCards).reduce((all, type) => {
      const options = gameTypeCards[type];

      const cards = options.flatMap(gameCardType =>
        generateCardSet({ type, gameCardType })
      );
      return all.concat(cards);
    }, []);

    const dessertCards = allCards.filter(e => e.type === 'dessert');
    const deck = allCards.filter(e => e !== 'dessert');

    return addDessertCards({ deck, dessertCards, playerCount, round });
  }

  const { deck = [], dessertCards } = preExisting;
  return addDessertCards({ deck, dessertCards, playerCount, round });
};

module.exports.Deck = class {
  constructor(cards) {
    this.cards = cards;
  }

  draw = count => {
    const drawnCards = this.cards.slice(0, count);
    this.cards = this.cards.slice(count);

    return drawnCards;
  };

  returnCards = cards => {
    // remove any extraneous properties from the cards
    const cleanedCards = cards.map(
      ({ id, name, type, value, color, shape }) => ({
        id,
        name,
        type,
        value,
        color,
        shape,
      })
    );

    this.cards = this.cards.concat(cleanedCards);
  };
};

// const PLAYER_COUNT = 6;
// const testCards = module.exports.prepareDeck({ playerCount: PLAYER_COUNT });
// const round2Cards = module.exports.prepareDeck({
//   playerCount: PLAYER_COUNT,
//   round: 2,
//   preExisting: testCards,
// });
// const round3Cards = module.exports.prepareDeck({
//   playerCount: PLAYER_COUNT,
//   round: 3,
//   preExisting: round2Cards,
// });
// console.log(
//   'a deck length:',
//   testCards.deck.length,
//   'dessert leftover length',
//   testCards.dessertCards.length
// );
// console.log(
//   'b deck length:',
//   round2Cards.deck.length,
//   'dessert leftover length',
//   round2Cards.dessertCards.length
// );
// console.log(
//   'c deck length:',
//   round3Cards.deck.length,
//   'dessert leftover length',
//   round3Cards.dessertCards.length
// );
// console.log(round2Cards);
