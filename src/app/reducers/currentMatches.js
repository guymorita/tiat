
import { FIND_MATCHES_TO_SHOW } from '../actions/matches'

const initialState = []

export default function currentMatches(state = initialState, action) {
  switch(action.type) {
    case FIND_MATCHES_TO_SHOW:
      return action.matches
    default:
      return state
  }
}
