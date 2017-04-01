
import _ from 'lodash'

export const SWITCH_CHAT = 'SWITCH_CHAT'
export const INIT_ACTIVE_CHAT = 'INIT_ACTIVE_CHAT'
export const PUSH_NEXT_MESSAGE = 'PUSH_NEXT_MESSAGE'
export const TRY_PUSH_NEXT_MESSAGE = 'TRY_PUSH_NEXT_MESSAGE'
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
  const { activeChats } = state
  const activeChat = activeChats[key]
  return activeChat
}

export function getMatch(state, key) {
  return state.matchesAll.find((match) => { return match.key === key })
}

function waitComplete(activeChat) {
  const { wait } = activeChat
  const timeNow = Date.now() / 1000
  const waitDone = timeNow > wait.time_wait_finish
  return waitDone
}

export function shouldWait(activeChat) {
  const { currently_waiting } = activeChat.wait
  return currently_waiting && !waitComplete(activeChat)
}

export function initSwitchChat(key) {
  return (dispatch, getState) => {
    const state = getState()
    const activeChat = getActiveChat(state, key)
    dispatch(switchChat(key))
    if (_.isEmpty(activeChat)) {
      return dispatch(initActiveChat(key))
    }
  }
}

export function setChaId(nextMessage) {
  // main character needs to be 1 to render on the right side
  if (nextMessage.cha_id > 10 && nextMessage.cha_id < 100) {
    return 1
  }
  return nextMessage.cha_id
}

function getThumb(characters, activeChat, nextMessage) {
  const { key } = activeChat
  const { cha_id } = nextMessage
  if (nextMessage.cha_id === 2) {
    return 'https://www.playshakespeare.com/images/avatar/thumb_1b09da63a23c12d8d02185e9.jpg'
  } else if ( cha_id < 100) {
    return ''
  }
  const character = characters.find((char) => { return char.key === key })
  return character.images.thumb
}

function pushNextMessage(key, nextMessage, options = {}) {
  return {
    type: PUSH_NEXT_MESSAGE,
    key,
    nextMessage,
    options
  }
}

function pushNextMessageAddChar(key, nextMessage, options = {}) {
  return (dispatch, getState) => {
    const state = getState()
    const activeChat = getActiveChat(state, key)
    const { giftedChat } = activeChat
    // for gifted chat
    nextMessage.user = {}
    nextMessage.user._id = setChaId(nextMessage)
    nextMessage.user.avatar = getThumb(state.characters, activeChat, nextMessage)
    nextMessage._id = giftedChat.currentLine
    dispatch(pushNextMessage(key, nextMessage, options))
  }
}

function tryPushNextMessage(key, nextMessage) {
  return {
    type: TRY_PUSH_NEXT_MESSAGE,
    key,
    nextMessage
  }
}

function getMessagesToQueue(messages, cha_id, msg_id) {
  const messagesToQueue = []

  let pullMessage = false
  for (var i = 0; i < messages.length; i++) {
    const currentMessage = messages[i]
    if (msg_id === currentMessage.msg_id) {
      pullMessage = true
    }
    if (pullMessage) {
      messagesToQueue.push(currentMessage)
    }
    const nextNextMessage = messages[i+1]
    const nextMessageEnd = !nextNextMessage || nextNextMessage.cha_id !== cha_id
    if (pullMessage && nextMessageEnd) {
      pullMessage = false
    }
  };
  return messagesToQueue
}

function tryPushFemaleNextMessageWithTimeout(key, nextMessage) {
  return (dispatch, getState) => {
    const state = getState()
    const activeChat = getActiveChat(state, key)
    const { wait } = activeChat
    const { currently_waiting } = wait
    const { cha_id, msg_id } = nextMessage

    const match = getMatch(state, key)
    const currentThread = match.threads[activeChat.thread]
    const { messages } = currentThread

    const messagesToQueue = getMessagesToQueue(messages, cha_id, msg_id)
    const lastMessage = _.last(messagesToQueue)

    dispatch(tryPushNextMessage(key, lastMessage))

    if (!currently_waiting) {
      let sum_wait_wait_millisec = 0
      const msgsLength = messagesToQueue.length
      for (var i = 0; i < msgsLength; i++) {
        const msg = messagesToQueue[i]
        const { wait_sec } = msg
        const wait_millisec = wait_sec * 1001
        sum_wait_wait_millisec = sum_wait_wait_millisec + wait_millisec
        const keepWaiting = msg.msg_id !== lastMessage.msg_id
        setTimeout(() => {
          dispatch(pushNextMessageAddChar(key, msg, {keepWaiting}))
        }, sum_wait_wait_millisec)
      };
    }

    if (waitComplete(activeChat)) {
      messagesToQueue.forEach(function (msg) {
        dispatch(pushNextMessageAddChar(key, msg))
      })
    }
  }
}

function tryPushNextMessageWithTimeout(key, nextMessage) {
  return (dispatch, getState) => {
    const { cha_id } = nextMessage
    // user or narrator
    if (cha_id < 100) {
      dispatch(tryPushNextMessage(key, nextMessage))
      dispatch(pushNextMessageAddChar(key, nextMessage))
    } else {
      dispatch(tryPushFemaleNextMessageWithTimeout(key, nextMessage))
    }
  }
}

function createNextMessage(activeChat, currentThread) {
  return (dispatch, getState) => {
    const { msg_id } = activeChat
    const { messages } = currentThread
    const nextMessage = messages.find((msg) => { return msg.msg_id === msg_id })
    const { key } = activeChat

    dispatch(tryPushNextMessageWithTimeout(key, nextMessage))
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
  return (dispatch) => {
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
      return (dispatch) => {
        dispatch(switchBranchPushMessage(activeChat.key, branch_target))
      }
    case 'multi':
      return {
        type: BRANCH_MULTI,
        key: activeChat.key
      }
    case 'terminal':
      return {
        type: BRANCH_TERMINAL
      }
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
      nextIsBranch = msg_id > lastMessage.msg_id
    }
    if (!nextIsBranch) {
      dispatch(createNextMessage(activeChat, currentThread))
    } else {
      dispatch(execBranch(activeChat, threads))
    }

  }
}

