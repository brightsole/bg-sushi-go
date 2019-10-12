/**
 * So whats all this then???
 *
 * I want history to be a fixed-width blob of text that's readable
 * This is the setup to make that happen in a reasonable(ish) way.
 * ... I hope.
 */

/* eslint-disable prettier/prettier */
// OPERATORS
const PLAYER      =       'Player';
const GAME_STATE  =       'GameSt'; // eslint-disable-line no-unused-vars

// ACTIONS
const PLAYED      =       'PLAYED';
const SUMMED      =       'SUMMED';

// OTHER
const SPACER      =       '      ';
/* eslint-enable prettier/prettier */

const strip = string => string.slice(0, 8).padEnd(8, ' ');

class History {
  constructor({ player, game } = {}) {
    this.logGameState = game;
    this.logPlayer = player;
    this.log = '';
  }

  /* *Player method* */
  playCard = ({ playerId, card }) => {
    if (!this.logPlayer) return;
    this.log += `${PLAYER}-${playerId}  ${PLAYED}  ${strip(card.name)}-${
      card.id
    }\n`;
  };

  /* *Player method* */
  scoreCards = ({ playerId, cardType, sum, cards }) => {
    if (!this.logPlayer) return;

    const title = `${PLAYER}-${playerId}  ${SUMMED}  ${strip(
      cardType.name
    )}  FOR  ${sum}\n`;
    const scoreLines = cards
      .map(
        card =>
          `${SPACER}  ${SPACER}  ${card.id}-${strip(card.name)}  FOR  ${
            card.value
          }\n`
      )
      .join('');

    this.log += `${title}${scoreLines}`;
  };

  /**
   * return a filtered log by the playerID given
   */
  getPlayerHistory = playerId => {
    return this.log
      .split('\n')
      .filter(logLine => logLine.match(new RegExp(`${PLAYER}.*${playerId}`)))
      .join('\n');
  };
}

module.exports.History = History;
