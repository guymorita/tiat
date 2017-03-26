
import React, { Component } from 'react'
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { connect } from 'react-redux'

class MatchCell extends Component {
  _onPressCell() {
    const { navigator } = this.props
    navigator.push({
      title: "Chat"
    })
  }

  render() {
    const { characters, userInfo } = this.props
    const { key } = userInfo

    const isChar = (el) => { return el.key === key }

    const femaleChar = characters.find(isChar)
    const { images } = femaleChar

    const firstImage = images.photo_0
    console.log('firstImage', firstImage)

    return (
      <TouchableOpacity onPress={this._onPressCell.bind(this)}>
        <View style={styles.container}>
          <View>
            <Image
              style={styles.thumb}
              source={{uri: firstImage}}
            />

          </View>
          <View style={styles.infoColumn}>
            <Text style={styles.name}>
              {femaleChar.first_name}
            </Text>
            <Text style={styles.subText}>
              Matched Yesterday
            </Text>
          </View>
        </View>
      </TouchableOpacity>
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

const mapStateToProps = function(state) {
  const { characters } = state

  return {
    characters
  }
}

export default connect(mapStateToProps)(MatchCell)