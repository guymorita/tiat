
import { combineReducers } from 'redux'

import characters from './characters'
import matches from './matches'
import chat from './chat'

export default combineReducers({
  characters,
  chat,
  matches
})
