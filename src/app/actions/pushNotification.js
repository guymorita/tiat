
import PushNotification from 'react-native-push-notification'
import moment from 'moment'

export const CREATE_PUSH_NOTIFICATION = 'CREATE_PUSH_NOTIFICATION'
export const PUSH_NOTIFICATION_FIRED = 'PUSH_NOTIFICATION_FIRED'
export const PUSH_NOTIFICATION_PERMISSION_REQ = 'PUSH_NOTIFICATION_PERMISSION_REQ'

const MESSAGE_SCHEDULE_DAYS = [1, 3, 5, 7]

PushNotification.configure({
  // (required) Called when a remote or local notification is opened or received
  onNotification: function(notification) {
    console.log('notification', notification)
  },
  requestPermissions: false,
})

export function pushNotificationPermissionReq() {
  return {
    type: PUSH_NOTIFICATION_PERMISSION_REQ
  }
}

function pushNotificationFired(notification) {
  return {
    type: PUSH_NOTIFICATION_FIRED,
    notification
  }
}

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

    PushNotification.cancelAllLocalNotifications()
    const textMessages = [
      "You have new matches!",
      "Check in for new matches!",
      "Looks like you have some new messages"
    ]

    MESSAGE_SCHEDULE_DAYS.forEach((day) => {
      let randInt = () => { return Math.floor(Math.random() * 180) }
      let randMessage = () => { return textMessages[Math.floor(Math.random() * textMessages.length)] }

      let dateToSend = moment().add(day, 'days').hour(11).add(randInt(), 'minutes')

      PushNotification.localNotificationSchedule({
        message: randMessage(),
        date: dateToSend.toDate()
      });
    })

    dispatch(createPushNotification())
  }
}
