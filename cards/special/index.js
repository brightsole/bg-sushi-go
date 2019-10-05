const chopsticks = {
  name: 'chopsticks',
  color: 'light-cyan',
  valueDescription: 'announce: play 2 in hand, put chopsticks in hand',
};
const soySauce = {
  name: 'soy sauce',
  color: 'yellow-orange',
  valueDescription: '4score if you have most different colored cards',
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
  valueDescription: 'draw 4, play one, shuffle',
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

    teaCards.forEach(t => t.setScore(0));
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
