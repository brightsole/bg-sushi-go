const chopsticks = {
  name: 'chopsticks',
  color: 'light-cyan',
  playType: 'announce',
  announce: ({ player, boardStates, cardId }) => {
    const sortedHand = player.scoringAlgorithm({
      boardStates,
      hand: player.hand,
      allPossibleCards: player.allPossibleCards,
      allOurPlayed: player.boardState.playedCards.concat(
        player.boardState.desserts
      ),
    });

    const playedChopstick = player.removePlayedCard(cardId);

    player.setCardsToPlay(sortedHand.slice(0, 2));
    player.setCardsToPass(sortedHand.slice(2).concat(playedChopstick));
  },
  valueDescription: 'announce: play 2 in hand, put chopsticks in hand',
};

const sumOfDifferentColours = cards =>
  cards.reduce(
    (colors, card) =>
      colors.find(c => c === card.color) ? colors : colors.concat(card.color),
    []
  ).length;
const soySauce = {
  name: 'soy sauce',
  color: 'yellow-orange',
  valueDescription: '4score if you have most different colored cards',
  value: ({ cardsOfTypePlayed, player, players }) => {
    const colorsPlayed = sumOfDifferentColours(player.boardState.playedCards);

    const otherPlayerColorSums = players.map(p =>
      sumOfDifferentColours(p.boardState.playedCards)
    );
    const playedMax = otherPlayerColorSums.reduce(
      (max, sum) => (max > sum ? max : sum),
      0
    );

    const soyScore = colorsPlayed >= playedMax ? 4 : 0;

    return soyScore * cardsOfTypePlayed.length;
  },
};

const takeoutBox = {
  name: 'takeout box',
  color: 'light-brown',
  valueDescription: 'transform any previous into 2score',
};

const spoon = {
  name: 'spoon',
  minPlayers: 3,
  color: 'dark-grey',
  playType: 'announce',
  valueDescription: 'announce: trade for card with leftmost owner',
};

const specialOrder = {
  maxPlayers: 6,
  color: 'rainbow',
  name: 'special order',
  valueDescription: 'copy 1 previous',
};

const menu = {
  name: 'menu',
  maxPlayers: 6,
  color: 'light-yellow',
  valueDescription: 'draw 4, play one, return menu & rest',
};

const tea = {
  name: 'tea',
  color: 'dark-red',
  valueDescription: '1score x largest color set',
  value: ({ cardsOfTypePlayed: teaCards, player }) => {
    const teaCount = teaCards.length;

    const countMap = player.boardState.playedCards.reduce(
      (counts, card) =>
        counts[card.color]
          ? { ...counts, [card.color]: counts[card.color] + 1 }
          : { ...counts, [card.color]: 1 },
      {}
    );

    const maxCount =
      Object.values(countMap).sort((a, b) => (a > b ? -1 : 1))[0] || 0;

    return maxCount * teaCount;
  },
};

const wasabi = {
  name: 'wasabi',
  color: 'yellow',
  valueDescription: 'next nigiri x3',
};

// unique to these cards:
// 1. announce: plays
// 2. flipping cards
// 3. future cards played being affected
// 4. copying previous cards
// 5. trading
// 6. value based on colors
// 7. playing more than one card

module.exports = [
  specialOrder,
  chopsticks,
  takeoutBox,
  soySauce,
  wasabi,
  spoon,
  menu,
  tea,
];
