
import { combineReducers } from 'redux'

import characters from './characters'
import matchesAll from './matchesAll'
import currentChat from './currentChat'
import activeChats from './activeChats'

export default combineReducers({
  characters,
  currentChat,
  activeChats,
  matchesAll
})
