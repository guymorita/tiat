
import moment from 'moment'

import {
  ADVANCE_DATE_DAY,
  conv_to_unix,
  dayFromDate,
  modi_date,
  UPDATE_ACTUAL_DATE
} from '../actions/date'

const dateNow = Date.now()
const day = dayFromDate(dateNow)

const initialState = {
  first_open: {
    actual: dateNow
  },
  opened_today: {
    actual: dateNow,
    actual_day: day,
    change_day: 0,
    modified: dateNow,
    modified_day: day
  }
}

export default function date(state = initialState, action) {
  switch(action.type) {
    case ADVANCE_DATE_DAY:
      const { opened_today } = state
      const opened_today_change_day = opened_today.change_day + 1
      const mod_date = modi_date(opened_today.actual, opened_today_change_day)
      return {
        ...state,
        opened_today: {
          ...state.opened_today,
          change_day: opened_today_change_day,
          modified: conv_to_unix(mod_date),
          modified_day: dayFromDate(mod_date)
        }
      }

    case UPDATE_ACTUAL_DATE:
      const openedToday = state.opened_today
      const { change_day } = openedToday
      const actual = dateNow
      const actualDay = dayFromDate(actual)
      const mo_date = modi_date(openedToday.actual, change_day)
      return {
        ...state,
        opened_today: {
          ...state.opened_today,
          actual: actual,
          actual_day: actualDay,
          modified: conv_to_unix(mo_date),
          modified_day: dayFromDate(mo_date)
        }
      }

    default:
      return state
  }
}
