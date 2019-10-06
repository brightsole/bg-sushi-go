const nanoid = require('nanoid');
const { scoreCards } = require('./cards');
const { playCard } = require('./history');

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

  playCard = (allPlayedCards, expectedPlayedCards) => {
    const { playedCards } = this.boardState;

    this.history += this.loggingEnabled
      ? playCard({ id: this.id, card: this.cardToPlay })
      : '';

    this.cardToPlay.play({
      boardState: this.boardState,
      card: this.cardToPlay,
      expectedPlayedCards,
      allPlayedCards,
    });

    this.boardState.playedCards = playedCards.concat(this.cardToPlay);

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

  scoreBoard = (round, gameType, player, players) => {
    this.boardState.round = round;

    // TODO: fix round to be 1,2,3 instead of 2,3,4
    // score the desserts on the final round
    if (round > 3) {
      const dessertTypes = gameType.dessert;

      dessertTypes.forEach(dessertType => {
        const cardsSum = scoreCards({
          cardType: dessertType,
          players,
          player,
        });

        this.boardState.score += cardsSum;
      });
    }

    Object.keys(gameType)
      .filter(e => e !== 'dessert')
      .forEach(cardTypeName => {
        const baseCardTypes = gameType[cardTypeName];

        baseCardTypes.forEach(cardType => {
          const cardsSum = scoreCards({
            cardType,
            players,
            player,
          });

          this.boardState.score += cardsSum;
        });
      });
  };
};
