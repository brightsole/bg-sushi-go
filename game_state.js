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
    this.players = players;
    this.round = round;
    this.turn = turn;
  }

  playATurn = () => {
    // TODO: complete play will need all plays expected to be accurate
    // eslint-disable-next-line no-unused-vars
    const cardsPlayed = this.players.map(player => player.sortHandByValue()[0]);

    this.players.forEach(player => player.playCard());

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
    const playerCount = this.players.length;

    // score the board, other players played cards are definitely needed
    // they're passed in as an array of arrays of cards
    players.forEach(player =>
      player.scoreBoard(
        this.round,
        players
          .filter(otherPlayer => otherPlayer.id !== player.id)
          .map(otherPlayer => otherPlayer.boardState)
      )
    );

    // return played cards _(save desserts)_ to the deck
    players.forEach(player => player.resetRound(this.cards.deck));
    this.cards.dessertCards = deck.topUpDesserts({
      round,
      playerCount,
      dessertCards,
    });

    // if final round, log score
    if (this.round > 3) {
      const winner = this.players.sort((a, b) =>
        a.boardState.score > b.boardState.score ? -1 : 1
      )[0];
      console.log('winner: ', winner, 'wins with: ', winner.boardState.score);
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
