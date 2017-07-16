
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
  return (dispatch, getState) => {
    uniqueId()
      .then(id => {
        analytics.identify({
          userId: id
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
  analytics.track({
    userId: id,
    event: `View ${pageName}`,
  });
}
