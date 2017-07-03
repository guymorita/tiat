
import {
  PRODUCT_IOS_BUY_SUCCESS,
  RECEIVE_IOS_PRODUCTS
} from '../actions/store'

import {
  RESTORE_PURCHASES
} from '../actions/storeShare'

const initialState = {
  liveProducts: [
  ],
  receipts: []
}
console.log('RESTORE_PURCHASES', RESTORE_PURCHASES)

export default function storeIOS(state = initialState, action) {
  switch(action.type) {
    case RECEIVE_IOS_PRODUCTS:
      return {
        ...state,
        liveProducts: action.products
      }
    case PRODUCT_IOS_BUY_SUCCESS:
      return {
        ...state,
        receipts: state.receipts.concat(action.response)
      }
    case RESTORE_PURCHASES:
      const receipts = Object.assign([], action.receipts)
      return {
        ...state,
        receipts: receipts
      }
    default:
      return state
  }
}
