
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
          time_end_wait: 0,
          wait_message_id: 0,
          currently_waiting: false
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
            currently_waiting: options.keepWaiting || false,
            jumped: false
          }
        }
      }

    case TRY_PUSH_NEXT_MESSAGE:
      const acChat = state[action.key]
      const newMsg = action.nextMessage

      const timeNow = moment().unix()
      // get current wait
      const currentWaitEndTime = acChat.wait.time_end_wait
      // find the new possible wait with the new message
      const newPotentialWaitTime = timeNow + newMsg.wait_sec
      // if they aren't done with the old wait, use the old time. don't set a new wait time
      const currentlyWaiting = timeNow < currentWaitEndTime
      console.log('currentlyWaiting', currentlyWaiting)
      // if it tells it that it's currently waiting

      const newEndWaitTime = newPotentialWaitTime // currentlyWaiting ? currentWaitEndTime : newPotentialWaitTime

      return {
        ...state,
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
            time_end_wait: timNow,
            wait_message_id: 0,
            currently_waiting: false,
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
