module.exports = [
  {
    name: 'nigiri',
    color: 'yellow',
    types: [
      { cardName: 'egg nigiri', count: 4, value: 1 },
      { cardName: 'squid nigiri', count: 3, value: 3 },
      { cardName: 'salmon nigiri', count: 5, value: 2 },
    ],
    // THOUGHTS:
    // this is a pattern of play evaluation that isn't inherently extendable
    // nigiri (or more cards acted on), shouldn't need to be aware of all possible actors
    // it would be more ideal if the wasabi card was listening for nigiri to be played
    // once play algos are all done, it might be better to think about a refactor.
    play: ({ card, boardState }) => {
      const lastAvailableWasabi = boardState.playedCards.find(
        c => c.name === 'wasabi' && !c.flipped
      );

      if (lastAvailableWasabi) {
        card.setScore(3 * card.value);
        lastAvailableWasabi.flip();
      }
    },
  },
];
