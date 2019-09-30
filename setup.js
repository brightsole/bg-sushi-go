const { Player } = require('./player');
const { GameState, turnCount } = require('./game_state');
const { prepareDeck, Deck } = require('./deck');

module.exports.setup = ({ playerCount = 2, cardTypeNames } = {}) => {
  const players = Array.from(Array(playerCount)).map(() => new Player());
  const { deck: fullDeck, dessertCards, gameType } = prepareDeck({
    playerCount,
    cardTypeNames,
  });

  const deck = new Deck(fullDeck);

  // set up all players
  players.forEach((player, index) => {
    // draw their cards
    player.setHand(deck.draw(turnCount(playerCount)));

    // alert them of their neighbors
    const left =
      index - 1 < 0 ? players[players.length - 1].id : players[index - 1].id;
    const right =
      index + 1 >= players.length ? players[0].id : players[index + 1].id;
    player.setNeighbors(left, right);
  });

  return new GameState({ deck, dessertCards, players, gameType });
};
