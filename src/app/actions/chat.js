
import _ from 'lodash'

export const SWITCH_CHAT = 'SWITCH_CHAT'
export const INIT_ACTIVE_CHAT = 'INIT_ACTIVE_CHAT'
export const PUSH_NEXT_MESSAGE = 'PUSH_NEXT_MESSAGE'

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

export function findActiveChatIndex(activeChats, key) {
  const findIndex = (activeChat) => { return activeChat.key === key }
  return activeChats.findIndex(findIndex)
}

function getActiveChat(state, key) {
  const activeChatMatch = (chat) => { return chat.key === key }
  const { activeChats } = state.chat
  const activeChat = activeChats.find(activeChatMatch)
  return activeChat
}

function getMatch(state, key) {
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
      // this.showNewBubble()
      console.log('show new bubble')
      dispatch(createNextMessage(activeChat, currentThread))
    } else {
      // this.execBranch()
      console.log('exec branch')
    }

  }
}

export function chooseOption(key, option) {
  return (dispatch, getState) => {
    const state = getState()
  }
}

// pushes a new message to props
// pushes a prop change that toggles the keyboard

  // nextStep() {
  //   const { curChat, threads } = this.state
  //   const currentThread = threads[curChat.thread]
  //   const { msg_id } = curChat
  //   const { messages } = currentThread
  //   let nextIsBranch = true
  //   if (messages.length) {
  //     const lastMessage = _.last(messages)
  //     nextIsBranch = msg_id >= lastMessage.msg_id
  //   }
  //   if (!nextIsBranch) {
  //     this.showNewBubble()
  //   } else {
  //     this.execBranch()
  //   }
  // }
