
import React, { Component } from 'react'
import {
  Text,
  View
} from 'react-native'

export default class MatchCell extends Component {
  render() {
    const { userInfo } = this.props
    return (
      <View>
        <Text>
          {userInfo.first_name}
        </Text>
      </View>
    );
  }
}