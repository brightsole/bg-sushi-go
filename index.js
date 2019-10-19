const { randomGameType } = require('./deck');
const { setup } = require('./setup');
const aiAlgorithms = require('./ai');

module.exports = {
  /**
   * Return card names for a random game type, given you know the player count!
   *
   * @param {Number} playerCount - some cards can't be played on lower player counts
   */
  randomGameType,
  /**
   * pre-written AI algorithms, exposed for use!
   *
   * {
   *   worst,
   *   subjective,
   * }
   */
  aiAlgorithms,
  /**
   * the setup function!
   *
   * const [gameState, history] = setup({ ...options });
   * gameState.playGame();
   * @param {Object} options - gameState options
   * @param {Object[]} options.players - player options for making players
   * @param {Function} options.players[i].scoringAlgorithm - the sauce that makes the player useful
   * @param {String[]} options.cardTypeNames - array of card names to make a non-random setup
   * @param {Object} options.log - what to save to the history log
   * @param {Boolean} options.log.game - save game actions to history log
   * @param {Boolean} options.log.player - save player actions to history log
   * @returns {[GameState, history]} - tuple returning the game runner and history
   */
  setup,
};
