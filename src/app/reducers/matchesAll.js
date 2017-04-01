
import matchBlob from '../data/v1/matches.json'

const initialState = matchBlob.matches

export default function matchesAll(state = initialState, action) {
  switch(action.type) {
    default:
      return state
  }
}
