
const imageMapping = {
  '2': require('./2Shakespeare0.png'),
  '101': require('./101Ana0.png'),
  '102': require('./102Jessica0.png'),
  '103': require('./103Christina0.png'),
  '104': require('./104Em0.png'),
  '105': require('./105Katrina0.png'),
  '106': require('./106Susan0.png'),
  '107': require('./107Lucy0.png'),
  '108': require('./108Jane0.png'),
  '109': require('./109Bianca0.png'),
  '110': require('./110Mai0.png'),
  '111': require('./111Karen0.png'),
  '112': require('./112Mina0.png'),
  '113': require('./113Ashley0.png')
}

export const getImageWithChaId = (id) => { return imageMapping[id] }