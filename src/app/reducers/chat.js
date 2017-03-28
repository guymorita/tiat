
import {
  findActiveChatIndex,
  INIT_ACTIVE_CHAT,
  PUSH_NEXT_MESSAGE,
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
        atBranch: false,
        giftedChat: {
          messages: [],
          currentLine: 0
        }
      }
      return {
        ...state,
        activeChats: state.activeChats.concat(newChat)
      }
    case PUSH_NEXT_MESSAGE:
      const { activeChats } = state
      const index = findActiveChatIndex(activeChats, action.key)
      const activeChat = activeChats[index]

      return {
        ...state,
        activeChats: [
          ...activeChats.slice(0,index),
          {
            ...activeChat,
            msg_id: activeChat.msg_id + 1,
            giftedChat: {
              messages: activeChat.giftedChat.messages.concat(action.nextMessage),
              currentLine: activeChat.giftedChat.currentLine + 1
            }
          },
          ...activeChats.slice(index + 1)
        ]
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
