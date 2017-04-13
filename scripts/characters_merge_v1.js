
const fs = require('fs-extra');
const path = require('path');
const util = require('util');
const JSON3 = require('json3');
const _ = require('lodash')
const moment = require('moment')

const fileUrl = './characters/json/characters.json';
const charJson = require(fileUrl);

const OUTPUT_JSON = './src/app/data/v1/characters.json'

const charBlob = {};
charBlob.date = moment().unix();
charBlob.version = 1;
const characters = charBlob.characters = [];

charJson.forEach((line) => {
  const key = line.key;
  const { photo_0, photo_1, photo_2, thumb } = line
  const { cha_id, age, distance_in_miles} = line
  line.images = {
    photo_0,
    photo_1,
    photo_2,
    thumb
  }
  line.cha_id = Number(cha_id)
  line.age = Number(age)
  line.distance_in_miles = Number(distance_in_miles)

  line = _.omit(line, ['photo_0', 'photo_1', 'photo_2', 'thumb'])

  characters.push(line);
});

saveCharsJson = JSON3.stringify(charBlob, null, 2);

fs.outputFileSync(OUTPUT_JSON, saveCharsJson);
