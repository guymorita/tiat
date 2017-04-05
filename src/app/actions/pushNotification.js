
import PushNotification from 'react-native-push-notification'

export const CREATE_PUSH_NOTIFICATION = 'CREATE_PUSH_NOTIFICATION'

PushNotification.configure({
    // (required) Called when a remote or local notification is opened or received
    onNotification: function(notification) {
        console.log( 'NOTIFICATION:', notification )
    },
    requestPermissions: true,
})

export function createPushNotification() {
  PushNotification.localNotificationSchedule({
    message: "You have new matches!", // (required)
    date: new Date(Date.now() + (5 * 1000)) // in 60 secs
  });
  return {
    type: CREATE_PUSH_NOTIFICATION
  }
}
