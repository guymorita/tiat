
import { combineReducers } from 'redux'

import activeChats from './activeChats'
import characters from './characters'
import currentChat from './currentChat'
import currentMatches from './currentMatches'
import date from './date'
import inventory from './inventory'
import ui from './ui'
import matchesAll from './matchesAll'
import store from './store'

export default combineReducers({
  activeChats,
  characters,
  currentChat,
  currentMatches,
  date,
  inventory,
  matchesAll,
  store,
  ui
})
