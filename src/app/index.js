
import React, { Component } from 'react'
import {
  Navigator,
  Text,
  View
} from 'react-native'

import Chat from './containers/Chat/Chat'
import Matches from './containers/Matches/Matches'

export default class App extends Component {
  render() {
    const routes = [
      {title: 'Matches', index: 0},
      {title: 'Chat', index: 1},
    ];
    return (
      <Navigator
        initialRoute={routes[0]}
        initialRouteStack={routes}
        renderScene={this.renderScene.bind(this)}
      />
    );
  }

  renderScene(route, navigator) {
    console.log('route', route)
    switch(route.title) {
      case 'Matches':
        return <Matches />
      case 'Chat':
        return <Chat />

    }
  }
}