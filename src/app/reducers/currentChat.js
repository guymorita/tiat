
import {
  SWITCH_CHAT,
} from '../actions/chat'

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
    default:
      return state
  }
}
