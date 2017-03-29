
import _ from 'lodash'

import {
  BRANCH_MULTI,
  findActiveChatIndex,
  INIT_ACTIVE_CHAT,
  PUSH_NEXT_MESSAGE,
  SWITCH_BRANCH,
  SWITCH_CHAT
} from '../actions/chat'

const initialState = {
  currentChat: {
    key: ''
  },
  activeChats: {

  }
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
      return Object.assign({}, state, state.activeChats[action.key] = newChat)

    case PUSH_NEXT_MESSAGE:
      const { activeChats } = state
      const activeChat = activeChats[action.key]

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
            }
          }
        }
      }
    case SWITCH_BRANCH:
      aChats = state.activeChats
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

  // const { curChat, threads } = this.state
  // const currentThread = threads[curChat.thread]
  // const newThread = threads[branch_target]

  // this.setState({
  //   curChat: {
  //     ...curChat,
      // thread: branch_target,
      // msg_id: 0,
      // atBranch: false,
      // platform: newThread.platform
  //   }
  // }, () => {
  //   // this.nextStep()
  // })