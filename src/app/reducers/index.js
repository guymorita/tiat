
import { combineReducers } from 'redux'

import activeChats from './activeChats'
import characters from './characters'
import currentChat from './currentChat'
import currentMatches from './currentMatches'
import date from './date'
import intro from './intro'
import matchesAll from './matchesAll'
import matchQueue from './matchQueue'

export default combineReducers({
  activeChats,
  characters,
  currentChat,
  currentMatches,
  date,
  intro,
  matchesAll,
  matchQueue
})
