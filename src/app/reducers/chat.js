
import {
  BRANCH_MULTI,
  BRANCH_TERMINAL,
  findActiveChatIndex,
  INIT_ACTIVE_CHAT,
  PUSH_NEXT_MESSAGE,
  setChaId,
  SWITCH_BRANCH,
  SWITCH_CHAT,
  TRY_PUSH_NEXT_MESSAGE
} from '../actions/chat'

const initialState = {
  currentChat: {
    key: ''
  },
  activeChats: {}
}

export default function chat(state = initialState, action) {
  switch(action.type) {
    case BRANCH_MULTI:
      const actChats = state.activeChats
      const actChat = actChats[action.key]
      return {
        ...state,
        activeChats: {
          ...activeChats,
          [action.key]: {
            ...actChat,
            atBranch: true,
          }
        }
      }

    case BRANCH_TERMINAL:
      return state

    case INIT_ACTIVE_CHAT:
      const newChat = {
        key: action.key,
        thread: 'a',
        msg_id: 0,
        atBranch: false,
        giftedChat: {
          messages: [],
          currentLine: 0
        },
        wait: {
          time_last_interaction: 0,
          time_end_wait: 0,
          wait_message_id: 0,
          currently_waiting: false
        }
      }
      return Object.assign({}, state, state.activeChats[action.key] = newChat)

    case PUSH_NEXT_MESSAGE:
      const { activeChats } = state
      const activeChat = activeChats[action.key]
      const { options } = action

      return {
        ...state,
        activeChats: {
          ...activeChats,
          [action.key]: {
            ...activeChat,
            msg_id: activeChat.msg_id + 1,
            giftedChat: {
              messages: activeChat.giftedChat.messages.concat(action.nextMessage),
              currentLine: activeChat.giftedChat.currentLine + 1
            },
            wait: {
              ...activeChat.wait,
              currently_waiting: options.keepWaiting || false
            }
          }
        }
      }

    case TRY_PUSH_NEXT_MESSAGE:
      const acChats = state.activeChats
      const acChat = acChats[action.key]
      const newMsg = action.nextMessage

      const timeNow = Date.now() / 1000
      const currentWaitEndTime = acChat.wait.time_wait_finish
      const newPotentialWaitTime = timeNow + newMsg.wait_sec
      const currentlyWaiting = timeNow < currentWaitEndTime

      const newEndWaitTime = currentlyWaiting ? currentWaitEndTime : newPotentialWaitTime

      return {
        ...state,
        activeChats: {
          ...acChats,
          [action.key]: {
            ...acChat,
            wait: {
              ...acChat.wait,
              time_last_interaction: timeNow,
              time_end_wait: newEndWaitTime,
              wait_message_id: newMsg.msg_id,
              currently_waiting: true
            }
          }
        }
      }

    case SWITCH_BRANCH:
      const aChats = state.activeChats
      const aChat = aChats[action.key]
      return {
        ...state,
        activeChats: {
          ...aChats,
          [action.key]: {
            ...aChat,
            thread: action.branch_target,
            msg_id: 0,
            atBranch: false
          }
        }
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
