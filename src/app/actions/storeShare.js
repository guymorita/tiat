
import {
  Alert
} from 'react-native'

import {
  inventoryChange
} from './inventory'

import {
  findRandNumMatches
} from './matches'

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
      case store.MORE_MATCHES:
        dispatch(findRandNumMatches())
        Alert.alert(
          'You have new matches!',
          ''
        )
      case store.SKIP:
        dispatch(inventoryChange(prod))
      default:
        return
    }
  }
}