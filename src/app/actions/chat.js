
import {
  Alert
} from 'react-native'
import _ from 'lodash'

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

// USER

export function isUserOrNarrator(cha_id) {
  return cha_id < 100
}

// WAIT

function waitMessageComplete(activeChat, curThread, date) {
  const { wait } = activeChat
  const { time_last_interaction } = wait
  const curMessage = getCurrentMessage(activeChat, curThread)
  const { wait_sec } = curMessage
  const timeNow = dateNow(date)
  const waitDone = timeNow > time_last_interaction + wait_sec
  return waitDone
}

export function shouldWaitForMessage(activeChat, curThread, date) {
  return !waitMessageComplete(activeChat, curThread, date)
}

export function isCurrentlyWaiting(activeChat) {
  return activeChat.wait.currently_waiting
}

function waitTerminateComplete(activeChat, date) {
  return dateNow(date) > activeChat.terminate.dateRetry
}

export function hasLongWait(message) {
  const { wait_sec } = message
  return wait_sec > LONG_WAIT_IN_SEC
}

export function shouldWaitForTerminate(activeChat, date) {
  const { isTerminated } = activeChat.terminate
  return isTerminated && !waitTerminateComplete(activeChat, date)
}

export function hasJumped(activeChat) {
  const { jumped } = activeChat.wait
  return jumped
}

// MESSAGE

export function setChaId(nextMessage) {
  // main character needs to be 1 to render on the right side
  if (nextMessage.cha_id > 10 && isUserOrNarrator(nextMessage.cha_id)) {
    return 1
  }
  return nextMessage.cha_id
}

function getThumb(characters, activeChat, nextMessage) {
  const { key } = activeChat
  const { cha_id } = nextMessage
  if (nextMessage.cha_id === 2) {
    return 'https://www.playshakespeare.com/images/avatar/thumb_1b09da63a23c12d8d02185e9.jpg'
  } else if (isUserOrNarrator(cha_id)) {
    return ''
  }
  const character = characters.find((char) => { return char.key === key })
  return character.images.thumb
}

function tryPushNextMessageAddChar(key) {
  return {
    type: TRY_PUSH_NEXT_MESSAGE,
    key
  }
}

function pushNextMessage(key, nextMessage) {
  return {
    type: PUSH_NEXT_MESSAGE,
    key,
    nextMessage
  }
}

function pushNextMessageAddChar(key, curThread, nextMessage) {
  return (dispatch, getState) => {
    const state = getState()
    const activeChat = getActiveChat(state, key)
    const { giftedChat } = activeChat
    // for gifted chat
    nextMessage.user = {}
    nextMessage.user._id = setChaId(nextMessage)
    nextMessage.user.avatar = getThumb(state.characters, activeChat, nextMessage)
    nextMessage._id = giftedChat.nextLine
    nextMessage.platform = curThread.platform
    dispatch(pushNextMessage(key, nextMessage))
  }
}

function pushFemaleNextMessageWithTimeout(key, curThread, nextMessage, nextNextMessage) {
  return (dispatch, getState) => {
    dispatch(tryPushNextMessageAddChar(key, curThread))

    const hasMoreMessages = nextNextMessage && nextMessage.cha_id === nextNextMessage.cha_id
    let dispatchNextStep = false
    if (hasMoreMessages) {
      if (hasLongWait(nextMessage)) return
      dispatchNextStep = true
    }

    const { wait_sec } = nextMessage
    setTimeout(() => {
      dispatch(pushNextMessageAddChar(key, curThread, nextMessage))
      if (dispatchNextStep) dispatch(nextStep(key))
    }, wait_sec * 1000)
  }
}

function pushNextMessageWithTimeout(activeChat, curThread, nextMessage, nextNextMessage) {
  return (dispatch, getState) => {
    const { cha_id } = nextMessage
    const { key } = activeChat
    if (isUserOrNarrator(cha_id)) {
      dispatch(pushNextMessageAddChar(key, curThread, nextMessage))
    } else {
      dispatch(pushFemaleNextMessageWithTimeout(key, curThread, nextMessage, nextNextMessage))
    }
  }
}

function findMessage(msg_id, messages) {
  return messages.find((msg) => { return msg.msg_id === msg_id })
}

function getMessage(activeChat, currentThread, adj = 0) {
  const { next_msg_id } = activeChat
  const { messages } = currentThread
  const msg = findMessage(next_msg_id + adj, messages)
  return msg
}

export function getCurrentMessage(activeChat, currentThread) {
  return getMessage(activeChat, currentThread, -1)
}

export function getNextMessage(activeChat, currentThread) {
  return getMessage(activeChat, currentThread, 0)
}

export function getNextNextMessage(activeChat, currentThread) {
  return getMessage(activeChat, currentThread, 1)
}

export function isAtFirstMessage(activeChat) {
  return activeChat.next_msg_id === 0
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
      return {
        type: BRANCH_TERMINAL,
        key,
        dateNow: dateNow(date)
      }
  }
}

function getCurThread(state, activeChat) {
  const { key } = activeChat
  const match = getMatch(state, key)
  const { threads } = match
  const currentThread = threads[activeChat.thread]
  return currentThread
}

export function nextStep(key) {
  return (dispatch, getState) => {
    const state = getState()
    const activeChat = getActiveChat(state, key)
    const currentThread = getCurThread(state, activeChat)
    const match = getMatch(state, key)
    const { threads } = match
    const { next_msg_id } = activeChat
    const { messages } = currentThread
    let nextIsBranch = true
    if (messages.length) {
      const lastMessage = _.last(messages)
      nextIsBranch = next_msg_id > lastMessage.msg_id
    }
    if (!nextIsBranch) {
      const nextMessage = getNextMessage(activeChat, currentThread)
      const nextNextMessage = getNextNextMessage(activeChat, currentThread)
      dispatch(pushNextMessageWithTimeout(activeChat, currentThread, nextMessage, nextNextMessage))
    } else {
      const { date } = state
      dispatch(execBranch(activeChat, threads, date))
    }

  }
}

export function isTerminated(activeChat) {
  return activeChat.terminate.isTerminated
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
      const activeChat = getActiveChat(state, key)
      if (!isTerminated(activeChat)) {
        const currentThread = getCurThread(state, activeChat)
        const nextMessage = getNextMessage(activeChat, currentThread)
        dispatch(pushNextMessageAddChar(key, currentThread, nextMessage))
      }
      Alert.alert(
        'Jumped!',
        ''
      )
    }

  }
}

