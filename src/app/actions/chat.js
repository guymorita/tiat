
export const SWITCH_CHAT = 'SWITCH_CHAT'

export function switchChat(key) {
  return {
    type: SWITCH_CHAT,
    key
  }
}