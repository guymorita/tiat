
import {
  FIND_MATCHES_TO_SHOW,
  REMOVE_CURRENT_MATCH
} from '../actions/matches'

const initialState = []

export default function currentMatches(state = initialState, action) {
  switch(action.type) {
    case FIND_MATCHES_TO_SHOW:
      return action.matches
    case REMOVE_CURRENT_MATCH:
      return state.filter((match) => { return action.key !== match.key })
    default:
      return state
  }
}
