1. Evaluate hand (by sorting cards)
2. Assign card to play based on `play` action of card
3. execute play manouver
4. pass cards


Todo to make AI more useable:
1. reconfigure action log to utilise JSON.stringified simple objects
2. Change the actions
  a. player
    i.    selected best cards
      0.    internal AI logging a low priority
    ii.   evaluated their play
    iii.  passed cards
    iv.   scored for x cardType
  b. card
    i.    was played (on round, by player)
    ii.   was scored x
    iii.  was passed
    iv.   was transformed in some way
    v.    was discarded/drawn
  c. boardState
    i.    turn happened
    ii.   round happened
  d. overall
    i.    player ranking/ai
    ii.   card play rate early v late
    iii.  card point average
    iv.   card "fairness"