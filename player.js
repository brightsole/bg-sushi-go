const nanoid = require('nanoid');
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
    scoringAlgorithm = ({ hand: someHand }) =>
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
    const sortedHand = this.scoringAlgorithm({ hand: this.hand, boardStates });
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

  /**
   * if cardType has value as a function, sum those cards using that function
   * otherwise sum the cards using a simple reduce addition
   *
   * @param {Object} params - generic properties for scoring
   * @param {Object} params.players - every player, for use in complicated value calcs
   * @param {Object} params.cardType - the base card type constructed at start of game
   */
  scoreCards = ({ cardType, players }) => {
    // what follows are very useful constructed properties made from the generics passed in
    const cardsOfTypePlayed = this.boardState.playedCards.filter(
      c => c.name === cardType.name
    );
    const otherCardsOfType = players
      .filter(p => p.id !== this.id)
      .map(p => p.boardState.playedCards.filter(c => c.name === cardType.name));

    return typeof cardType.value === 'function'
      ? cardType.value({
          players,
          player: this,
          otherCardsOfType,
          cardsOfTypePlayed,
        })
      : cardsOfTypePlayed.reduce((total, card) => {
          if (typeof card.value === 'number') return total + card.value;

          return total;
        }, 0);
  };

  scoreBoard = (round, gameType, players) => {
    this.boardState.round = round;

    // TODO: fix round to be 1,2,3 instead of 2,3,4
    // score the desserts on the final round
    if (round > 3) {
      const dessertTypes = gameType.dessert;

      dessertTypes.forEach(dessertType => {
        const cardsSum = this.scoreCards({
          cardType: dessertType,
          players,
        });

        this.boardState.score += cardsSum;
      });
    }

    Object.keys(gameType)
      .filter(e => e !== 'dessert')
      .forEach(cardTypeName => {
        const baseCardTypes = gameType[cardTypeName];

        baseCardTypes.forEach(cardType => {
          const cardsSum = this.scoreCards({
            cardType,
            players,
          });

          this.boardState.score += cardsSum;
        });
      });
  };
};
