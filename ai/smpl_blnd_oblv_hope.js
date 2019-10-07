const { naiivePossibilities, arrayAdd } = require('./utils');

// WHAT IS THIS?
// these are possiblility spaces, *but* they're not all accurate
// EXAMPLE: pudding, there's actually many combinations of 6 players that
// might lead to 0 score, not just `none played`, `min & max`, and `between min & max`

// MORE IMPORANTLY: this variety of possiblity space collapse _is not extendable_
// it gleans nothing from the cards themselves but their name
// we need a syntax for the `scoreDescription` that can be consumed to generate
// both possibilities *&* probabilities

// FINALLY: this only works for our easiest setup, :point_up: that extendability issue
// means the more time we define these spaces for each card type is time wasted.
const naiivePossibleScores = {
  nigiri: [1, 1, 1, 1, 3, 3, 3, 2, 2, 2, 2, 2],
  temaki: [4, 0, -4],
  onigiri: arrayAdd([0, 1, 4, 9, 16], [0, 1, 4, 9, 16]),
  sashimi: [0, 10, 20],
  edamame: [
    ...Array.from(Array(5)).map((_, i) => i * 4),
    ...Array.from(Array(6)).map((_, i) => i * 3),
    ...Array.from(Array(7)).map((_, i) => i * 2),
    ...Array.from(Array(8)).map((_, i) => i * 1),
  ],
  tea: naiivePossibilities({
    maxOfThisCard: 3,
    maxScoreLength: 5,
  }),
  'soy sauce': naiivePossibilities({
    multiplier: 4,
    maxOfThisCard: 3,
    maxScoreLength: 1,
  }),
  pudding: [6, 0, 0, 0, -6],
};

/**
 * Simple blind oblivious hopeful algo.
 * The simplest algo to implement, it reads the description, and constructs
 * all possible simple scores for each card, then selects the one with the
 * highest average. That's. it.
 *
 * @param {params} params - given to all ai
 * @param {Card[]} params.hand - the hand, to be returned sorted, best plays first
 */
module.exports.worst = ({ hand }) => {
  const idAndScoreArray = hand.map(card => {
    const scoreSum = naiivePossibleScores[card.name].map(
      (sum, score) => sum + score,
      0
    );
    const scoreAverage = scoreSum / naiivePossibleScores[card.name].length;

    return { id: card.id, score: scoreAverage };
  });

  const sortedIdScoreArray = idAndScoreArray.sort((a, b) =>
    a.score > b.score ? -1 : 1
  );

  return sortedIdScoreArray.map(({ id }) => hand.find(card => card.id === id));
};

// so now that we've got a *terrible* AI, we can make some inferrances into the shape of
// the AI to come.
// possibity spaces should accept some arguments:
//  * cardsPreviouslyPlayed
//  * cardsInHand
//  * scorePerCard()
// Also, some helper methods will be useful:
//  * maxCardsOfType()
//  * interpretScoreDescription()
// and, of course, making a generic maths language to describe scoring repeatably
// our naiive `valueDescriptions` are neither consistent nor encompassing

/**
 * RESULTS!
 *
 * 1 worst algo vs 5 random
 * GAMETYPE:
 *    const simplestFullyScoringGame = [
 *     'soy sauce',
 *      'pudding',
 *      'edamame',
 *     'sashimi',
 *      'onigiri',
 *      'nigiri',
 *      'temaki',
 *      'tea',
 *    ];
 *
 * it's mostly random, stdev is HIGH. Algo _barely_ outscores random.
 * Decent hopeful starting plays will become no better than random as the game progresses
 * But hey, 19% win rate means it beats randomness: (1/6 = 16.6...) about 11% improvement!
 */

// winnerAvg:  39.1046
// allPlayersAvg:  31.1621
// score standard dev:  6.652940972983348
// algo won 925 of 5000 games: 19%

// VS ALL RANDOM:

// winnerAvg:  39.0624
// allPlayersAvg:  31.142566666666667
// score standard dev:  6.660788848093406
