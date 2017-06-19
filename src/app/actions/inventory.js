
import {
  SKIP,
  MORE_MATCHES
} from './store'

export const INV_JUMPS_ADD = 'INV_JUMPS_ADD'
export const INV_JUMPS_SUBTRACT = 'INV_JUMPS_SUBTRACT'

export function invJumpsAdd(quantity) {
  return {
    type: INV_JUMPS_ADD,
    quantity
  }
}

export function invJumpsSubtract(quantity) {
  return {
    type: INV_JUMPS_SUBTRACT,
    quantity
  }
}

export function inventoryChange(prod) {
  return (dispatch) => {
    const { quantity } = prod
    if (prod.type === SKIP) {
      dispatch(invJumpsAdd(quantity))
    }
  }
}


