
import moment from 'moment'

import {
  UPDATE_DATE_DAY,
  conv_to_unix,
  dayFromDate,
  modi_date
} from '../actions/date'

const dateNow = moment().unix()
const day = dayFromDate(dateNow)

const initialState = {
  first_open: {
    actual: dateNow
  },
  opened_today: {
    actual: dateNow,
    actual_day: day
  }
}

export default function date(state = initialState, action) {
  switch(action.type) {
    case UPDATE_DATE_DAY:
      const { opened_today } = state
      return {
        ...state,
        opened_today: {
          ...state.opened_today,
          actual: dateNow,
          actual_day: day
        }
      }

    default:
      return state
  }
}
