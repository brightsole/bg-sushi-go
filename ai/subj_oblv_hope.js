const BAD = -10;

// it'd be great to get a gut feel for every card type
// that way this algo can compete with random in all random game types
// already `mostOthersPlayed` would be a useful metric
/* eslint-disable-next-line no-unused-vars */
const gutValue = ({ remainingCount, playerCount, ourPlayed, card }) => ({
  // appetizers
  onigiri: 3,
  tempura: ourPlayed % 2 !== 0 ? 5 : 1.5,
  edamame: Math.min(1 * (playerCount - 1), 4),
  'miso soup': remainingCount === 0 ? 3 : 1.5,
  dumpling: 2, // could have used ourPlayed here
  eel: ourPlayed === 2 || ourPlayed + remainingCount <= 1 ? BAD : 3.25,
  tofu: ourPlayed === 2 ? BAD : 2, // playerCount also would be good here
  sashimi: ourPlayed === 3 ? BAD : 3, // playerCount would also be good here
  // fruit
  fruit: 5,
  pudding: 2,
  'green tea ice cream': ourPlayed === 4 ? BAD : remainingCount / playerCount,
  // nigiri types
  'egg nigiri': 1,
  'squid nigiri': 2,
  'salmon nigiri': 3,
  // rolls
  maki: card.shapes && card.shapes.maki / 3, // also simple, but maki suxxorz
  uramaki: card.shapes && card.shapes.uramaki, // overly simple, but is decent
  temaki: playerCount === 2 ? 1 : 1 / Math.min(Math.sqrt(ourPlayed), 1),
  // specials
  tea: 3,
  wasabi: 2.5,
  'soy sauce': 1.5, // very much oversimplified
  'special order': 0, // PLAY NOT IMPLEMENTED PROPERLY YET
  'takeout box': 0, // PLAY NOT IMPLEMENTED PROPERLY YET
  chopsticks: 10, // PLAY NOT IMPLEMENTED PROPERLY YET
  spoon: 0, // PLAY NOT IMPLEMENTED PROPERLY YET
  menu: 0, // PLAY NOT IMPLEMENTED PROPERLY YET
});

const getRemaining = ({ card, allPossibleCards, allPlayedCards }) =>
  allPossibleCards
    .filter(c => c.name === card.name && c.id !== card.id)
    .filter(c => !allPlayedCards.some(playedCard => playedCard.id === c.id));

const getScore = ({ playerCount, allPlayedCards, allPossibleCards, card }) => {
  const ourPlayed = allPlayedCards.filter(c => c.name === card.name);
  const remainingCount = getRemaining({
    card,
    allPlayedCards,
    allPossibleCards,
  });

  const name = card.cardName || card.name;
  return gutValue({ remainingCount, playerCount, ourPlayed, card })[name];
};

/**
 * Subjective algo!
 *
 * I... kinda lost the thread on how to accomplish probability spaces
 * in a clean manner.
 *
 * So, in the meantime, it's simpler to do gut-feel approximations for both
 * card value *&* card score probabilities.
 *
 * While writing this AI, it should give the required insight into what's
 * necessary to write the full solved-space algos for simple-refactored, and
 * for simple eagle.
 *
 * Plus! It'll be fun to see how well the gut feel of value/probability can get this
 * ai to beating worst & random.
 *
 * @param {params} params - given to all ai
 * @param {Card[]} params.hand - the hand, to be returned sorted, best plays first
 * @param {Card[]} params.boardStates - every player's previously played cards for this turn
 * @param {Card[]} params.allPossibleCards - cloned cards from deck creation. Lists everything
 */
module.exports.subjective = ({
  hand,
  announceCards,
  boardStates,
  allPossibleCards,
}) => {
  const playerCount = boardStates.length;
  const allPlayedCards = boardStates.flatMap(bState => bState.playedCards);

  return hand
    .concat(announceCards)
    .sort((a, b) =>
      getScore({ card: a, allPlayedCards, playerCount, allPossibleCards }) >
      getScore({ card: b, allPlayedCards, playerCount, allPossibleCards })
        ? -1
        : 1
    );
};

/**
 * RESULTS!
 *
 * w.o.w. The laziest rules here have created a powerful competitor to random
 *
 * Its effectiveness increases massively as playerCount increases,
 * which means my mental model breaks down HARD in smaller playercount games
 */

// 1v1 - card setup used in `worst` ai
// wins: 1392, so 20% above average
// winnerAvg:  54.383
// allPlayersAvg:  48.76

// 1v5 - totally random card setup
// wins: 1174, so 40% above average!!!
// winnerAvg:  49.8945
// allPlayersAvg:  37.6976

// 1v7 - totally random
// wins: 1141 MASSIVE!!!!
// winnerAvg:  40.903
// allPlayersAvg:  27.58925

// 3 players, all subjective
// wins: 713 approx 1/3
// winnerAvg:  51.86
// allPlayersAvg:  45.156666666666666
/* this tells us the algo isn't competitive with itself at all; no surprise there */
/* and also likely tells us the game has no first-player bias */
