
import moment from 'moment'

import {
  ADVANCE_DATE_DAY,
  dayFromDate,
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
      const mod_date = moment(opened_today.actual).add(opened_today_change_day, 'days')
      return {
        ...state,
        opened_today: {
          ...state.opened_today,
          change_day: opened_today_change_day,
          modified: mod_date.unix() * 1000,
          modified_day: dayFromDate(mod_date)
        }
      }

    case UPDATE_ACTUAL_DATE:
      const openedToday = state.opened_today
      const actual = Date.now()
      const actualDay = dayFromDate(actual)
      return {
        ...state,
        opened_today: {
          ...state.opened_today,
          actual: actual,
          actual_day: actualDay
        }
      }

    default:
      return state
  }
}
