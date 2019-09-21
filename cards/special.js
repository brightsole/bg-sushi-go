const chopsticks = {
  name: 'chopsticks',
  color: 'light-cyan',
  value: 'announce: play 2 in hand, put chopsticks in hand',
};
const soySauce = {
  name: 'soy sauce',
  color: 'yellow-orange',
  value: '4score if you have most different colored cards',
};
const takeoutBox = {
  name: 'takeout box',
  color: 'light-brown',
  value: 'transform any previous into 2score',
};
const spoon = {
  name: 'spoon',
  minPlayers: 3,
  color: 'dark-grey',
  value: 'announce: trade for card with leftmost owner',
};
const specialOrder = {
  maxPlayers: 6,
  color: 'rainbow',
  name: 'special order',
  value: 'copy 1 previous',
};
const menu = {
  name: 'menu',
  maxPlayers: 6,
  color: 'light-yellow',
  value: 'draw 4, play one, shuffle',
};
const tea = {
  name: 'tea',
  color: 'dark-red',
  value: '1score x largest color set',
};
const wasabi = { name: 'wasabi', value: 'next nigiri x3', color: 'yellow' };

module.exports = [
  specialOrder,
  chopsticks,
  takeoutBox,
  soySauce,
  wasabi,
  spoon,
  menu,
  tea,
];
