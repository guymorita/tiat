
import React, { Component } from 'react'
import {
  ListView,
  StyleSheet,
  Text,
  View
} from 'react-native'
import { connect } from 'react-redux'
import NavigationBar from 'react-native-navbar'

import { findMatches } from '../../actions/matches'
import MatchCell from './MatchCell'

class Matches extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2
    })

    const { dispatch, matchesAll, matchQueue } = props
    dispatch(findMatches(matchesAll, matchQueue))

    this.state = {
      dataSource: ds.cloneWithRowsAndSections({Messages: []}),
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

  componentWillReceiveProps(nextProps) {
    const { currentMatches } = nextProps
    this.setState({
      dataSource: this.state.ds.cloneWithRowsAndSections({Messages: currentMatches})
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
          renderRow={(rowData) =>
            <MatchCell matchInfo={rowData} navigator={navigator}/>
          }
          renderSectionHeader={this.renderSectionHeader}
        />
      </View>
    );
  }

  renderSectionHeader(sectionData, category) {
    return (
      <View style={styles.sectionHeader}>
        <Text style={{fontWeight: "700"}}>{category}</Text>
      </View>
    )
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
  const { currentMatches, matchesAll, matchQueue } = state
  return {
    currentMatches,
    matchesAll,
    matchQueue
  }
}

export default connect(mapStateToProps)(Matches)