const clone = require('rfdc')({ proto: false, circles: true });

module.exports.turnCount = playerCount => {
  if (playerCount < 4) return 10;
  if (playerCount < 6) return 9;
  if (playerCount < 8) return 8;
  return 7; // 8 players
};

module.exports.GameState = class {
  constructor({ deck, dessertCards, players, gameType, round = 1, turn = 1 }) {
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

    const cardsPlayed = this.players.map(player => player.cardToPlay);
    const expectedPlayedCards = this.players.map(player =>
      player.boardState.cardsPlayed.concat(player.cardToPlay)
    );
    this.players.forEach(player =>
      player.playCard(cardsPlayed, expectedPlayedCards)
    );

    this.players.forEach(player => player.passCards(this.players));
  };

  playAllTurns = () => {
    Array.from(Array(module.exports.turnCount(this.players.length))).forEach(
      this.playATurn
    );
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
      player.scoreBoard(this.round, this.gameType, player, clonedPlayers)
    );

    // return played cards _(save desserts)_ to the deck
    this.players.forEach(player => player.resetRound(this.cards.deck));

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
        player.setHand(
          this.cards.deck.draw(module.exports.turnCount(this.players.length))
        )
      );
    }
  };

  playAGame = () => {
    this.playARound();
    this.playARound();
    this.playARound();
  };
};
