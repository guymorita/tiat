
import {
  Alert
} from 'react-native'
import _ from 'lodash'
import moment from 'moment'

import {
  dateNow
} from './date'

import {
  invJumpsSubtract
} from './inventory'

export const INIT_ACTIVE_CHAT = 'INIT_ACTIVE_CHAT'
export const PUSH_NEXT_MESSAGE = 'PUSH_NEXT_MESSAGE'
export const BRANCH_LINEAR = 'BRANCH_LINEAR'
export const BRANCH_MULTI = 'BRANCH_MULTI'
export const BRANCH_TERMINAL = 'BRANCH_TERMINAL'
export const WAIT_CLEAR_JUMP = 'WAIT_CLEAR_JUMP'
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

function waitMessageComplete(activeChat, date) {
  const { wait } = activeChat
  const timeNow = date.opened_today.modified
  const waitDone = timeNow - 10 > wait.time_end_wait
  return waitDone
}

function longWaitMessage(activeChat, date) {
  const { wait } = activeChat
  const timeNow = date.opened_today.modified
  const hasLongWait = timeNow + LONG_WAIT_IN_SEC < wait.time_end_wait
  return hasLongWait
}

function shouldWaitForMessage(activeChat, date) {
  const { currently_waiting } = activeChat.wait
  return currently_waiting && !waitMessageComplete(activeChat, date)
}

function hasLongWaitForMessage(activeChat, date) {
  const { currently_waiting } = activeChat.wait
  return currently_waiting && longWaitMessage(activeChat, date)
}

function waitTerminateComplete(activeChat, date) {
  return dateNow(date) > activeChat.terminate.dateRetry
}

function shouldWaitForTerminate(activeChat, date) {
  const { isTerminated } = activeChat.terminate
  return isTerminated && !waitTerminateComplete(activeChat, date)
}

export function shouldWait(activeChat, date) {
  return shouldWaitForMessage(activeChat, date) || shouldWaitForTerminate(activeChat, date)
}

export function shouldLongWait(activeChat, date) {
  return hasLongWaitForMessage(activeChat, date) || shouldWaitForTerminate(activeChat, date)
}

export function hasJumped(activeChat) {
  const { jumped } = activeChat.wait
  return jumped
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
    // console.log('try push')
    dispatch(tryPushNextMessage(key, lastMessage))

    if (!currently_waiting) {
      let sum_wait_wait_millisec = 0
      const msgsLength = messagesToQueue.length
      for (var i = 0; i < msgsLength; i++) {
        const msg = messagesToQueue[i]
        const { wait_sec } = msg
        const wait_millisec = wait_sec * 1000
        sum_wait_wait_millisec = sum_wait_wait_millisec + wait_millisec
        const keepWaiting = msg.msg_id !== lastMessage.msg_id
        setTimeout(() => {
          dispatch(pushNextMessageAddChar(key, msg, {keepWaiting}))
        }, sum_wait_wait_millisec)
      }
    }

    // sometimes it doesn't queue all of the messages in the same batch
    // sometimes it thinks the waitMessageComplete. can't unstuck yourself
    // doesn't know how to handle non-terminal jumps
    // next button flips on the second to last instead of the last. race condition with time.

    // console.log('waitMessageComplete(activeChat)', waitMessageComplete(activeChat))

    // if (waitMessageComplete(activeChat)) {
    //   messagesToQueue.forEach(function (msg) {
    //     // used when the waiting button had the next button functionality and you got stuck.
    //     dispatch(pushNextMessageAddChar(key, msg))
    //   })
    // }

    // current problems
    // 1. doesn't put the jump button away after the day is fast forwarded
    // 2. doesn't jump on a terminal
  }
}

function tryPushNextMessageWithTimeout(activeChat, nextMessage) {
  return (dispatch, getState) => {
    const { cha_id, wait_sec } = nextMessage
    const { key } = activeChat
    // user or narrator
    if (cha_id < 100) {
      dispatch(tryPushNextMessage(key, nextMessage))
      dispatch(pushNextMessageAddChar(key, nextMessage))
    } else if (wait_sec > LONG_WAIT_IN_SEC) {
      const { wait } = activeChat
      const { jumped } = wait
      if (!jumped) {
        dispatch(tryPushNextMessage(key, nextMessage))
      } else {
        dispatch(pushNextMessageAddChar(key, nextMessage))
      }
      // if they jumped, let them through
      // first time, they encounter the long wait
      // currently_waiting = false
      // set it to true. show them the long wait thing

      // if they jump = currently_waiting = false
      // how does it know it's not the first time seeing it?

      // if (shouldWait(activeChat)) {
        // console.log("shouldWait(activeChat)", shouldWait(activeChat))
        // dispatch(tryPushNextMessage(key, nextMessage))
        // is it done waiting?
        // console.log('try jump')
      // } else {

      // }
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

    dispatch(tryPushNextMessageWithTimeout(activeChat, nextMessage))
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

function waitClearJump(key) {
  return {
    type: WAIT_CLEAR_JUMP,
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
        'Please wait or purchase more jumps'
      )
    } else {
      dispatch(invJumpsSubtract(1))
      dispatch(waitClearJump(key))
      dispatch(nextStep(key))
      // if next is message, push the message
      Alert.alert(
        'Jumped!',
        ''
      )
    }

  }
}

