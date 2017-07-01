
import {
  INV_JUMPS_ADD,
  INV_JUMPS_SUBTRACT,
  SUBSCRIPTION_ENABLE,
  SUBSCRIPTION_DISABLE
} from '../actions/inventory'

const initialState = {
  current: {
    jumps: 1
  },
  subscription: {
    enabled: false,
    term: 'week'
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

    case SUBSCRIPTION_ENABLE:
      return {
        ...state,
        subscription: {
          ...state.subscription,
          enabled: true,
          term: action.term
        }
      }

    case SUBSCRIPTION_DISABLE:
      return {
        ...state,
        subscription: {
          ...state.subscription,
          enabled: false
        }
      }

    default:
      return state
  }
}
