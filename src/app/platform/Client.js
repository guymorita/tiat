
import { compose, createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import { autoRehydrate } from 'redux-persist'
import rootReducer from '../reducers'

const loggerMiddleware = createLogger()

export let perStore = null

export default function configureStore(preloadedState) {
  const store = createStore(
    rootReducer,
    preloadedState,
    compose(
      applyMiddleware(
        thunkMiddleware,
        loggerMiddleware
      ),
      autoRehydrate()
    )
  )
  return store
}
