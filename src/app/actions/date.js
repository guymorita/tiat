
import moment from 'moment'

export const ADVANCE_DATE_DAY = 'ADVANCE_DATE_DAY'
export const UPDATE_ACTUAL_DATE = 'UPDATE_ACTUAL_DATE'

export function updateActualDate() {
  return {
    type: UPDATE_ACTUAL_DATE
  }
}

export function dayFromDate(date, adj_days=0) {
  return Number(moment(date).add(adj_days, 'days').format('D'))
}

export function advanceDateDay() {
  return {
    type: ADVANCE_DATE_DAY
  }
}
