
import React, { Component } from 'react'
import {
  ListView,
  StyleSheet,
  Text,
  View
} from 'react-native'
import { connect } from 'react-redux'


import MatchCell from './MatchCell'

class Matches extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2
    })

    const { matchesAll, matchQueue } = props

    const { current_day } = matchQueue
    const { queue } = current_day
    const filteredMatchQueue = queue.map((match) => { return match.key })
    // FIX filter matches with incomplete timer out

    const matchIncluded = match => filteredMatchQueue.includes(match.key)
    const matchesToShow = matchesAll.filter(matchIncluded)

    this.state = {
      dataSource: ds.cloneWithRowsAndSections({Messages: matchesToShow})
    }
  }

  render() {
    const { navigator } = this.props
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={(rowData) =>
          <MatchCell matchInfo={rowData} navigator={navigator}/>
        }
        renderSectionHeader={this.renderSectionHeader}
      />
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
  sectionHeader: {
    marginLeft: 20,
    marginTop: 10,
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor: '#fff'
  }
})

const mapStateToProps = function(state) {
  const { matchesAll, matchQueue } = state
  return {
    matchesAll,
    matchQueue
  }
}

export default connect(mapStateToProps)(Matches)