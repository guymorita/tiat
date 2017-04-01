
import chars from '../data/v1/characters.json'

const initialState = chars.characters

export default function characters(state = initialState, action) {
  switch(action.type) {
    default:
      return state
  }
}
