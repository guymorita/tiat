
import React, { Component } from 'react'
import {
  AppState,
  ListView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { connect } from 'react-redux'
import NavigationBar from 'react-native-navbar'

import { tryFindMatches, initMatches } from '../../actions/matches'
import MatchCell from './MatchCell'
import HamburgerButton from '../../components/Nav/HamburgerButton'
import Title from '../../components/Nav/Title'
import { tryCreatePushNotification } from '../../actions/pushNotification'
import { StoreModal } from '../../components/Modal/Modal'
import { TINDER_COLOR } from '../../lib/colors'

class Matches extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    })

    this.state = {
      dataSource: ds.cloneWithRows([]),
      ds,
      modalStoreOpen: false
    }
  }

  _onOpenModal() {
    this.setState({
      modalStoreOpen: true
    })
  }

  _onCloseModal() {
    this.setState({
      modalStoreOpen: false
    })
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

  _renderMoreMatches() {
    const { inventory } = this.props
    if (inventory.subscription.enabled) return <View></View>

    return (
      <TouchableOpacity onPress={() => {this._onOpenModal()}}>
        <View style={[styles.productButton, styles.redBackground]}>
          <Text style={styles.productButtonText}>
            More Matches
          </Text>
        </View>
      </TouchableOpacity>
    )
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
          renderFooter={() => this._renderMoreMatches()}
        />
        <StoreModal open={this.state.modalStoreOpen} close={this._onCloseModal.bind(this)} onClosed={this._onCloseModal.bind(this)} />
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
  },
  redBackground: {
    backgroundColor: TINDER_COLOR
  },
  productButton: {
    margin: 16,
    marginBottom: 20,
    borderRadius: 12,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  productButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600'
  }
})

const mapStateToProps = function(state) {
  const { activeChats, currentMatches, date, inventory } = state
  return {
    activeChats,
    currentMatches,
    date,
    inventory
  }
}

export default connect(mapStateToProps)(Matches)