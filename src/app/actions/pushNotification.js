
import PushNotification from 'react-native-push-notification'
import moment from 'moment'

export const CREATE_PUSH_NOTIFICATION = 'CREATE_PUSH_NOTIFICATION'

PushNotification.configure({
    // (required) Called when a remote or local notification is opened or received
    onNotification: function(notification) {
        console.log( 'NOTIFICATION:', notification )
    },
    requestPermissions: false,
})

function createPushNotification() {
  return {
    type: CREATE_PUSH_NOTIFICATION
  }
}

export function tryCreatePushNotification() {
  return (dispatch, getState) => {
    const state = getState()
    const { date, matchQueue } = state
    const hasMatchesTmrw = matchQueue.next_day.random_num_matches > 0
    if (!hasMatchesTmrw) {
      return
    }
    const dateToSend = moment().add(1, 'days').hour(12)
    const text = "You have new matches!"
    PushNotification.localNotificationSchedule({
      message: text,
      date: dateToSend.toDate()
    });
    dispatch(createPushNotification(text, dateToSend))
  }
}
