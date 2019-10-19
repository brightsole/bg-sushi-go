const { Player } = require('./player');
const { History } = require('./history');
const { GameState, turnCount } = require('./game_state');
const { prepareDeck, Deck } = require('./deck');

module.exports.setup = ({ cardTypeNames, players = [], log } = {}) => {
  const history = new History(log);

  // any empty object uses Math.random to pick cards
  const instantiatedPlayers = players.map(
    player => new Player({ history, ...player })
  );

  const playerCount = instantiatedPlayers.length;

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
  instantiatedPlayers.forEach((player, index) => {
    // draw their cards
    player.setHand(deck.draw(turnCount(playerCount)));
    player.saveAllPossibleCardClones(allPossibleCards);

    // alert them of their neighbors
    const left =
      index - 1 < 0
        ? instantiatedPlayers[players.length - 1].id
        : instantiatedPlayers[index - 1].id;
    const right =
      index + 1 >= players.length
        ? instantiatedPlayers[0].id
        : instantiatedPlayers[index + 1].id;
    player.setNeighbors(left, right);
  });

  return [
    new GameState({
      deck,
      history,
      gameType,
      dessertCards,
      players: instantiatedPlayers,
    }),
    history,
  ];
};
