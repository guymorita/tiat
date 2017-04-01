
import React, { Component } from 'react'
import {
  Navigator,
  Text,
  View
} from 'react-native'
import NavigationBar from 'react-native-navbar'

import Chat from './containers/Chat/Chat'
import Dev from './containers/Dev/Dev'
import Matches from './containers/Matches/Matches'

export default class App extends Component {
  render() {
    const routes = [
      {title: 'Matches', index: 0},
      {title: 'Chat', index: 1},
      {title: 'Dev', index: 2}
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
    switch(route.title) {
      case 'Matches':
        return (
          <View style={{flex: 1}}>
            <Matches navigator={navigator}/>
          </View>
        );

      case 'Chat':
        return (
          <View style={{flex: 1}}>
            <Chat navigator={navigator}/>
          </View>
        );

      case 'Dev':
        return (
          <View style={{flex: 1}}>
            <Dev navigator={navigator}/>
          </View>
        );
    }
  }
}

