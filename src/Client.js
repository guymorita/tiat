
import React, { Component } from 'react'
import { Provider } from 'react-redux'
import configureStore from './app/platform/Client'
import App from './app/index'

const store = configureStore()

export default class Client extends Component {
  render() {
    return (
      <Provider store={store}>
        <App />
      </Provider>
    );
  }
}
