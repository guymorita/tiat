
import moment from 'moment'

import { ADVANCE_DATE_DAY } from '../actions/date'

const dateNow = Date.now()

const initialState = {
  first_open: {
    actual: dateNow
  },
  opened_today: {
    actual: dateNow,
    change_day: 0,
    modified: dateNow
  }
}

export default function date(state = initialState, action) {
  switch(action.type) {
    case ADVANCE_DATE_DAY:
      const { opened_today } = state
      const opened_today_change_day = opened_today.change_day + 1
      return {
        ...state,
        opened_today: {
          ...state.opened_today,
          change_day: opened_today_change_day,
          modified: moment(opened_today.actual).add(opened_today_change_day, 'days').unix() * 1000
        }
      }
    default:
      return state
  }
}
