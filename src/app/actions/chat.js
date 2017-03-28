
import _ from 'lodash'

export const SWITCH_CHAT = 'SWITCH_CHAT'
export const INIT_ACTIVE_CHAT = 'INIT_ACTIVE_CHAT'

function initActiveChat(key) {
  return {
    type: INIT_ACTIVE_CHAT,
    key
  }
}

function switchChat(key) {
  return {
    type: SWITCH_CHAT,
    key
  }
}

export function initSwitchChat(key) {
  const activeChatMatch = (chat) => { return chat.key === key }
  return (dispatch, getState) => {
    const state = getState()
    const { activeChats } = state.chat
    const activeChat = activeChats.find(activeChatMatch)
    if (_.isEmpty(activeChat)) {
      dispatch(switchChat(key))
      return dispatch(initActiveChat(key))
    }
  }
}

export function getInputFormat(key) {
  return (dispatch, getState) => {
    const state = getState()
    dispatch('herro')
  }
}
