
import React, { Component } from 'react'
import {
  View
} from 'react-native'
import { Provider } from 'react-redux'
import { persistStore } from 'redux-persist'
import { AsyncStorage } from 'react-native'

import configureStore from './app/platform/Client'
import App from './app/index'

const store = configureStore()

export default class Client extends Component {
  constructor() {
    super()
    this.state = { rehydrated: false }
  }

  componentWillMount(){
    persistStore(store, {
      storage: AsyncStorage,
      blacklist: ['matchesAll', 'characters']
    }, () => {
      this.setState({ rehydrated: true })
    })
  }

  render() {
    if (!this.state.rehydrated) {
      return (<View></View>);
    }
    return (
      <Provider store={store}>
        <App />
      </Provider>
    );
  }
}
