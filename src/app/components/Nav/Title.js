

import React from 'react'
import {
  StyleSheet,
  Text,
  View
} from 'react-native'

export default class Title extends React.Component {
  render() {
    const { text } = this.props
    return (
      <View style={styles.container}>
        <Text style={styles.text}>
          {text}
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40
  },
  text: {
    fontSize: 20
  }
})
