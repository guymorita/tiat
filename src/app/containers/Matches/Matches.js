
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

import { updateDateDay } from '../../actions/date'
import { tryFindMatches, initMatches } from '../../actions/matches'
import MatchCell from './MatchCell'
import HamburgerButton from '../../components/Nav/HamburgerButton'
import Title from '../../components/Nav/Title'
import { tryCreatePushNotification } from '../../actions/pushNotification'
import Purchase from './Purchase'

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

  _onPurchasePress() {
    const { dispatch } = this.props

  }

  _handleAppStateChange = (nextAppState) => {
    if (nextAppState === 'background') {
      const { dispatch } = this.props
      dispatch(tryCreatePushNotification())
    }
  }

  componentWillMount() {
    const { activeChats, currentMatches, dispatch } = this.props

    dispatch(updateDateDay())

    if (!currentMatches.length) {
      dispatch(initMatches())
    } else {
      dispatch(tryFindMatches(currentMatches, activeChats))
    }

    this.setState({
      dataSource: this.state.ds.cloneWithRows(currentMatches),
    })
  }

  componentWillReceiveProps(nextProps) {
    const { activeChats, currentMatches, dispatch } = nextProps

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
          leftButton={<HamburgerButton onHamPress={this._onLeftButtonPress.bind(this)}/>}
          rightButton={this.devButtonConfig}
          tintColor={"#F8F8F8"}
          title={<Title text={"Chats"} />}
        />
        <ListView
          dataSource={this.state.dataSource}
          enableEmptySections={true}
          removeClippedSubviews={false}
          renderRow={(rowData) =>
            <MatchCell matchInfo={rowData} navigator={navigator}/>
          }
          renderFooter={() => <Purchase />}
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
  const { activeChats, currentMatches, date } = state
  return {
    activeChats,
    currentMatches,
    date
  }
}

export default connect(mapStateToProps)(Matches)