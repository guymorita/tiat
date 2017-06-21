
import {
  PRODUCT_ANDROID_BUY_SUCCESS,
  RECEIVE_ANDROID_PRODUCTS
} from '../actions/store'

const initialState = {
  liveProducts: [
  ],
  receipts: []
}

export default function storeAndroid(state = initialState, action) {
  switch(action.type) {
    case RECEIVE_ANDROID_PRODUCTS:
      return {
        ...state,
        liveProducts: action.products
      }
    case PRODUCT_ANDROID_BUY_SUCCESS:
    return {
      ...state,
      receipts: state.receipts.concat(action.response)
    }
    default:
      return state
  }
}
