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
const SCORED      =       'SCORED';

// OTHER
const SPACER      =       '      ';
/* eslint-enable prettier/prettier */

const strip = string => string.slice(0, 8).padEnd(8, ' ');

module.exports.playCard = ({ id, card }) =>
  `${PLAYER}-${id}  ${PLAYED}  ${strip(card.name)}-${card.id}\n`;

module.exports.score = ({ id, card }) =>
  `${PLAYER}-${id}  ${SCORED}  ${strip(card.name)}-${card.id}  FOR  ${
    card.value
  }\n`;

module.exports.sum = ({ id, cardType, sum, cards }) => {
  const title = `${PLAYER}-${id}  ${SUMMED}  ${strip(
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

  return `${title}${scoreLines}`;
};
