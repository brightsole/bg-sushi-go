const { Player } = require('./player');
const { History } = require('./history');
const { GameState, turnCount } = require('./game_state');
const { prepareDeck, Deck } = require('./deck');

module.exports.setup = ({
  inputPlayers = [],
  playerCount = 2,
  cardTypeNames,
  log,
} = {}) => {
  const history = new History(log);
  /**
   * ai algorithms may be passed in as player constructors,
   * the rest will be filled with random ai players
   */
  const aiPlayers = inputPlayers.map(
    ({ scoringAlgorithm, id }) =>
      new Player({ history, scoringAlgorithm, id, playerCount })
  );
  const randomPlayers = Array.from(Array(playerCount - aiPlayers.length)).map(
    () => new Player({ history, playerCount })
  );

  const players = aiPlayers.concat(randomPlayers);

  const {
    gameType,
    dessertCards,
    deck: fullDeck,
    allPossibleCards,
  } = prepareDeck({
    cardTypeNames,
    playerCount,
    history,
  });

  const deck = new Deck(fullDeck);

  // set up all players
  players.forEach((player, index) => {
    // draw their cards
    player.setHand(deck.draw(turnCount(playerCount)));
    player.saveAllPossibleCardClones(allPossibleCards);

    // alert them of their neighbors
    const left =
      index - 1 < 0 ? players[players.length - 1].id : players[index - 1].id;
    const right =
      index + 1 >= players.length ? players[0].id : players[index + 1].id;
    player.setNeighbors(left, right);
  });

  return [
    new GameState({ deck, dessertCards, players, gameType, history }),
    history,
  ];
};
