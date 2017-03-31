
import { AsyncStorage } from 'react-native'

import { compose, createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import { persistStore, autoRehydrate } from 'redux-persist'
import rootReducer from '../reducers'

const loggerMiddleware = createLogger()

export default function configureStore(preloadedState) {
  const store = createStore(
    rootReducer,
    preloadedState,
    compose(
      applyMiddleware(
        thunkMiddleware,
        loggerMiddleware
      ),
      autoRehydrate({log: true})
    )
  )
  persistStore(store, {
    storage: AsyncStorage,
    blacklist: ['matches', 'characters']
  }, () => {
    console.log('rehydration complete')
  })
  return store
}
