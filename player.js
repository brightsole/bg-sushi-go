const nanoid = require('nanoid');
const { scoreCards } = require('./cards');
const { sum, playCard } = require('./history');

module.exports.Player = class {
  constructor({
    hand = [],
    round = 1,
    score = 0,
    id = nanoid(),
    desserts = [],
    neighbors = [],
    playedCards = [],
    loggingEnabled = false,
    scoringAlgorithm = someHand =>
      someHand.sort(() => (Math.random() > 0.5 ? 1 : -1)),
  } = {}) {
    this.id = id;
    this.hand = hand;
    this.cardsToPass = [];
    this.cardToPlay = undefined;
    this.loggingEnabled = loggingEnabled;
    this.scoringAlgorithm = scoringAlgorithm;
    this.history = '';
    // TODO: refactor config options to cleaner nested structure?

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

  preparePlay = boardStates => {
    const sortedHand = this.scoringAlgorithm(this.hand, boardStates);
    const [bestCard, ...cardsToPass] = sortedHand;

    this.cardToPlay = bestCard;
    this.cardsToPass = cardsToPass;
  };

  playCard = otherCardsBeingPlayed => {
    const playedState = this.boardState.playedCards;
    this.history += this.loggingEnabled
      ? playCard({ id: this.id, card: this.cardToPlay })
      : '';

    this.boardState.playedCards = playedState.concat(
      this.cardToPlay.play(this.cardToPlay, otherCardsBeingPlayed)
    );

    this.setHand([]);
    this.cardToPlay = undefined;
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
      // allows for more than 1 variety of dessert
      // *(no guarantee deck construction will work with nonstandard dessert #s yet)*
      const dessertTypes = gameType.dessert;
      dessertTypes.forEach(dessertBaseType => {
        const dessertCards = this.getCardsByName(dessertBaseType.name);

        const cardsSum = scoreCards(
          dessertCards,
          dessertBaseType,
          otherPlayerBoardstates
        );

        this.history += this.loggingEnabled
          ? sum({
              id: this.id,
              sum: cardsSum,
              cards: dessertCards,
              cardType: dessertBaseType,
            })
          : '';
        this.boardState.score += cardsSum;
      });
    }

    Object.keys(gameType)
      .filter(e => e !== 'dessert')
      .forEach(cardTypeName => {
        const baseCardTypes = gameType[cardTypeName];
        baseCardTypes.forEach(baseCardType => {
          // can't use getCardsByName because old desserts aren't counted
          // in things like color counting
          const cards = this.boardState.playedCards.filter(
            c => c.name === baseCardType.name
          );

          const cardsSum = scoreCards(
            cards,
            baseCardType,
            otherPlayerBoardstates,
            this.boardState.cards // not used in any dessert scoring
          );

          this.history += this.loggingEnabled
            ? sum({
                cardType: baseCardType,
                sum: cardsSum,
                id: this.id,
                cards,
              })
            : '';
          this.boardState.score += cardsSum;
        });
      });
    // so, some thoughts on this:
    // dessert scoring and card scoring is becoming a boatload of props passing
    // it might be time to do a refactor in how scores are assessed.

    this.boardState.score += scoreCards(
      this.boardState.playedCards.filter(card => !card.isDessert),
      otherPlayerBoardstates
    );
  };
};
