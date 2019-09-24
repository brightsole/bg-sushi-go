# SUSHI GO PLAYER

### What is it?
<details>
  <summary>
    tl;dr: An AI player for the game sushi go party
  </summary>
  <br />

  It has a number of models that describe, execute, evaluate, and understand the mechanics of playing the game Sushi Go Party!

  It contains the following classes of behaviour:

  | Model | method | Description |
  | :---------------: | :--------------- | :--------------- |
  | Deck | draw(drawNumber) | Draws x number of cards from the deck |
  |  | returnCards(cards) | Returns given cards to the deck |
  |  | topUpDesserts(Params) => remainingDesserts | Add proper amount of dessert cards to the deck |
  | GameState | playATurn() | All players play and pass cards, turn incremented |
  |  | playAllTurns() | All players play and pass cards until hands empty |
  |  | playARound() | All rounds played, scores assigned, hands reset, round incremented, turn reset |
  |  | playAGame() | 3 rounds played, winnner declared |
  | Card | flip() | flip card over, used in some actions |
  |  | reset() | reset all user-input card values to default |
  | Player | setHand(cards) | Set the players hand to equal those cards |
  |  | setNeighbors(lID, rID) | Set L & R neighbor ids |
  |  | sortHandByValue() | Sorts hand by scoring algo |
  |  | playCard(evaluatePlay) | Plays the best card, and evaluates if it was effected by any other player's played card |
  |  | passCards() | Passes all other non-played cards |
  |  | scoreBoard(round, allBoardStates) | Scores all played cards for x round |
  |  | resetRound() | Clear played cards, and store played desserts at end of round |

  These classes have the following state shape:

  | Model | state | Description |
  | :---------------: | :--------------- | :--------------- |
  | Deck | cards | Array of unique cards in the deck |
  | GameState | cards | cards & leftover dessert cards stored |
  |  | cards.dessertCards | storage of the unused dessert cards |
  |  | cards.deck | storage of deck cards not in hand or played on board |
  |  | players | storage of players in the game |
  |  | round = 1 | storage of the round currently being played |
  |  | turn = 1 | storage of the turn currently being played |
  | Card | id | unique card id |
  |  | name | name of the card or subtype _(salmon nigiri)_ |
  |  | color | couple word description of the semi-unique color _(used in scoring sparingly)_ |
  |  | shapes | key:value store of shape + count |
  |  | value = () => {} | value calc function, or simple number |
  |  | isDessert | boolean for if this card is a dessert card |
  | Player | id | Unique player id |
  |  | hand | array of cards in the player's hand |
  |  | cardsToPass | cards ready to be passed to the neighbor |
  |  | scoringAlgorithm | set the scoring algo that will define best sorting methodology for the players hand |
  |  | boardState | properties between the player and other board states |
  |  | boardState.score | the player's score |
  |  | boardState.round | the current round, maybe useful in the scoring algo |
  |  | boardState.desserts | the desserts played by the player previously |
  |  | boardState.neighbors | [l, r] neighbor ids for passing cards |
  |  | boardState.playedCards | cards played during this round |

</details>
<br/>

### How to use it?
<details>
  <summary>
    tl;dr: node index.js
  </summary>
  <br />

  `node index.js` will output a winner, and their score.

  right now, it's just a jumping off point, much more work must be done.

</details>
<br/>

### TODO:
<details>
<summary>tl;dr: LOTS</summary>
<br />

  1. Scoring algo is `literally random`
  2. Players unable to activate specials that have been previously played
  3. Evaluating score **does not evaluate anything that isn't just a `value`**
    1. fix `roll` scoring
    2. fix `special` scoring
    3. fix `dessert` scoring
    4. fix `appetizer` scoring
  4. output is logged, return the value so that algo fitness may be evaluated

</details>
<br/>