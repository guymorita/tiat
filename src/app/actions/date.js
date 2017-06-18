
import moment from 'moment'

export const ADVANCE_DATE_DAY = 'ADVANCE_DATE_DAY'
export const UPDATE_ACTUAL_DATE = 'UPDATE_ACTUAL_DATE'

export function advanceDateDay() {
  return {
    type: ADVANCE_DATE_DAY
  }
}

export function conv_to_unix(date) {
  return date.unix()
}

export function dateNow(date = {}) {
  if (__DEV__) {
    return date.opened_today.modified
  } else {
    return moment().unix()
  }
}

export function dayFromDate(date, adj_days=0) {
  let altDate = date
  if (!Number.isInteger(altDate)) {
    altDate = altDate._i/1000
  }
  return Number(moment.unix(altDate).add(adj_days, 'days').format('D'))
}

export function modi_date(actual, change) {
  return moment.unix(actual).add(change, 'days')
}

export function updateActualDate() {
  return {
    type: UPDATE_ACTUAL_DATE
  }
}
