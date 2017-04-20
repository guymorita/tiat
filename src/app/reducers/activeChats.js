
import moment from 'moment'

import {
  BRANCH_MULTI,
  BRANCH_TERMINAL,
  WAIT_CLEAR_JUMP,
  findActiveChatIndex,
  INIT_ACTIVE_CHAT,
  PUSH_NEXT_MESSAGE,
  setChaId,
  SWITCH_BRANCH,
  TRY_PUSH_NEXT_MESSAGE
} from '../actions/chat'

const initialState = {
}

export default function activeChats(state = initialState, action) {
  switch(action.type) {
    case BRANCH_MULTI:
      const actChat = state[action.key]
      return {
        ...state,
        [action.key]: {
          ...actChat,
          atBranch: true,
        }
      }

    case BRANCH_TERMINAL:
      const actiChat = state[action.key]
      const dateNow = action.dateNow
      const dateNextAvailable = moment.unix(dateNow).add(4, 'hours').unix()
      return {
        ...state,
        [action.key]: {
          ...actiChat,
          terminate: {
            ...actiChat.terminate,
            isTerminated: true,
            dateLastTerminated: action.dateNow,
            dateRetry: dateNextAvailable
          }
        }
      }

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
        },
        terminate: {
          isTerminated: false,
          dateLastTerminated: 1000,
          dateRetry: 1000
        }
      }
      return {
        ...state,
        [action.key]: newChat
      }

    case PUSH_NEXT_MESSAGE:
      const activeChat = state[action.key]
      const { options } = action
      const tiNow = moment().unix()

      return {
        ...state,
        [action.key]: {
          ...activeChat,
          msg_id: activeChat.msg_id + 1,
          giftedChat: {
            messages: activeChat.giftedChat.messages.concat(action.nextMessage),
            currentLine: activeChat.giftedChat.currentLine + 1
          },
          wait: {
            ...activeChat.wait,
            time_last_interaction: tiNow,
            jumped: false
          }
        }
      }

    case SWITCH_BRANCH:
      const aChat = state[action.key]
      return {
        ...state,
        [action.key]: {
          ...aChat,
          thread: action.branch_target,
          msg_id: 0,
          atBranch: false
        }
      }

    case WAIT_CLEAR_JUMP:
      const aaChat = state[action.key]
      const timNow = moment().unix()
      return {
        ...state,
        [action.key]: {
          ...aaChat,
          wait: {
            ...aaChat.wait,
            time_last_interaction: timNow,
            jumped: true
          },
          terminate: {
            ...aaChat.terminate,
            dateRetry: timNow - 1000
          }
        }
      }

    default:
      return state
  }
}
