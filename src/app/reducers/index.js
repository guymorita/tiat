
import { combineReducers } from 'redux'

import characters from './characters'
import matches from './matches'
import currentChat from './currentChat'
import activeChats from './activeChats'

export default combineReducers({
  characters,
  currentChat,
  activeChats,
  matches
})
