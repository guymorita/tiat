
import {
  Dimensions,
  Platform
} from 'react-native'

import { analytics } from '../lib/analytics'
const uniqueId = require('react-native-unique-id')

export const CREATE_USER_ID = 'CREATE_USER_ID'

function createUserId(id) {
  return {
    type: CREATE_USER_ID,
    id
  }
}

export function tryCreateAndLogFirst() {
  const  { height, width } = Dimensions.get('window')
  return (dispatch, getState) => {
    uniqueId()
      .then(id => {
        analytics.identify({
          userId: id,
          traits: {
            os: Platform.OS,
            version: Platform.Version,
            height,
            width,
            environment: process.env.NODE_ENV
          }
        });
        dispatch(createUserId(id))
        logFirstUse(id)
      })
      .catch(error => console.error(error))
  }
}

function logFirstUse(id) {
  analytics.track({
    userId: id,
    event: 'Open App',
  });
}

export function viewPage(id, pageName) {
  if (!id) return
  analytics.screen({
    userId: id,
    name: `View ${pageName}`
  })
}

export function noMatchesLeft(id) {
  analytics.track({
    userId: id,
    event: 'No Matches Left'
  })
}

// STORE

export function modalStoreChatShow(id) {
  analytics.track({
    userId: id,
    event: 'Modal Store Chat Show'
  })
}

export function modalStoreMatchesShow(id) {
  analytics.track({
    userId: id,
    event: 'Modal Store Matches Show'
  })
}

export function subscriptionBuy(id, key, price, currencySymbol) {
  analytics.track({
    userId: id,
    event: 'Subscription Purchased',
    properties: {
      key,
      price,
      currencySymbol
    }
  })
}

export function subEnable(id) {
  analytics.track({
    userId: id,
    event: 'Subscription Enabled'
  })
}

export function subDisable(id) {
  analytics.track({
    userId: id,
    event: 'Subscription Disabled'
  })
}
