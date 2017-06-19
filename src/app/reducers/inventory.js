
import {
  INV_JUMPS_ADD,
  INV_JUMPS_SUBTRACT
} from '../actions/inventory'

const initialState = {
  current: {
    jumps: 1
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

    default:
      return state
  }
}
