
import moment from 'moment'

const NUM_MIN_WAIT_TO_RESTART = 45

import {
  BRANCH_MULTI,
  BRANCH_TERMINAL,
  WAIT_CLEAR_JUMP,
  findActiveChatIndex,
  INIT_ACTIVE_CHAT,
  PUSH_NEXT_MESSAGE,
  setChaId,
  SWITCH_BRANCH,
  TRY_PUSH_NEXT_MESSAGE,
  FINISH_CHAT
} from '../actions/chat'

import {
  REMOVE_ACTIVE_CHAT
} from '../actions/matches'

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
      const dateNextAvailable = moment.unix(dateNow).add(NUM_MIN_WAIT_TO_RESTART, 'minutes').unix()
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
        next_msg_id: 0,
        atBranch: false,
        giftedChat: {
          messages: [],
          nextLine: 0
        },
        wait: {
          time_last_interaction: 0
        },
        terminate: {
          isTerminated: false,
          dateLastTerminated: 1000,
          dateRetry: 1000,
          showedEndingSeq: false
        }
      }
      return {
        ...state,
        [action.key]: newChat
      }

    case PUSH_NEXT_MESSAGE:
      const activeChat = state[action.key]
      const tiNow = moment().unix()

      return {
        ...state,
        [action.key]: {
          ...activeChat,
          next_msg_id: activeChat.next_msg_id + 1,
          giftedChat: {
            messages: activeChat.giftedChat.messages.concat(action.nextMessage),
            nextLine: activeChat.giftedChat.nextLine + 1
          },
          wait: {
            ...activeChat.wait,
            time_last_interaction: tiNow,
            jumped: false,
            currently_waiting: false
          }
        }
      }

    case TRY_PUSH_NEXT_MESSAGE:
      const activChat = state[action.key]
      const tNow = moment().unix()
      return {
        ...state,
        [action.key]: {
          ...activChat,
          wait: {
            ...activChat.wait,
            time_last_interaction: tNow,
            currently_waiting: true
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
          next_msg_id: 0,
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

    case FINISH_CHAT:
      const aaaChat = state[action.key]
      return {
        ...state,
        [action.key]: {
          ...aaaChat,
          terminate: {
            ...aaaChat.terminate,
            showedEndingSeq: true
          }
        }
      }

    case REMOVE_ACTIVE_CHAT:
      const clone = Object.assign({}, state)
      const { key } = action
      delete clone[key]
      return clone

    default:
      return state
  }
}
