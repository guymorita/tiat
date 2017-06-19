
import moment from 'moment'

export const UPDATE_DATE_DAY = 'UPDATE_DATE_DAY'

export function updateDateDay(day) {
  return {
    type: UPDATE_DATE_DAY,
    day
  }
}

export function conv_to_unix(date) {
  return date.unix()
}

export function dateNow(date = {}) {
  return moment().unix()
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
