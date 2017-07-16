
import {
  CREATE_USER_ID
} from '../actions/analytics'

const initialState = {
  id: ''
}

export default function user(state = initialState, action) {
  switch(action.type) {
    case CREATE_USER_ID:
      return {
        ...state,
        id: action.id
      }
    default:
      return state
  }
}
