
import React, { Component } from 'react'
import {
  Navigator,
  Text,
  View
} from 'react-native'
import NavigationBar from 'react-native-navbar'

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
    switch(route.title) {
      case 'Matches':
        return (
          <View>
            <NavigationBar
              tintColor={"#F8F8F8"}
              title={{title: "Chats"}}
            />
            <Matches />
          </View>
        );

      case 'Chat':
        return (
          <View>
            <NavigationBar
              tintColor={"#F8F8F8"}
              title={{title: "Ann"}}
            />
            <Chat />
          </View>
        );

    }
  }
}