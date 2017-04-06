
import moment from 'moment'

import { dayFromDate } from '../actions/date'
import { ADVANCE_MATCH_QUEUE, IMPORT_TO_CURRENT_MATCHES_FINISHED, INIT_MATCH_QUEUE } from '../actions/matches'

const dateNow = moment().unix()

const initialState = {
  current_day: {
    day_of_month: dayFromDate(dateNow),
    random_num_matches: 2,
    import_finished: false,
    queue: []
  },
  next_day: {
    day_of_month: dayFromDate(dateNow, 1),
    random_num_matches: 2,
    import_finished: false,
    queue: []
  },
  init_finish: false
}

export default function matchQueue(state = initialState, action) {
  switch(action.type) {
    case ADVANCE_MATCH_QUEUE:
      const modDay = action.date.opened_today.modified_day
      return {
        ...state,
        current_day: {
          ...state.next_day,
          day_of_month: modDay
        },
        next_day: action.nextDay
      }

    case IMPORT_TO_CURRENT_MATCHES_FINISHED:
      return {
        ...state,
        current_day: {
          ...state.current_day,
          import_finished: true
        }
      }

    case INIT_MATCH_QUEUE:
      return {
        ...state,
        init_finish: true,
        current_day: {
          ...state.current_day,
          queue: action.current_day
        },
        next_day: {
          ...state.next_day,
          queue: action.next_day
        }
      }
    default:
      return state
  }
}
