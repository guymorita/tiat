
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

    const { matches } = props

    this.state = {
      dataSource: ds.cloneWithRowsAndSections({Messages: matches})
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
  const { matches } = state
  return {
    matches
  }
}

export default connect(mapStateToProps)(Matches)