
import React, { Component } from 'react'
import {
  ListView,
  StyleSheet,
  Text,
  View
} from 'react-native'

import MatchCell from './MatchCell'

const ana = {
  "thumb_url": "https://s-media-cache-ak0.pinimg.com/736x/47/5e/0f/475e0f1362a7526c16d604f5dac47b86.jpg",
  "id": 11,
  "first_name": "Katey"
}

export default class Matches extends Component {
  constructor() {
    super();
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2
    })

    this.state = {
      dataSource: ds.cloneWithRowsAndSections({Messages: Array(6).fill(ana)}),
    };
  }

  render() {
    const { navigator } = this.props
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={(rowData) =>
          <MatchCell userInfo={rowData} navigator={navigator}/>
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