
import { compose, createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import { autoRehydrate } from 'redux-persist'
import rootReducer from '../reducers'

export default function configureStore(preloadedState) {
  let middleware = [ thunkMiddleware ]
  if (process.env.NODE_ENV !== 'production') {
    const loggerMiddleware = createLogger()
    // middleware = [ ...middleware, loggerMiddleware ]
  }

  const store = createStore(
    rootReducer,
    preloadedState,
    compose(
      applyMiddleware(
        ...middleware
      ),
      autoRehydrate()
    )
  )
  return store
}
