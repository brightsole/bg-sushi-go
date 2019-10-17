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
  | Deck |  | A place where cards go to be drawn and shufffled about |
  |  | draw(drawNumber) | Draws x number of cards from the deck |
  |  | returnCards(cards) | Returns given cards to the deck |
  |  | topUpDesserts(Params) => remainingDesserts | Add proper amount of dessert cards to the deck |
  | GameState |  | A place where things like rounds, turns, and actions like scoring are initiated |
  |  | playATurn() | All players play and pass cards, turn incremented |
  |  | playAllTurns() | All players play and pass cards until hands empty |
  |  | playARound() | All rounds played, scores assigned, hands reset, round incremented, turn reset |
  |  | playAGame() | Three rounds played, winner declared |
  |  | getPlayerScores() | Returns all player scores, sorted from best to worst |
  | Card |  | Cards contain tons of useful information & methods, and can be modified when played/scored |
  |  | flip() | Flip card over, used in some actions |
  |  | reset() | Reset all user-input card values to default |
  |  | play(allCardsPlayed) | Evaluate execution of playing a card |
  |  | setScore() | Set the card's score to be a value, usually a number |
  | Player |  | An instance of an ai that stores cards, and methods for interacting with the board and other players |
  |  | setHand(cards) | Set the players hand to equal those cards |
  |  | setNeighbors(lID, rID) | Set L & R neighbor ids |
  |  | preparePlay() | Assigns cardToPlay and cardsToPass based on ai sorting algo |
  |  | playCard(allPlayedCards, expectedPlayedCards) | Plays the best card, and evaluates if it was effected by any other player's played card |
  |  | passCards() | Passes all other non-played cards |
  |  | scoreCard({ cardType, players }) | Sums and assigns scores for all cards of x type played by this user |
  |  | scoreBoard(round, gameType, players) | Scores all played cards for x round |
  |  | resetRound() | Clear played cards, and store played desserts at end of round |
  | History |  | A storage container for a fixed-width history text blob |
  |  | *(Player) | duplicates the names of the player methods, and adds their results to the log |
  |  | *(BoardState) | approximates/duplicates some boardState methods, and appends them onto the log |
  |  | getPlayerHistory(playerId) | strips all lines but those related to the player id |
  |  | getAll() | get all history lines |

  These classes have the following state shape:

  | Model | state | Description |
  | :---------------: | :--------------- | :--------------- |
  | Deck | cards | Array of unique cards in the deck |
  | GameState | cards | Cards & leftover dessert cards stored |
  |  | cards.dessertCards | Storage of the unused dessert cards |
  |  | cards.deck | Storage of deck cards not in hand or played on board |
  |  | players | Storage of players in the game |
  |  | winner | Locked in at the end of a game as the winning player |
  |  | gameType | cardType: [selected types] game type storage |
  |  | round = 1 | Storage of the round currently being played |
  |  | turn = 1 | Storage of the turn currently being played |
  | Card | id | unique card id |
  |  | name | Name of the card |
  |  | name | Name of the card subtype _(salmon nigiri)_ |
  |  | color | Few word description of the semi-unique color _(used in scoring sparingly)_ |
  |  | shapes | key:value store of shape + count |
  |  | value | Value calc function, or simple number |
  |  | isDessert | Boolean for if this card is a dessert card |
  | Player | id | Unique player id |
  |  | hand | Array of cards in the player's hand |
  |  | cardToPlay | Card ready to play |
  |  | loggingEnabled | Append events to a fixed-width log buffer |
  |  | cardsToPass | Cards ready to be passed to the neighbor |
  |  | scoringAlgorithm | Return hand sorted from best to worst; given hand & boardstates |
  |  | boardState | Properties between the player and other board states |
  |  | boardState.score | The player's score |
  |  | boardState.round | The current round, maybe useful in the scoring algo |
  |  | boardState.desserts | The desserts played by the player previously |
  |  | boardState.neighbors | [L, R] neighbor ids for passing cards |
  |  | boardState.playedCards | Cards played during this round |
  | History | log | The raw string blob that actions are being appended to |


  ##### SETUP.js
  Finally we have `setup.js`. It now returns a tuple of `gameState` and `history`. Even if logging is off, the history class is returned, but no interactions will happen to/in it.

</details>
<br/>

### How to use it?
<details>
  <summary>
    tl;dr: node index.js
  </summary>
  <br />

  `node index.js` will play 200 games and output some stats on them!

  right now, it's just a jumping off point, much more work must be done.

  ### THE END GOAL IS THUS:
  To make a working copy of sushi-go-party that anyone with *some* experience in JS can play with. I want people to put forth their best `scoringAlgorithm` **and that's it**. Those scoring algos are then what's used to hold AI competitions!

  The scoring algo is also *dead simple*. It takes in a hand, _(and the state of the board that turn)_, and returns a sorted hand, from best to worst. **that's it**.

  All it takes to be a competitor is using that information to choose the best cards possible! To me, it's far more interesting of a play space than other Bayesian AI competitions I've seen done, and nearly as simple to get into!

</details>
<br/>

### TODO:
<details>
<summary>tl;dr: LOTS</summary>
<br />

  #### MUST HAVE:
  1. Players unable to activate specials that have been previously played
  1. Evaluating `play`
      1. specials

  ### TESTS TO DO:
  1. appetizers
      1. eel
      1. tofu
      1. tempura
      1. sashimi
      1. dumpling
      1. misoSoup

  2. dessert
      1. fruit
      1. pudding
      1. greenTeaIceCream

  4. special
      1. menu
      1. spoon
      1. wasabi
      1. chopsticks
      1. takeoutBox
      1. specialOrder

  #### NICE TO HAVE:
  1. `History` is now in a really good place. The only refactor that would be nice would be transforming it into a series of decorators once node has support for them finalized. No idea when that'll happen. I really considered TS to get it, but I do enjoy this project involving no pre-run compilation.


</details>
<br/>