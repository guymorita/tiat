
import { CREATE_PUSH_NOTIFICATION, PUSH_NOTIFICATION_FIRED } from '../actions/pushNotifications'

const initialState = {
  queued_message: {
    text: '',
    date_to_send: 'date'
  },
  history: {
    last_clicked_notif: 'date',
    last_sent_notif: 'date',
    num_sent: 0,
    num_clicked: 0,
    num_registered: 0
  }
}

export default function pushNotifications(state = initialState, action) {
  switch(action.type) {
    case CREATE_PUSH_NOTIFICATION:
      return state
    case PUSH_NOTIFICATION_FIRED:
      return state
    default:
      return state
  }
}
