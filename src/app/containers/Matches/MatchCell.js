
import React, { Component } from 'react'
import {
  Image,
  StyleSheet,
  Text,
  View
} from 'react-native'

export default class MatchCell extends Component {
  render() {
    const { userInfo } = this.props
    return (
      <View style={styles.container}>
        <View>
          <Image
            style={styles.thumb}
            source={{uri: userInfo.thumb_url}}
          />
        </View>
        <View style={styles.infoColumn}>
          <Text style={styles.name}>
            {userInfo.first_name}
          </Text>
          <Text style={styles.subText}>
            Matched Yesterday
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10
  },
  thumb: {
    marginLeft: 10,
    width: 80,
    height: 80,
    borderRadius: 40
  },
  infoColumn: {
    marginLeft: 15
  },
  name: {
    marginTop: 15,
    marginBottom: 5,
    fontWeight: 'bold',
    fontSize: 18
  },
  subText: {
    color: '#B2B2B2'
  }
})