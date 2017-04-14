
import {
  JUMP,
  KEY
} from './store'

export const INV_JUMPS_ADD = 'INV_JUMPS_ADD'
export const INV_JUMPS_SUBTRACT = 'INV_JUMPS_SUBTRACT'
export const INV_KEYS_ADD = 'INV_KEYS_ADD'
export const INV_KEYS_SUBTRACT = 'INV_KEYS_SUBTRACT'

export function invJumpsAdd(quantity) {
  return {
    type: INV_JUMPS_ADD,
    quantity
  }
}

export function invKeysAdd(quantity) {
  return {
    type: INV_KEYS_ADD,
    quantity
  }
}

export function inventoryChange(prod) {
  return (dispatch) => {
    const { quantity } = prod
    if (prod.type === JUMP) {
      dispatch(invJumpsAdd(quantity))
    } else if (prod.type === KEY) {
      dispatch(invKeysAdd(quantity))
    }
  }
}
