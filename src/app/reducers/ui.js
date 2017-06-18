
import { INTRO_FINISHED,
  OPEN_DRAWER,
  CLOSE_DRAWER,
  NOTIF_NEW_MATCHES_DAILY
} from '../actions/ui'

const initialState = {
  intro_finished: false,
  drawer_opened: false,
  notif_new_matches_daily: false,
  notif_inform_users_on_jumps: false,
  requested_push_notifications: false
}

export default function currentMatches(state = initialState, action) {
  switch(action.type) {
    case INTRO_FINISHED:
      return {
        ...state,
        intro_finished: true
      }
    case OPEN_DRAWER:
      return {
        ...state,
        drawer_opened: true
      }
    case CLOSE_DRAWER:
      return {
        ...state,
        drawer_opened: false
      }
    case NOTIF_NEW_MATCHES_DAILY:
      return {
        ...state,
        notif_new_matches_daily: true
      }
    default:
      return state
  }
}
