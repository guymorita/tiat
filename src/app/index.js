
import React, { Component } from 'react'
import {
  Navigator,
  Text,
  View
} from 'react-native'
import NavigationBar from 'react-native-navbar'
import { connect } from 'react-redux'

import Chat from './containers/Chat/Chat'
import Dev from './containers/Dev/Dev'
import Matches from './containers/Matches/Matches'
import Intro from './containers/Intro/Intro'

class App extends Component {
  render() {
    const { intro } = this.props
    const routes = [
      {title: 'Intro', index: 0},
      {title: 'Matches', index: 1},
      {title: 'Chat', index: 2},
      {title: 'Dev', index: 3}
    ]
    const firstRoute = intro.intro_finished ? routes[1] : routes[0]
    return (
      <Navigator
        initialRoute={firstRoute}
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

      case 'Intro':
        return (
          <View style={{flex: 1}}>
            <Intro navigator={navigator}/>
          </View>
        )
    }
  }
}

const mapStateToProps = function(state) {
  const { intro } = state
  return { intro }
}

export default connect(mapStateToProps)(App)