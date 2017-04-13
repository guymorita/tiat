
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
import Intro from './containers/Intro/Intro'
import Matches from './containers/Matches/Matches'
import Store from './containers/Store/Store'

class App extends Component {
  render() {
    const { intro } = this.props
    const routes = [
      {title: 'Intro', index: 0},
      {title: 'Matches', index: 1},
      {title: 'Chat', index: 2},
      {title: 'Dev', index: 3},
      {title: 'Store', index: 4}
    ]
    const firstRoute = intro.intro_finished ? routes[1] : routes[0]
    return (
      <Navigator
        initialRoute={firstRoute}
        initialRouteStack={routes}
        renderScene={this.renderScene.bind(this)}
        configureScene={(route, routeStack) =>
          Navigator.SceneConfigs.FadeAndroid}
      />
    );
  }

  _renderScene = (component) => {
    return (
      <View style={{flex: 1}}>
        {component}
      </View>
    )
  }

  renderScene(route, navigator) {
    switch(route.title) {
      case 'Chat':
        return this._renderScene(<Chat navigator={navigator}/>)

      case 'Dev':
        return this._renderScene(<Dev navigator={navigator}/>)

      case 'Intro':
        return this._renderScene(<Intro navigator={navigator}/>)

      case 'Matches':
        return this._renderScene(<Matches navigator={navigator}/>)

      case 'Store':
        return this._renderScene(<Store navigator={navigator}/>)
    }
  }
}

const mapStateToProps = function(state) {
  const { intro } = state
  return { intro }
}

export default connect(mapStateToProps)(App)