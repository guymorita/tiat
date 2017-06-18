
import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'

import { TINDER_COLOR } from '../../lib/colors'

export default class Purchase extends Component {
  _onPressCell() {

  }

  render() {

    return (
      <TouchableOpacity onPress={this._onPressCell.bind(this)}>
        <View style={styles.container}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>
              More Matches
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  button: {
    margin: 16,
    borderRadius: 12,
    height: 60,
    backgroundColor: TINDER_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  }
})
