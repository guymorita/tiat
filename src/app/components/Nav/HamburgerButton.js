

import React from 'react'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'

export default class HamburgerButton extends React.Component {
  render() {
    const { onHamPress } = this.props
    return (
      <TouchableOpacity onPress={onHamPress}>
        <View style={styles.container}>
          <Text style={styles.text}>
            ☰
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
    fontSize: 24,
    marginLeft: 15,
    height: 40
  }
})
