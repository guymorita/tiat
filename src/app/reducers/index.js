
import { combineReducers } from 'redux'

import activeChats from './activeChats'
import characters from './characters'
import currentChat from './currentChat'
import matchesAll from './matchesAll'
import matchQueue from './matchQueue'

export default combineReducers({
  activeChats,
  characters,
  currentChat,
  matchesAll,
  matchQueue
})
