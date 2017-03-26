

const match_join = require('./json/match_join.json');

const match_join_dict = {};

match_join.forEach((line) => {
  const { female_key, male_key} = line;
  match_join_dict[female_key] = male_key;
});

const charDict = () => (
  match_join_dict
);

module.exports = charDict()
