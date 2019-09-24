module.exports.turnCount = playerCount => {
  if (playerCount < 4) return 10;
  if (playerCount < 6) return 9;
  if (playerCount < 8) return 8;
  return 7; // 8 players
};

module.exports.GameState = class {
  constructor({ deck, dessertCards, players, round = 1, turn = 1 }) {
    this.cards = { deck, dessertCards };
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

    const boardStates = this.players.map(player => player.boardState);
    this.players.forEach(player => player.scoreBoard(this.round, boardStates));

    this.players.forEach(player => player.resetRound(this.cards.deck));

    this.players.forEach(player =>
      player.setHand(
        this.cards.deck.draw(module.exports.turnCount(this.players.length))
      )
    );

    console.log(this.players.map(player => player.boardState.score));
    if (this.round === 3) {
      const winner = this.players.sort((a, b) =>
        a.boardState.score > b.boardState.score ? -1 : 1
      )[0];
      console.log('w: ', winner, 'wins with: ', winner.boardState.score);
    }

    this.round += 1;
    this.turn = 1;
  };

  playAGame = () => {
    this.playARound();
    this.playARound();
    this.playARound();
  };
};
