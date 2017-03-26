
const fs = require('fs-extra');
const path = require('path');
const JSON3 = require('json3');
const util = require('util');

const normalizedPath = path.join(__dirname + '/convos/json/');

const OUTPUT_JSON = './src/app/data/v1/matches.json'

const matchJoinDict = require('./characters/match_join_dict.js');

const matchBlob = {};
matchBlob.date = Date.now();
matchBlob.version = 1;
matchBlob.matches = [];

fs.readdirSync(normalizedPath).forEach(function(file) {
  const matchPath = path.join(normalizedPath, file);
  const femaleKey = path.basename(matchPath, '.json');
  const [femaleChaId, femaleFirstName] = femaleKey.split('_');

  const matchFile = require(matchPath);
  const matchMeta = {
    key: femaleKey,
    characters: {
      lead_female_key: femaleKey,
      lead_male_key: matchJoinDict[femaleKey]
    },
    threads: matchFile
  };

  matchBlob.matches.push(matchMeta);
});

// console.log(util.inspect(matchBlob, {showHidden: false, depth: 4}));

saveThreadsJson = JSON3.stringify(matchBlob, null, 2);

fs.outputFileSync(OUTPUT_JSON, saveThreadsJson);
