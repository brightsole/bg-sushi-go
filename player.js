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
    scoringAlgorithm = (a, b) => a.name >= b.name,
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

    const desserts = playedCards.filter(card => card.isDessert);
    const rest = playedCards.filter(card => !card.isDessert);

    this.boardState.desserts = this.boardState.desserts.concat(desserts);
    this.boardState.playedCards = [];

    deck.returnCards(rest);
  };

  setNeighbors = (leftId, rightId) => {
    this.boardState.neighbors = [leftId, rightId];
  };

  sortHandByValue = () => {
    const bestToWorst = this.hand.sort((a, b) =>
      this.scoringAlgorithm(a, b) ? -1 : 1
    );
    return bestToWorst;
  };

  playCard = (evaluatePlay = card => card) => {
    const sortedCards = this.sortHandByValue();
    const playedState = this.boardState.playedCards;

    const bestCard = sortedCards[0];
    this.boardState.playedCards = playedState.concat(evaluatePlay(bestCard));

    this.cardsToPass = sortedCards.slice(1);

    this.setHand([]);
  };

  passCards = players => {
    const receiver = players.find(
      player => player.id === this.boardState.neighbors[0]
    );

    receiver.setHand(this.cardsToPass);
    this.cardsToPass = [];
  };

  getCardsByName = name => {
    return this.boardState.playedCards
      .concat(this.boardState.desserts)
      .filter(card => card.name === name);
  };

  scoreBoard = (round, gameType, otherPlayerBoardstates) => {
    this.boardState.round = round;

    // TODO: fix round to be 1,2,3 instead of 2,3,4
    if (round > 3) {
      // score the desserts on the final round
      const desserts = this.boardState.desserts.concat(
        this.boardState.playedCards.filter(card => card.isDessert)
      );
      const dessertScore = scoreCards(desserts, otherPlayerBoardstates);
      this.boardState.score += dessertScore;
    }

    this.boardState.score += scoreCards(
      this.boardState.playedCards.filter(card => !card.isDessert),
      otherPlayerBoardstates
    );
  };
};
