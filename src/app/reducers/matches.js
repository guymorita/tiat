
import matchBlob from '../data/v1/matches.json'

const initialState = matchBlob.matches

export default function matches(state = initialState, action) {
  switch(action.type) {
    default:
      return state
  }
}
