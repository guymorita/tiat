
import { INTRO_FINISHED, OPEN_DRAWER, CLOSE_DRAWER } from '../actions/ui'

const initialState = {
  intro_finished: false,
  drawer_opened: false
}

export default function currentMatches(state = initialState, action) {
  switch(action.type) {
    case INTRO_FINISHED:
      return {
        ...state,
        intro_finished: true
      }
    case OPEN_DRAWER:
      return {
        ...state,
        drawer_opened: true
      }
    case CLOSE_DRAWER:
      return {
        ...state,
        drawer_opened: false
      }
    default:
      return state
  }
}
