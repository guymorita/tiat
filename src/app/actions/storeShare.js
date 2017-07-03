
import {
  Alert
} from 'react-native'

import {
  inventoryChange,
  initSubscriptionEnable
} from './inventory'

import {
  findRandNumMatches
} from './matches'

import {
  requestProducts
} from './store'

export const SKIP = 'SKIP'
export const MORE_MATCHES = 'MORE_MATCHES'
export const UNLIMITED = 'UNLIMITED'

function findProduct(key) {
  return requestProducts.find((prod) => {return prod.key === key})
}

export function routeProduct(key) {
  return (dispatch) => {
    const prod = findProduct(key)
    switch (prod.type) {
      case MORE_MATCHES:
        dispatch(findRandNumMatches())
        Alert.alert(
          'You have new matches!',
          ''
        )
      case SKIP:
        dispatch(inventoryChange(prod))
      case UNLIMITED:
        dispatch(initSubscriptionEnable())
        Alert.alert(
          'Congratulations!',
          "You now have Wing Unlimited! We will be adding new matches on a monthly basis. Please reach out if you have ideas or recommendations for the types of dating chats you'd like to read. Happy chatting!"
        )
      default:
        return
    }
  }
}