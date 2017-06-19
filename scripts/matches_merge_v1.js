
const fs = require('fs-extra');
const path = require('path');
const JSON3 = require('json3');
const util = require('util');
const moment = require('moment');
const hash = require('object-hash');

const normalizedPath = path.join(__dirname + '/convos/json/');

const OUTPUT_JSON = './src/app/data/v1/matches.json';

const matchJoinDict = require('./characters/match_join_dict.js');

const matchBlob = {};
matchBlob.date = moment().unix();
matchBlob.version = 1;
matchBlob.matches = [];

fs.readdirSync(normalizedPath).forEach(function(file) {
  if (file.includes('DS_Store')) {
    return
  }
  const matchPath = path.join(normalizedPath, file);
  const femaleKey = path.basename(matchPath, '.json');
  const [femaleChaId, femaleFirstName] = femaleKey.split('_');

  const matchThreads = require(matchPath);
  const numThreads = Object.keys(matchThreads).length;
  const matchMeta = {
    key: femaleKey,
    characters: {
      lead_female_key: femaleKey,
      lead_male_key: matchJoinDict[femaleKey]
    },
    threads: matchThreads,
    options: {
      jumpable: numThreads > 1
    }
  };

  matchMeta.hash = hash(matchMeta);
  matchBlob.matches.push(matchMeta);
});

// console.log(util.inspect(matchBlob, {showHidden: false, depth: 4}));

matchBlob.hash = hash(matchBlob);
saveThreadsJson = JSON3.stringify(matchBlob, null, 2);

fs.outputFileSync(OUTPUT_JSON, saveThreadsJson);
