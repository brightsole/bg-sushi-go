const temaki = {
  name: 'temaki',
  color: 'dark-purple',
  shapes: { temaki: 1 },
  valueDescription: 'most 4, min -4 | 2p: min 0',
  value: ({
    cardsOfTypePlayed: temakiCards,
    otherCardsOfType: otherPlayersTemaki,
  }) => {
    const minOther = otherPlayersTemaki.reduce(
      (min, rolls) => (rolls.length < min ? rolls.length : min),
      Infinity
    );
    const maxOther = otherPlayersTemaki.reduce(
      (max, rolls) => (rolls.length > max ? rolls.length : max),
      -Infinity
    );

    const temakiCount = temakiCards.length;

    const playerCount = otherPlayersTemaki.length + 1;
    const minimumScore = playerCount === 2 ? 0 : -4;

    const shouldGainMin = temakiCount <= minOther ? minimumScore : 0;
    const shouldGainMax = temakiCount >= maxOther ? 4 : 0;

    // it's possible to have the fewest & most if all players have the same amount
    const totalScore = shouldGainMin + shouldGainMax;

    // set the score to zero to not double-count
    temakiCards.forEach(tCard => tCard.setScore(0));
    return totalScore;
  },
};

const getUnscoredUramaki = cards =>
  cards.filter(c => c.name === 'uramaki' && !c.flipped);
const getUnscoredSum = cards =>
  cards.reduce((sum, uCard) => sum + uCard.shapes.uramaki, 0);

const whenScoredToScore = whenScored => {
  if (whenScored === 0) return 10;
  if (whenScored === 1) return 8;
  if (whenScored === 2) return 5;
  if (whenScored === 3) return 2;
  return 0;
};
const uramaki = {
  name: 'uramaki',
  color: 'bright-green',
  valueDescription: 'first to 10: 8, 5, 2',
  // TODO: play is very similar to value, possible refactor?
  play: ({ card, boardState, expectedPlayedCards }) => {
    const ourUnscored = getUnscoredUramaki(boardState.playedCards);
    const ourUnscoredSum = getUnscoredSum(ourUnscored);

    const thisPlaySum = ourUnscoredSum + card.shapes.uramaki;
    if (thisPlaySum < 10) return;

    // exclude ourself from totals
    const otherExpectedPlayed = expectedPlayedCards.filter(
      playerCards => !playerCards.find(c => c.id === card.id)
    );
    const otherUnscoredSums = otherExpectedPlayed
      .map(cards => getUnscoredSum(getUnscoredUramaki(cards)))
      .filter(sum => sum >= 10);

    const lowestUnoccupiedScoreIndex = otherExpectedPlayed.reduce(
      (lowestIndex, cards) => {
        // only 1 card is assigned a non-zero score when flipping during play
        const scoredUramaki = cards.filter(
          c => c.name === 'uramaki' && c.flipped && c.value > 0
        );

        return lowestIndex + scoredUramaki.length;
      },
      0
    );
    const unflippedIndex = [...otherUnscoredSums, ourUnscoredSum]
      .sort((a, b) => (a > b ? -1 : 1))
      .findIndex(s => s === ourUnscoredSum);

    const finalScore = whenScoredToScore(
      lowestUnoccupiedScoreIndex + unflippedIndex
    );

    card.setScore(finalScore);
    ourUnscored.map(uCard => uCard.setScore(0));
  },
  value: ({ cardsOfTypePlayed: uramakiCards, otherCardsOfType, players }) => {
    const ourUnscoredUramaki = uramakiCards.filter(c => !c.flipped);
    const ourUnscoredSum = getUnscoredSum(ourUnscoredUramaki);

    const otherUnscoredSums = otherCardsOfType.map(cards =>
      getUnscoredSum(cards.filter(c => !c.flipped))
    );

    const lowestUnoccupiedScoreIndex = players.reduce((lowestIndex, player) => {
      // only 1 card is assigned a non-zero score when flipping during play
      const scoredUramaki = player.boardState.playedCards.filter(
        c => c.name === 'uramaki' && c.flipped && c.value > 0
      );

      return lowestIndex + scoredUramaki.length;
    }, 0);

    const unflippedIndex = [...otherUnscoredSums, ourUnscoredSum]
      .sort((a, b) => (a > b ? -1 : 1))
      .findIndex(s => s === ourUnscoredSum);

    // findIndex allows for ties
    const finalScore = whenScoredToScore(
      lowestUnoccupiedScoreIndex + unflippedIndex
    );

    // likely some cards were already assigned scores & flipped
    // only necessary to setScore on the remainder
    ourUnscoredUramaki.forEach(uCard => uCard.setScore(0));
    return finalScore;
  },
  types: [
    { count: 4, shapes: { uramaki: 3 } },
    { count: 4, shapes: { uramaki: 4 } },
    { count: 4, shapes: { uramaki: 5 } },
  ],
};

const getMakiCount = cards =>
  cards.reduce((sum, makiCard) => sum + makiCard.shapes.maki, 0);

const maki = {
  name: 'maki',
  color: 'red',
  valueDescription: 'max: 6, 3 | 6p+: 6, 4, 2',
  value: ({ cardsOfTypePlayed: makiCards, otherCardsOfType }) => {
    const ourMakiCount = getMakiCount(makiCards);
    const otherMakiCounts = otherCardsOfType.map(makis => getMakiCount(makis));

    // unlike uramaki, tied scoring does not occupy lower scoring positions
    // so the [...new Set] is used as a cheap `unique` to allow ties in this way
    const allCounts = [...new Set(otherMakiCounts.concat(ourMakiCount))].sort(
      (a, b) => (a > b ? -1 : 1)
    );

    const ourPosition = allCounts.findIndex(count => count === ourMakiCount);

    const playerCount = otherCardsOfType.length + 1;
    const scores = playerCount >= 6 ? [6, 4, 2] : [6, 3];

    makiCards.forEach(makiCard => makiCard.setScore(0));
    return scores[ourPosition] || 0;
  },
  types: [
    { count: 4, shapes: { maki: 1 } },
    { count: 5, shapes: { maki: 2 } },
    { count: 3, shapes: { maki: 3 } },
  ],
};

// unique to these cards:
// 1. uramaki are scored immediately, and then flipped
// 2. scoring depends on player count

module.exports = [uramaki, temaki, maki];
