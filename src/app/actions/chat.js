
import _ from 'lodash'

export const SWITCH_CHAT = 'SWITCH_CHAT'
export const INIT_ACTIVE_CHAT = 'INIT_ACTIVE_CHAT'
export const PUSH_NEXT_MESSAGE = 'PUSH_NEXT_MESSAGE'
export const BRANCH_LINEAR = 'BRANCH_LINEAR'
export const BRANCH_MULTI = 'BRANCH_MULTI'
export const BRANCH_TERMINAL = 'BRANCH_TERMINAL'
export const SWITCH_BRANCH = 'SWITCH_BRANCH'

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

function getActiveChat(state, key) {
  const { activeChats } = state.chat
  const activeChat = activeChats[key]
  return activeChat
}

export function getMatch(state, key) {
  return state.matches.find((match) => { return match.key === key })
}

export function initSwitchChat(key) {
  return (dispatch, getState) => {
    const state = getState()
    const activeChat = getActiveChat(state, key)

    if (_.isEmpty(activeChat)) {
      dispatch(switchChat(key))
      return dispatch(initActiveChat(key))
    }
  }
}

function setChaId(nextMessage) {
  // main character needs to be 1 to render on the right side
  if (nextMessage.cha_id > 10 && nextMessage.cha_id < 100) {
    return 1
  }
  return nextMessage.cha_id
}

function pushNextMessage(key, nextMessage) {
  return {
    type: PUSH_NEXT_MESSAGE,
    key,
    nextMessage
  }
}

function createNextMessage(activeChat, currentThread) {
  return (dispatch, getState) => {
    const { msg_id } = activeChat
    const { messages } = currentThread
    const nextMessage = messages.find((msg) => { return msg.msg_id === msg_id })
    const { giftedChat } = activeChat
    const { key } = activeChat

    // for gifted chat
    nextMessage.user = {}
    nextMessage.user._id = setChaId(nextMessage)
    // nextMessage.user.avatar = this.getThumb(nextMessage)
    nextMessage._id = giftedChat.currentLine

    dispatch(pushNextMessage(key, nextMessage))
  }
}

function switchBranch(key, branch_target) {
  return {
    type: SWITCH_BRANCH,
    branch_target,
    key
  }
}

export function switchBranchPushMessage(key, branch_target) {
  return (dispatch, getState) => {
    dispatch(switchBranch(key, branch_target))
    dispatch(nextStep(key))
  }
}

function execBranch(activeChat, threads) {
  const currentThread = threads[activeChat.thread]
  const { branch } = currentThread

  switch(branch.branch_type) {
    case 'linear':
      const { branch_target } = branch
      return (dispatch, getState) => {
        dispatch(switchBranchPushMessage(activeChat.key, branch_target))
      }
    case 'multi':
      return {
        type: BRANCH_MULTI,
        key: activeChat.key
      }
    case 'terminal':
      console.log('terminal')
      return
  }
}

export function nextStep(key) {
  return (dispatch, getState) => {
    const state = getState()
    const activeChat = getActiveChat(state, key)
    const match = getMatch(state, key)
    const { threads } = match
    const currentThread = threads[activeChat.thread]
    const { msg_id } = activeChat
    const { messages } = currentThread
    let nextIsBranch = true
    if (messages.length) {
      const lastMessage = _.last(messages)
      nextIsBranch = msg_id >= lastMessage.msg_id
    }
    if (!nextIsBranch) {
      dispatch(createNextMessage(activeChat, currentThread))
    } else {
      console.log('next is branch')
      dispatch(execBranch(activeChat, threads))
    }

  }
}

export function chooseOption(key, option) {
  return (dispatch, getState) => {
    const state = getState()
  }
}

