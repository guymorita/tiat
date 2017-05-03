
import {
  SWITCH_CHAT,
} from '../actions/chat'

import {
  CHARACTER_SWITCH
} from '../actions/character'

const initialState = {
  key: ''
}

export default function currentChat(state = initialState, action) {
  switch(action.type) {
    case SWITCH_CHAT:
      return {
        ...state,
        key: action.key
      }
    case CHARACTER_SWITCH:
      return {
        ...state,
        cha_id: action.cha_id
      }
    default:
      return state
  }
}
