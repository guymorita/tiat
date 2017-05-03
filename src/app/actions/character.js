
export const CHARACTER_SWITCH = 'CHARACTER_SWITCH'

export function characterSwitch(cha_id) {
  return {
    type: CHARACTER_SWITCH,
    cha_id
  }
}
