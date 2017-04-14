
import {
  INV_JUMPS_ADD,
  INV_JUMPS_SUBTRACT,
  INV_KEYS_ADD,
  INV_KEYS_SUBTRACT
} from '../actions/inventory'

const initialState = {
  current: {
    jumps: 1,
    keys: 0
  },
  history: [
  ]
}

export default function storeIOS(state = initialState, action) {
  switch(action.type) {
    case INV_JUMPS_ADD:
      const currentJumps = state.current.jumps
      return {
        ...state,
        current: {
          ...state.current,
          jumps: currentJumps + action.quantity
        }
      }

    case INV_JUMPS_SUBTRACT:
      const curJumps = state.current.jumps
      return {
        ...state,
        current: {
          ...state.current,
          jumps: curJumps - action.quantity
        }
      }

    case INV_KEYS_ADD:
      const currentKeys = state.current.keys
      return {
        ...state,
        current: {
          ...state.current,
          keys: currentKeys + action.quantity
        }
      }
    case INV_KEYS_SUBTRACT:
      const curKeys = state.current.keys
      return {
        ...state,
        current: {
          ...state.current,
          keys: curKeys - action.quantity
        }
      }
    default:
      return state
  }
}
