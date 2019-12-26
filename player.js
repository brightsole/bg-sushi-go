const nanoid = require('nanoid');

module.exports = class Player {
  constructor({
    history,
    hand = [],
    round = 1,
    score = 0,
    id = nanoid(),
    desserts = [],
    neighbors = [],
    playerCount = 2,
    playedCards = [],
    loggingEnabled = false,
    scoringAlgorithm = ({ hand: someHand, announceCards }) =>
      someHand.concat(announceCards).sort(() => (Math.random() > 0.5 ? 1 : -1)),
  } = {}) {
    this.id = id;
    this.hand = hand;
    this.cardsToPass = [];
    this.cardsToPlay = [];
    this.history = history;
    this.loggingEnabled = loggingEnabled;
    this.scoringAlgorithm = scoringAlgorithm;
    // TODO: refactor config options to cleaner nested structure

    this.boardState = {
      playedCards,
      playerCount,
      neighbors,
      desserts,
      round,
      score,
    };
  }

  setHand = cards => {
    this.hand = cards;
  };

  setCardsToPlay = cards => {
    this.cardsToPlay = cards;
  };

  setCardsToPass = cards => {
    this.cardsToPass = cards;
  };

  removePlayedCard = cardId => {
    const card = this.boardState.playedCards.filter(c => c.id === cardId);
    this.boardState.playedCards = this.boardState.playedCards.filter(
      c => c.id !== cardId
    );
    return card;
  };

  resetRound = deck => {
    const { playedCards } = this.boardState;

    const desserts = playedCards.filter(card => card.isDessert);
    const rest = playedCards.filter(card => !card.isDessert);

    this.boardState.desserts = this.boardState.desserts.concat(desserts);
    this.boardState.playedCards = [];

    deck.returnToTop(rest);
  };

  setNeighbors = (leftId, rightId) => {
    this.boardState.neighbors = [leftId, rightId];
  };

  saveAllPossibleCardClones = allPossibleCards => {
    this.allPossibleCards = allPossibleCards;
  };

  preparePlay = boardStates => {
    const sortedHand = this.scoringAlgorithm({
      boardStates,
      hand: this.hand,
      allPossibleCards: this.allPossibleCards,
      announceCards: this.boardState.playedCards.filter(
        c => c.playType === 'announce'
      ),
      allOurPlayed: this.boardState.playedCards.concat(
        this.boardState.desserts
      ),
    });
    const [bestCard, ...cardsToPass] = sortedHand;

    this.cardsToPlay = [...this.cardsToPlay, bestCard];
    this.cardsToPass = cardsToPass;
  };

  bonusAnnouncePlay = boardStates => {
    const cardToPlay = this.cardsToPlay[0];
    console.log('cardddd', cardToPlay);
    if (
      cardToPlay &&
      cardToPlay.playType === 'announce' &&
      cardToPlay.announce
    ) {
      cardToPlay.announce({ player: this, boardStates, cardId: cardToPlay.id });
    }
  };

  playCards = (allPlayedCards, expectedPlayedCards) => {
    const { playedCards } = this.boardState;

    this.history.playCards({ playerId: this.id, cards: this.cardsToPlay });
    this.cardsToPlay.forEach(
      card =>
        card.play &&
        card.play({
          boardState: this.boardState,
          expectedPlayedCards,
          allPlayedCards,
          card,
        })
    );

    this.boardState.playedCards = playedCards.concat(this.cardsToPlay);

    this.setHand([]);
    this.cardsToPlay = [];
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
    // and dessert scoring only happens on the final round, so it's safe to pass these into the
    // played cards for that round
    const cardsOfTypePlayed = this.boardState.playedCards
      .concat(this.boardState.desserts)
      .filter(c => c.name === cardType.name);
    const otherCardsOfType = players
      .filter(p => p.id !== this.id)
      .map(p =>
        p.boardState.playedCards
          .concat(p.boardState.desserts)
          .filter(c => c.name === cardType.name)
      );

    const sum =
      typeof cardType.value === 'function'
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

    this.history.scoreCards({
      cards: cardsOfTypePlayed,
      playerId: this.id,
      cardType,
      sum,
    });
    return sum;
  };

  scoreBoard = (round, gameType, players) => {
    this.boardState.round = round;

    // TODO: fix round to be 1,2,3 instead of 2,3,4
    // only score the desserts on the final round
    Object.keys(gameType)
      .filter(e => (round <= 3 ? e !== 'dessert' : true))
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
