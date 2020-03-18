const clone = require('rfdc')({ proto: false, circles: true });
const { turnCount } = require('./utils');

module.exports = class GameState {
  constructor({ deck, players, gameType, turn = 1, round = 1, dessertCards }) {
    this.cards = { deck, dessertCards };
    this.gameType = gameType;
    this.winner = undefined;
    this.players = players;
    this.round = round;
    this.turn = turn;
  }

  playATurn = () => {
    const boardStates = this.players.map(player => player.boardState);

    this.players.forEach(player => player.preparePlay(boardStates));

    this.players.forEach(player => player.bonusAnnouncePlay(boardStates));

    const cardsPlayed = this.players.map(player => player.cardsToPlay);
    const expectedPlayedCards = this.players.map(player =>
      player.boardState.playedCards.concat(player.cardsToPlay)
    );

    this.players.forEach(player =>
      player.playCards(cardsPlayed, expectedPlayedCards)
    );

    this.players.forEach(player => player.passCards(this.players));
  };

  node;

  playAllTurns = () => {
    Array.from(Array(turnCount(this.players.length))).forEach(this.playATurn);
  };

  playARound = () => {
    this.playAllTurns();
    this.round += 1;
    this.turn = 1;

    const { round, players, cards } = this;
    const { deck, dessertCards } = cards;

    const clonedPlayers = players.map(clone);
    const playerCount = clonedPlayers.length;

    // score the board, other players played cards are definitely needed
    // they're passed in as an array of arrays of cards
    this.players.forEach(player =>
      player.scoreBoard(this.round, this.gameType, clonedPlayers)
    );

    // return played cards _(save desserts)_ to the deck
    this.players.forEach(player => player.resetRound(this.cards.deck));

    this.cards.deck.shuffle();

    this.cards.dessertCards = deck.topUpDesserts({
      round,
      playerCount,
      dessertCards,
    });

    // set winner in final round
    if (this.round > 3) {
      const winner = this.players.sort((a, b) =>
        a.boardState.score > b.boardState.score ? -1 : 1
      )[0];
      this.winner = winner;
    } else {
      // otherwise, give all players their hands
      this.players.forEach(player =>
        player.setHand(this.cards.deck.draw(turnCount(this.players.length)))
      );
    }
  };

  playAGame = () => {
    this.playARound();
    this.playARound();
    this.playARound();
  };

  getPlayerScores = () => {
    return this.players
      .map(player => player.boardState.score)
      .sort((a, b) => (a > b ? -1 : 1));
  };
};
