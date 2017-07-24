
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
export const REMOVE_ACTIVE_CHAT = 'REMOVE_ACTIVE_CHAT'
export const REMOVE_CURRENT_MATCH = 'REMOVE_CURRENT_MATCH'

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
  return (dispatch, getState) => {
    const state = getState()
    const { currentMatches, matchesAll } = state
    const matchesLeft = matchesAll.length - currentMatches.length
    const range = MAX_NUM_RANDOM_MATCHES_PER_DAY - MIN_NUM_RANDOM_MATCHES_PER_DAY
    const numRandomMatches = Math.floor(Math.random()*(range + 1))+MIN_NUM_RANDOM_MATCHES_PER_DAY
    const lesserOf = matchesLeft < numRandomMatches ? matchesLeft : numRandomMatches
    for (let i = 0; i < lesserOf; i++ ) {
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
    dispatch(cleanMatches())
    if (day !== date.opened_today.actual_day) {
      dispatch(findRandNumMatches())
    }
    dispatch(updateDateDay())
  }
}

function removeActiveChat(key) {
  return {
    type: REMOVE_ACTIVE_CHAT,
    key
  }
}

function removeCurrentMatch(key) {
  return {
    type: REMOVE_CURRENT_MATCH,
    key
  }
}

function cleanMatches() {
  return (dispatch, getState) => {
    const state = getState()
    const { activeChats, currentMatches, matchesAll} = state
    const hashList = matchesAll.map((match) => { return match.hash })
    const hashSet = new Set(hashList)
    const unmatchedList = currentMatches.filter((match) => { return !hashSet.has(match.hash) })

    unmatchedList.forEach((match) => {
      const { key } = match
      dispatch(removeActiveChat(key))
      dispatch(removeCurrentMatch(key))
    })
  }
}

function overNewMatchLimit(currentMatches, activeChats, maxNumNew) {
  return currentMatches.length >= (_.keys(activeChats).length + maxNumNew)
}

function pushMatchToCurrent(i = 0) {
  return (dispatch, getState) => {
    const state = getState()
    const { matchesAll, currentMatches } = state
    const allMatchedKeys = currentMatches.map((match) => { return match.key})
    const allNotMatched = matchesAll.filter((match) => { return !allMatchedKeys.includes(match.key)})
    const firstMatch = allNotMatched[i]
    const firstMatchArr = [firstMatch]
    const newMatchList = firstMatchArr.concat(currentMatches)
    dispatch(findMatchesToShow(newMatchList))
  }
}

export function initMatches() {
  return (dispatch) => {
    for (let i = NUM_MATCHES_DAY_1 - 1; i >= 0; i-- ) {
      dispatch(pushMatchToCurrent(i))
    }
  }
}
