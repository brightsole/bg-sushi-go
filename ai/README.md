### AI algorithms

The Algorithm for accessing which card to play (from your hand, still working on board/announce cards), has been designed to be as simple as possible to implement. You give your AI black box a hand, your played cards, and all other player's played cards. I then returns the hand sorted from best to worst, and the best card is the one that's played.

So what does that mean in terms of different AI? It's totally up to you. In this folder, I'm going to progress through a series of algorithms, and asses their efficacy over baseline _(of fully random selection, and eventually eachother)_ and document each one along the way.

There are a series of words attached to each AI that will help anyone interested in understanding how they operate, which I'll define here. Each word has a contraction to keep the AI filenames smoller.

| Contraction | Name | Description | Opposing Contraction |
| :---------------: | :--------------- | :--------------- | :---------------: |
| smpl | Simple | An algorithm unaware of combinations that could affect maximum/avg possible score | smrt |
| smrt | Smart | An algorithm that understands possible combinations that might affect possible score outcomes | smpl |
| blnd | Blind | An algorithm that has no concept of probabilities of outcomes, and only looks at possible scores | eagl |
| eagl | Eagle-eyed | Any algorithm that uses some metric to assess probabilities of possible score outcomes | blnd |
| oblv | Oblivious | An algorithm with no internal memory of previous turns/plays | hist |
| hist | Historian | An algorithm that remembers and uses all previous hands to asses plays | oblv |
| hope | Hopeful | An algorithm that only considers it's own maximum score possible | nega |
| nega | Negative | An algorithm that only considers maximum harm to other player's strategies | hope |
| tact | Tactful | An algorithm that considers harm to other players & help to itself | nega/hope |
| subj | Subjective | An algorithm concocted from human gut feel | nene |
| nene | Neural Network | An algorithm generated over time from NN training | subj |

There will be more later, and eventually, a series of neural networks will be trained to compete without all the manual wiring done for these. But for now, these descriptors will help pave a roadmap from the fully random now to a smart, competitive opponent that might just beat a human!

An interesting logical progression is outlined below as an ennumerated list of AI to build:

### AI TODO:
##### TRASH TIER
- [x] [Simple, Blind, Oblivious, and Hopeful](./smpl_blnd_oblv_hope.js)
- [x] [Subjective, Oblivious, and Hopeful](./subj_oblv_hope.js)
- [ ] refactor the above, with learnings about what must be done
##### DECENT
- [ ] smpl_eagl_oblv_hope.js
- [ ] smpl_eagl_hist_hope.js
- [ ] smpl_eagl_hist_nega.js
##### BETTER THAN HUMAN
- [ ] smpl_eagl_hist_tact.js
- [ ] smrt_eagl_hist_tact.js
##### SHOULD BE NEARLY UNBEATABLE BY HUMANS
- [ ] nene.js

### ALSO TODO:
- [ ] research plotting libs
- [ ] create a simple HTML results plotting page
- [ ] deploy it on pushes
- [ ] link to this in the main readme
- [ ] split out the ai to a separate readme?
- [ ] compare xrandom x 1simple ai
- [ ] compare score vs player count
- [ ] compare xsimple vs xsimple ai
- [ ] compare xsimple vs xbetter ai
- [ ] compare all ai effectiveness as a unitless measure vs playerCount
