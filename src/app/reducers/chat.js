
import {
  SWITCH_CHAT
} from '../actions/chat'

const initialState = {
  currentChat: {
    key: ''
  }
}

export default function chat(state = initialState, action) {
  switch(action.type) {
    case SWITCH_CHAT:
      return {
        ...state,
        currentChat: {
          key: action.key
        }
      }
    default:
      return state
  }
}
