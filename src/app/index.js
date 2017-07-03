
import React, { Component } from 'react'
import {
  Navigator,
  Text,
  View
} from 'react-native'
import NavigationBar from 'react-native-navbar'
import { connect } from 'react-redux'
import Drawer from 'react-native-drawer'

import Chat from './containers/Chat/Chat'
import ControlPanel from './containers/ControlPanel/ControlPanel'
import Dev from './containers/Dev/Dev'
import Intro from './containers/Intro/Intro'
import Matches from './containers/Matches/Matches'
import Profile from './containers/Matches/Profile'
import { Store } from './containers/Store/Store'
import Web from './containers/Web/Web'

import { openDrawer, closeDrawer } from './actions/ui'

class App extends Component {
  _openDrawer = () => {
    this._drawer.open()
  }

  _closeDrawer = () => {
    this._drawer.close()
  }

  componentWillReceiveProps(nextProps) {
    const { ui } = nextProps
    const { drawer_opened } = ui
    drawer_opened ? this._openDrawer() : this._closeDrawer()
  }

  render() {
    const { ui } = this.props
    const routes = [
      {title: 'Intro', index: 0},
      {title: 'Matches', index: 1},
      {title: 'Chat', index: 2},
      {title: 'Dev', index: 3},
      {title: 'Store', index: 4},
      {title: 'Profile', index: 5},
      {title: 'Web', index: 6}
    ]
    const firstRoute = ui.intro_finished ? routes[1] : routes[0]

    return (
      <Drawer
        ref={(ref) => this._drawer = ref}
        openDrawerOffset={100}
        tapToClose={true}
        content={<ControlPanel navigator={this._navigator} {...this.props}/>}
        >
        <Navigator
          initialRoute={firstRoute}
          initialRouteStack={routes}
          ref={(ref) => this._navigator = ref}
          renderScene={this.renderScene.bind(this)}
          configureScene={(route, routeStack) =>
            Navigator.SceneConfigs.FadeAndroid}
        />
      </Drawer>
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
        return this._renderScene(<Chat navigator={navigator} {...this.props}/>)

      case 'Dev':
        return this._renderScene(<Dev navigator={navigator} {...this.props}/>)

      case 'Intro':
        return this._renderScene(<Intro navigator={navigator} {...this.props}/>)

      case 'Matches':
        return this._renderScene(<Matches navigator={navigator} {...this.props}/>)

      case 'Store':
        return this._renderScene(<Store navigator={navigator} {...this.props}/>)

      case 'Profile':
        return this._renderScene(<Profile navigator={navigator} {...this.props}/>)

      case 'Web':
        return this._renderScene(<Web navigator={navigator} {...this.props}/>)
    }
  }
}

function mapDispatchToProps(dispatch) {
  return({
    openDrawer: () => {dispatch(openDrawer())},
    closeDrawer: () => {dispatch(closeDrawer())}
  })
}


const mapStateToProps = function(state) {
  const { ui } = state
  return { ui }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)