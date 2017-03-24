
import React, { Component } from 'react'
import {
  ListView,
  Text
} from 'react-native'

export default class Matches extends Component {
  constructor() {
    super();
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2
    })
    this.state = {
      dataSource: ds.cloneWithRowsAndSections({Messages: ['Lilan', 'Bubu']}),
    };
  }

  render() {
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={(rowData) => <Text>{rowData}</Text>}
        renderSectionHeader={this.renderSectionHeader}
      />
    );
  }

  renderSectionHeader(sectionData, category) {
    return (
      <Text style={{fontWeight: "700"}}>{category}</Text>
    )
  }
}
