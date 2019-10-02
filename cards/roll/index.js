const temaki = {
  name: 'temaki',
  color: 'dark-purple',
  shapes: { temaki: 1 },
  valueDescription: 'most 4, min -4 | 2p: min 0',
  value: (temakiCards, otherPlayerBoardstates) => {
    const otherPlayersTemaki = otherPlayerBoardstates.map(boardState =>
      boardState.playedCards.filter(card => card.name === 'temaki')
    );

    const minOther = otherPlayersTemaki.reduce(
      (min, rolls) => (rolls.length < min ? rolls.length : min),
      Infinity
    );
    const maxOther = otherPlayersTemaki.reduce(
      (max, rolls) => (rolls.length > max ? rolls.length : max),
      -Infinity
    );

    const temakiCount = temakiCards.length;

    const playerCount = otherPlayerBoardstates.length + 1;
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

const uramaki = {
  name: 'uramaki',
  color: 'bright-green',
  valueDescription: 'first to 10: 8, 5, 2',
  // so, the in-game description of scoring expects you to score
  // immediately, but we may assign score, and flip, assigning the same
  // scores at the end of round by setting card values at time of play
  // play: (
  //  card,
  //  allPlayedCards,  // unused
  //  [player.cardToPlay.concat(player.boardState.playedCards)],
  //  selfBoardState
  // ) => {},
  //  :point_up: that's hairy, probably denotes necessary refactor
  // value: () also necessary because unflipped cards at end of round might be scored
  types: [
    { count: 4, shapes: { uramaki: 3 } },
    { count: 4, shapes: { uramaki: 4 } },
    { count: 4, shapes: { uramaki: 5 } },
  ],
};

const getMakiCount = cards =>
  cards
    .filter(card => card.name === 'maki')
    .reduce((sum, makiCard) => sum + makiCard.shapes.maki, 0);

const maki = {
  name: 'maki',
  color: 'red',
  valueDescription: 'max: 6, 3 | 6p+: 6, 4, 2',
  value: (makiCards, otherPlayerBoardstates) => {
    const ourMakiCount = getMakiCount(makiCards);
    const otherMakiCounts = otherPlayerBoardstates.map(boardState =>
      getMakiCount(boardState.playedCards)
    );

    // unlike uramaki, tied scoring does not occupy lower scoring positions
    // so the [...new Set] is used as a cheap `unique` to allow ties in this way
    const allCounts = [...new Set(otherMakiCounts.concat(ourMakiCount))].sort(
      (a, b) => (a > b ? -1 : 1)
    );

    const ourPosition = allCounts.findIndex(count => count === ourMakiCount);

    const playerCount = otherPlayerBoardstates.length + 1;
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
