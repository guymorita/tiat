
import {
  INIT_ACTIVE_CHAT,
  SWITCH_CHAT
} from '../actions/chat'

const initialState = {
  currentChat: {
    key: ''
  },
  activeChats: [
  ]
}

export default function chat(state = initialState, action) {
  switch(action.type) {
    case INIT_ACTIVE_CHAT:
      const newChat = {
        key: action.key,
        thread: 'a',
        msg_id: 0,
        atBranch: false
      }
      return {
        ...state,
        activeChats: state.activeChats.concat(newChat)
      }
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
