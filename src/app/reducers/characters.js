
import characters from '../data/v1/characters.json'

const initialState = characters.characters

export default function matches(state = initialState, action) {
  switch(action.type) {
    default:
      return state
  }
}
