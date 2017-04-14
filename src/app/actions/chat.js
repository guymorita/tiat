
import {
  Alert
} from 'react-native'
import _ from 'lodash'
import moment from 'moment'

import {
  dateNow
} from './date'

export const INIT_ACTIVE_CHAT = 'INIT_ACTIVE_CHAT'
export const PUSH_NEXT_MESSAGE = 'PUSH_NEXT_MESSAGE'
export const BRANCH_LINEAR = 'BRANCH_LINEAR'
export const BRANCH_MULTI = 'BRANCH_MULTI'
export const BRANCH_TERMINAL = 'BRANCH_TERMINAL'
export const CLEAR_WAIT = 'CLEAR_WAIT'
export const SWITCH_BRANCH = 'SWITCH_BRANCH'
export const SWITCH_CHAT = 'SWITCH_CHAT'
export const TRY_PUSH_NEXT_MESSAGE = 'TRY_PUSH_NEXT_MESSAGE'

const LONG_WAIT_IN_SEC = 300

// INIT

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

export function initActiveChat(key) {
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

// WAIT

function waitMessageComplete(activeChat) {
  const { wait } = activeChat
  const timeNow = moment().unix()
  const waitDone = timeNow > wait.time_wait_finish
  return waitDone
}

function longWaitMessage(activeChat) {
  const { wait } = activeChat
  const timeNow = moment().unix()
  const hasLongWait = timeNow + LONG_WAIT_IN_SEC < wait.time_wait_finish
  return hasLongWait
}

function shouldWaitForMessage(activeChat) {
  const { currently_waiting } = activeChat.wait
  return currently_waiting && !waitMessageComplete(activeChat)
}

function hasLongWaitForMessage(activeChat) {
  const { currently_waiting } = activeChat.wait
  return currently_waiting && longWaitMessage(activeChat)
}

function waitTerminateComplete(activeChat, date) {
  return dateNow(date) > activeChat.terminate.dateRetry
}

function shouldWaitForTerminate(activeChat, date) {
  const { isTerminated } = activeChat.terminate
  return isTerminated && !waitTerminateComplete(activeChat, date)
}

export function shouldWait(activeChat, date) {
  return shouldWaitForMessage(activeChat) || shouldWaitForTerminate(activeChat, date)
}

export function shouldLongWait(activeChat, date) {
  return hasLongWaitForMessage(activeChat) || shouldWaitForTerminate(activeChat, date)
}

// MESSAGE

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

    // special functionality for a long wait?

    if (!currently_waiting) {
      // if long wait, no timeouts, just set to
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
        // dispatch(addTimeout(key, waitTimeout))
      }
    }

    if (waitMessageComplete(activeChat)) {
      messagesToQueue.forEach(function (msg) {
        // used when the waiting button had the next button functionality and you got stuck.
        dispatch(pushNextMessageAddChar(key, msg))
      })
    }
  }
}

function tryPushNextMessageWithTimeout(key, nextMessage) {
  return (dispatch, getState) => {
    const { cha_id, wait_sec } = nextMessage
    // user or narrator
    if (cha_id < 100) {
      dispatch(tryPushNextMessage(key, nextMessage))
      dispatch(pushNextMessageAddChar(key, nextMessage))
    } else if (wait_sec > LONG_WAIT_IN_SEC) {
      dispatch(tryPushNextMessage(key, nextMessage))
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

// BRANCH

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

function execBranch(activeChat, threads, date) {
  const currentThread = threads[activeChat.thread]
  const { branch } = currentThread
  const { key } = activeChat

  switch(branch.branch_type) {
    case 'linear':
      const { branch_target } = branch
      return (dispatch) => {
        dispatch(switchBranchPushMessage(key, branch_target))
      }
    case 'multi':
      return {
        type: BRANCH_MULTI,
        key
      }
    case 'terminal':
      // FIX it's depending on opened_today which could have been a while ago, dateNow would work
      // better but harder for debugging
      return {
        type: BRANCH_TERMINAL,
        key,
        dateNow: dateNow(date)
      }
  }
}

export function nextStep(key) {
  return (dispatch, getState) => {
    const state = getState()
    const activeChat = getActiveChat(state, key)
    const match = getMatch(state, key)
    const { date } = state
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
      dispatch(execBranch(activeChat, threads, date))
    }

  }
}

// JUMP

function clearWait(key) {
  return {
    type: CLEAR_WAIT,
    key
  }
}

export function jumpUseTry(key) {
  return (dispatch, getState) => {
    const state = getState()
    const { inventory } = state
    const { current } = inventory
    const { jumps } = current

    if (jumps < 1) {
      Alert.alert(
        'Not enough jumps',
        'Please wait until tomorrow or purchase more jumps'
      )
    } else {
      dispatch(clearWait(key))
      Alert.alert(
        'Jumped!',
        ''
      )
    }

  }
}

