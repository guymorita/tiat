
import {
  Alert
} from 'react-native'

import {
  SKIP,
  MORE_MATCHES
} from './store'

import {
  findRandNumMatches
} from './matches'

import {
  subEnable,
  subDisable
} from './analytics'

import { perStore } from '../../Client'

export const INV_JUMPS_ADD = 'INV_JUMPS_ADD'
export const INV_JUMPS_SUBTRACT = 'INV_JUMPS_SUBTRACT'
export const SUBSCRIPTION_ENABLE = 'SUBSCRIPTION_ENABLE'
export const SUBSCRIPTION_DISABLE = 'SUBSCRIPTION_DISABLE'

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

function subscriptionEnable(term) {
  const terms = ['week', 'month', 'year']
  const t = terms.includes(term) ? term : 'week'
  return {
    type: SUBSCRIPTION_ENABLE,
    term: t
  }
}

export function initSubscriptionEnable(term) {
  return (dispatch, getState) => {
    const state = getState()
    const { matchesAll, user } = state
    subEnable(user.id)
    for (let i = 0; i < matchesAll.length; i++) {
      dispatch(findRandNumMatches())
    }
    dispatch(subscriptionEnable(term))
  }
}

function subscriptionDisable() {
  return {
    type: SUBSCRIPTION_DISABLE
  }
}

export function initSubscriptionDisable() {
  return (dispatch, getState) => {
    const state = getState()
    const { user } = state
    subDisable(user.id)
    perStore.purge([
      'activeChats',
      'currentChat',
      'currentMatches',
      'date',
      'matchesAll',
      'ui'
    ])
    dispatch(subscriptionDisable())
    Alert.alert(
      'You have unsubscribed!',
      'Please close and restart the app'
    )

  }
}

export function toggleSubscription(anyValid) {
  return (dispatch, getState) => {
    const state = getState()
    const { inventory } = state
    const isSubscribed = inventory.subscription.enabled

    if (!anyValid && !isSubscribed) return
    if (anyValid && isSubscribed) return
    if (anyValid && !isSubscribed) dispatch(initSubscriptionEnable())
    if (!anyValid && isSubscribed) dispatch(initSubscriptionDisable())
  }
}
