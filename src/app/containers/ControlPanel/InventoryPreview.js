
import React, { Component } from 'react'
import {
  Image,
  StyleSheet,
  Text,
  View
} from 'react-native'

export default class InventoryPreview extends Component {
  render() {
    const { jumps, keys } = this.props
    return (
      <View style={styles.container}>
        <Image
          source={require('./jumpCircleSmall.png')}
          style={styles.invPreviewImage}
        />
        <Text style={styles.invPreviewText}>
          {jumps}
        </Text>
        <Image
          source={require('./keysCircleSmall.png')}
          style={styles.invPreviewImage}
        />
        <Text style={styles.invPreviewText}>
          {keys}
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  invPreviewImage: {
    width: 30,
    height: 30,
    marginRight: 10,
    marginLeft: 10
  },
  invPreviewText: {
    fontSize: 16,
    color: '#606060',
    fontWeight: '500'
  }
})
