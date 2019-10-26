const nanoid = require('nanoid');

/**
 * Cards have a bit of state! Their value can vary,
 * and they can exist in a flipped over state, in addition
 * to the scoring methodology from their base record,
 * and static properties like color/shapes/etc.
 *
 * doesn't store min/max player properties used when generating
 *
 * @property {String} id - unique id for tracking/validating use
 * @property {String} name - general name for a card
 * @property {String} cardName - specific name for a subtype of card
 * @property {String} color - 1-2 words describing semi-unique colors
 * @property {String} type - card classification, like roll/special etc
 * @property {Object} shapes - key/value store of number of shapes on card
 * @property {Number|Function} value - card value or value calculating function
 * @property {Function=any=>any} play - evaluate card when playing it
 */
module.exports = class Card {
  constructor({
    play = () => {},
    id = nanoid(),
    cardName,
    shapes,
    color,
    value,
    name,
    type,
  }) {
    this.default = value;

    this.id = id;
    this.play = play;
    this.name = name;
    this.type = type;
    this.color = color;
    this.shapes = shapes;
    this.cardName = cardName;

    this.flipped = false;
  }

  get value() {
    return this.replacedValue != null ? this.replacedValue : this.default;
  }

  // set a temporary value
  set value(value) {
    this.replacedValue = value;
  }

  get isDessert() {
    return this.type === 'dessert';
  }

  setScore(value) {
    this.isScored = true;
    this.replacedValue = value;
  }

  // flip the card face down
  flip = () => {
    this.flipped = true;
  };

  // reset any modifiers, prepping for deck insertion
  reset = () => {
    this.replacedValue = undefined;
    this.flipped = false;
  };
};
