
import _ from 'lodash'
import moment from 'moment'

import {
  dayFromDate
} from './date'

export const ADVANCE_MATCH_QUEUE = 'ADVANCE_MATCH_QUEUE'
export const FIND_MATCHES_TO_SHOW = 'FIND_MATCHES_TO_SHOW'
export const IMPORT_TO_CURRENT_MATCHES_FINISHED = 'IMPORT_TO_CURRENT_MATCHES_FINISHED'
export const INIT_MATCH_QUEUE = 'INIT_MATCH_QUEUE'

const MIN_NUM_RANDOM_MATCHES_PER_DAY = 1
const MAX_NUM_RANDOM_MATCHES_PER_DAY = 2

const NUM_MATCHES_DAY_1 = 3
const NUM_MATCHES_DAY_2 = 2

const NUM_MAX_NEW_MATCHES = 3

function formatMatches(matches, date) {
  return matches.map((match) => { return { key: match.key, date_matched: date }})
}

function getNewMatchQueueNextDay(state, date) {
  const modDate = date.opened_today.modified
  next_day_of_month = dayFromDate(modDate, 1)
  const range = MAX_NUM_RANDOM_MATCHES_PER_DAY - MIN_NUM_RANDOM_MATCHES_PER_DAY
  const numRandomMatches = Math.floor(Math.random()*(range + 1))+MIN_NUM_RANDOM_MATCHES_PER_DAY

  const { currentMatches, matchesAll, matchQueue } = state

  const { current_day, next_day } = matchQueue
  const currentQueue = current_day.queue
  const nextQueue = next_day.queue

  const allQueuedAndMatched = currentMatches.concat(currentQueue, nextQueue)
  const allQueuedAndMatchedKeys = allQueuedAndMatched.map((match) => { return match.key})

  const notQueuedAndMatched = (match) => { return !allQueuedAndMatchedKeys.includes(match.key)}

  const availableMatches = matchesAll.filter(notQueuedAndMatched)

  const nextMatches = availableMatches.slice(0, numRandomMatches)

  const formattedNextMatches = formatMatches(nextMatches, modDate)

  return {
    day_of_month: next_day_of_month,
    import_finished: false,
    random_num_matches: numRandomMatches,
    queue: formattedNextMatches
  }
}

function advanceMatchQueue(date, nextDay) {
  return {
    type: ADVANCE_MATCH_QUEUE,
    date,
    nextDay
  }
}

export function tryAdvanceMatchQueue() {
  return (dispatch, getState) => {
    const state = getState()
    const { date, matchQueue } = state
    if (date.opened_today.modified_day !== matchQueue.current_day.day_of_month) {

      const nextDay = getNewMatchQueueNextDay(state, date)
      dispatch(advanceMatchQueue(date, nextDay))
    }
  }
}

function findMatchesToShow(matches) {
  return {
    type: FIND_MATCHES_TO_SHOW,
    matches
  }
}

function importFinished() {
  return {
    type: IMPORT_TO_CURRENT_MATCHES_FINISHED
  }
}

export function findMatches(currentMatches, matchQueue, activeChats) {
  return (dispatch) => {
    const { current_day } = matchQueue
    const { import_finished } = current_day
    if (import_finished) {
      return
    }
    const { queue } = current_day
    const allCurrentKeys = currentMatches.map((match) => { return match.key })

    // FIX filter matches with incomplete timer out
    const matchDupe = match => allCurrentKeys.includes(match.key)
    let newMatches = _.reject(queue, matchDupe)
    const overNewMatchLimit = allCurrentKeys.length >= (_.keys(activeChats).length + NUM_MAX_NEW_MATCHES)
    if (overNewMatchLimit) {
      newMatches = []
    }

    const matchesToShow = newMatches.concat(currentMatches)
    dispatch(importFinished())
    return dispatch(findMatchesToShow(matchesToShow))
  }
}

export function initMatchQueue(matchesAll, date) {
  const matchesDay1 = matchesAll.slice(0,NUM_MATCHES_DAY_1)
  const matchesDay2 = matchesAll.slice(NUM_MATCHES_DAY_1, NUM_MATCHES_DAY_1 + NUM_MATCHES_DAY_2)
  const date_tmrw = moment(date.opened_today.actual).add(1, 'days').unix() * 1000
  const formattedMatchesDay1 = formatMatches(matchesDay1, date.opened_today.actual)
  const formattedMatchesDay2 = formatMatches(matchesDay2, date_tmrw)

  return {
    type: INIT_MATCH_QUEUE,
    current_day: formattedMatchesDay1,
    next_day: formattedMatchesDay2
  }
}
