const temaki = { name: 'temaki', value: 1, color: 'dark-purple' };
const uramaki = {
  name: 'uramaki',
  color: 'bright-green',
  types: [
    { count: 4, value: 3 },
    { count: 4, value: 4 },
    { count: 4, value: 5 },
  ],
};
const maki = {
  name: 'maki',
  color: 'red',
  types: [
    { count: 4, value: 1 },
    { count: 5, value: 2 },
    { count: 3, value: 3 },
  ],
};

module.exports = [uramaki, temaki, maki];
