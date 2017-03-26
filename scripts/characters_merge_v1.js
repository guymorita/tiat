
const fs = require('fs-extra');
const path = require('path');
const util = require('util');
const JSON3 = require('json3');

const fileUrl = './characters/json/characters.json';
const charJson = require(fileUrl);

const OUTPUT_JSON = './src/app/data/v1/characters.json'

const charBlob = {};
charBlob.date = Date.now();
charBlob.version = 1;
const characters = charBlob.characters = [];

charJson.forEach((line) => {
  const key = line.key;
  characters.push(line);
});

saveCharsJson = JSON3.stringify(charBlob, null, 2);

fs.outputFileSync(OUTPUT_JSON, saveCharsJson);