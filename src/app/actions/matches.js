
import {
  Alert
} from 'react-native'
import _ from 'lodash'
import moment from 'moment'

import {
  dayFromDate,
  dateNow,
  updateDateDay
} from './date'
import { invKeysSubtract } from './inventory'

import { productBuy } from './store' // platform specific

export const ADVANCE_MATCH_QUEUE = 'ADVANCE_MATCH_QUEUE'
export const FIND_MATCHES_TO_SHOW = 'FIND_MATCHES_TO_SHOW'
export const IMPORT_TO_CURRENT_MATCHES_FINISHED = 'IMPORT_TO_CURRENT_MATCHES_FINISHED'
export const INIT_MATCH_QUEUE = 'INIT_MATCH_QUEUE'

const MIN_NUM_RANDOM_MATCHES_PER_DAY = 1
const MAX_NUM_RANDOM_MATCHES_PER_DAY = 2

const NUM_MATCHES_DAY_1 = 5

const NUM_MAX_NEW_MATCHES = 3

function formatMatches(matches, date) {
  return matches.map((match) => { return { key: match.key, date_matched: date }})
}

export function tryPurchaseMatches(key) {
  return (dispatch, getState) => {
    const state = getState()
    const { matchesAll, currentMatches } = state
    const noMoreMatches = currentMatches.length >= matchesAll.length
    if (noMoreMatches) {
      Alert.alert(
        'There are no more matches!',
        `We are adding more soon =)`
      )
    } else {
      dispatch(productBuy(key))
    }
  }
}

function findMatchesToShow(matches) {
  return {
    type: FIND_MATCHES_TO_SHOW,
    matches
  }
}

export function findRandNumMatches() {
  return (dispatch) => {
    const range = MAX_NUM_RANDOM_MATCHES_PER_DAY - MIN_NUM_RANDOM_MATCHES_PER_DAY
    const numRandomMatches = Math.floor(Math.random()*(range + 1))+MIN_NUM_RANDOM_MATCHES_PER_DAY
    for (let i = 0; i < numRandomMatches; i++ ) {
      dispatch(pushMatchToCurrent())
    }
  }
}

export function tryFindMatches() {
  return (dispatch, getState) => {
    const state = getState()
    const { date } = state
    const now = dateNow()
    const day = dayFromDate(now)
    if (day !== date.opened_today.actual_day) {
      dispatch(findRandNumMatches())
    }
    dispatch(updateDateDay())
  }
}

function overNewMatchLimit(currentMatches, activeChats, maxNumNew) {
  return currentMatches.length >= (_.keys(activeChats).length + maxNumNew)
}

function tryPushMatchToCurrent() {
  return (dispatch, getState) => {
    const state = getState()
    const { date } = state

  }
}

function pushMatchToCurrent() {
  return (dispatch, getState) => {
    const state = getState()
    const { matchesAll, currentMatches } = state
    const allMatchedKeys = currentMatches.map((match) => { return match.key})
    const allNotMatched = matchesAll.filter((match) => { return !allMatchedKeys.includes(match.key)})
    const firstMatch = allNotMatched[0]
    const firstMatchArr = [firstMatch]
    const newMatchList = firstMatchArr.concat(currentMatches)
    dispatch(findMatchesToShow(newMatchList))
  }
}

export function initMatches() {
  return (dispatch) => {
    for (let i = 0; i < NUM_MATCHES_DAY_1; i++ ) {
      dispatch(pushMatchToCurrent())
    }
  }
}
