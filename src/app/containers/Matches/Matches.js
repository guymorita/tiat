
import React, { Component } from 'react'
import {
  AppState,
  ListView,
  StyleSheet,
  Text,
  View
} from 'react-native'
import { connect } from 'react-redux'
import NavigationBar from 'react-native-navbar'

import { findMatches, initMatchQueue, tryAdvanceMatchQueue } from '../../actions/matches'
import { updateActualDate } from '../../actions/date'
import MatchCell from './MatchCell'
import { tryCreatePushNotification } from '../../actions/pushNotification'

class Matches extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    })

    this.state = {
      dataSource: ds.cloneWithRows([]),
      ds
    }
  }

  leftButtonConfig = {
    title: '≡',
    tintColor: 'black',
    handler: () => this._onLeftButtonPress()
  }

  devButtonConfig = {
    title: 'Dev',
    tintColor: 'black',
    handler: () => this._onRightButtonPress(),
  }

  blankButtonConfig = {
    title: '',
    handler: () => {}
  }

  _onLeftButtonPress() {
    this.props.openDrawer()
  }

  _onRightButtonPress() {
    const { navigator } = this.props
    navigator.push({
      title: 'Dev'
    })
  }

  _handleAppStateChange = (nextAppState) => {
    if (nextAppState === 'background') {
      const { dispatch } = this.props
      dispatch(tryCreatePushNotification())
    }
  }

  componentWillMount() {
    const { activeChats, currentMatches, date, dispatch, matchesAll, matchQueue } = this.props

    dispatch(updateActualDate())
    dispatch(tryAdvanceMatchQueue())

    if (!matchQueue.init_finish) {
      dispatch(initMatchQueue(matchesAll, date))
    } else {
      dispatch(findMatches(currentMatches, matchQueue, activeChats))
    }

    this.setState({
      dataSource: this.state.ds.cloneWithRows(currentMatches),
    })
  }

  componentWillReceiveProps(nextProps) {
    const { activeChats, currentMatches, dispatch, matchQueue } = nextProps
    dispatch(findMatches(currentMatches, matchQueue, activeChats))

    this.setState({
      dataSource: this.state.ds.cloneWithRows(currentMatches)
    })
  }

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  render() {
    const { navigator } = this.props
    return (
      <View style={styles.container}>
        <NavigationBar
          leftButton={this.leftButtonConfig}
          rightButton={__DEV__ ? this.devButtonConfig : this.blankButtonConfig}
          tintColor={"#F8F8F8"}
          title={{title: "Chats"}}
        />
        <ListView
          dataSource={this.state.dataSource}
          enableEmptySections={true}
          removeClippedSubviews={false}
          renderRow={(rowData) =>
            <MatchCell matchInfo={rowData} navigator={navigator}/>
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  sectionHeader: {
    marginLeft: 20,
    marginTop: 10,
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor: '#fff'
  }
})

const mapStateToProps = function(state) {
  const { activeChats, currentMatches, date, matchesAll, matchQueue } = state
  return {
    activeChats,
    currentMatches,
    date,
    matchesAll,
    matchQueue
  }
}

export default connect(mapStateToProps)(Matches)