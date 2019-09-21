const nanoid = require('nanoid');
const { scoreCards } = require('./cards');

module.exports.Player = class {
  constructor({
    hand = [],
    round = 1,
    score = 0,
    id = nanoid(),
    desserts = [],
    neighbors = [],
    playedCards = [],
    scoringAlgorithm = Math.random,
  } = {}) {
    this.id = id;
    this.hand = hand;
    this.cardsToPass = [];
    this.scoringAlgorithm = scoringAlgorithm;

    this.boardState = {
      score,
      round,
      desserts,
      neighbors,
      playedCards,
    };
  }

  setHand = cards => {
    this.hand = cards;
  };

  resetRound = deck => {
    const { playedCards } = this.boardState;

    const desserts = playedCards.filter(card => card.type === 'dessert');
    const rest = playedCards.filter(card => card.type !== 'dessert');

    this.boardState.desserts = this.boardState.desserts.concat(desserts);
    this.boardState.playedCards = [];

    deck.returnCards(rest);
  };

  setNeighbors = (leftId, rightId) => {
    this.boardState.neighbors = [leftId, rightId];
  };

  sortHandByValue = () => {
    return this.hand.sort((a, b) =>
      this.scoringAlgorithm(a) > this.scoringAlgorithm(b) ? -1 : 1
    );
  };

  playCard = (evaluatePlay = card => card) => {
    console.log('lfkjsdf', this.sortHandByValue().map(e => e.value));
    const bestCard = this.sortHandByValue()[0];
    const playedState = this.boardState.playedCards;

    this.boardState.playedCards = [...playedState, evaluatePlay(bestCard)];
    this.cardsToPass = this.sortHandByValue().slice(1);

    this.setHand([]);
  };

  passCards = players => {
    const receiver = players.find(
      player => player.id === this.boardState.neighbors[0]
    );

    receiver.setHand(this.cardsToPass);
    this.cardsToPass = [];
  };

  // TODO: complete scores will require the full board state
  // eslint-disable-next-line no-unused-vars
  scoreBoard = (round, allBoardStates) => {
    if (round === 3) {
      const desserts = this.boardState.desserts.concat(
        this.boardState.playedCards.filter(card => card.type === 'dessert')
      );
      this.boardState.score += scoreCards(desserts);
    }

    this.boardState.score += scoreCards(
      this.boardState.playedCards.filter(card => card.type !== 'dessert')
    );
  };
};
