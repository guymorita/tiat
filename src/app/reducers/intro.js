
import { INTRO_FINISHED } from '../actions/intro'

const initialState = {
  intro_finished: false
}

export default function currentMatches(state = initialState, action) {
  switch(action.type) {
    case INTRO_FINISHED:
      return {
        intro_finished: true
      }
    default:
      return state
  }
}
