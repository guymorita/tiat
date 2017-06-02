

import React from 'react'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'

export default class BackButton extends React.Component {
  render() {
    const { onBackPress } = this.props
    return (
      <TouchableOpacity onPress={onBackPress}>
        <View style={styles.container}>
          <Text style={styles.text}>
            ←
          </Text>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  text: {
    fontSize: 28,
    marginLeft: 15,
    height: 40
  }
})
