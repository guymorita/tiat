
import React, { Component } from 'react'
import {
  ListView,
  StyleSheet,
  Text,
  View
} from 'react-native'
import { connect } from 'react-redux'
import NavigationBar from 'react-native-navbar'

import { findMatches, initMatchQueue } from '../../actions/matches'
import MatchCell from './MatchCell'

class Matches extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    })

    const { currentMatches, date, dispatch, matchesAll, matchQueue } = props
    if (!matchQueue.init_finish) {
      dispatch(initMatchQueue(matchesAll, date))
    } else {
      dispatch(findMatches(currentMatches, matchQueue))
    }

    this.state = {
      dataSource: ds.cloneWithRows([]),
      ds
    }
  }

  rightButtonConfig = {
    title: 'Dev',
    tintColor: 'black',
    handler: () => this._onRightButtonPress(),
  }

  _onRightButtonPress() {
    const { navigator } = this.props
    navigator.push({
      title: 'Dev'
    })
  }

  componentWillMount() {
    const { currentMatches } = this.props

    this.setState({
      dataSource: this.state.ds.cloneWithRows(currentMatches),
    })
  }

  componentWillReceiveProps(nextProps) {
    const { currentMatches, dispatch, matchQueue } = nextProps
    dispatch(findMatches(currentMatches, matchQueue))

    this.setState({
      dataSource: this.state.ds.cloneWithRows(currentMatches)
    })
  }

  render() {
    const { navigator } = this.props
    return (
      <View style={styles.container}>
        <NavigationBar
          rightButton={this.rightButtonConfig}
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
  const { currentMatches, date, matchesAll, matchQueue } = state
  return {
    currentMatches,
    date,
    matchesAll,
    matchQueue
  }
}

export default connect(mapStateToProps)(Matches)