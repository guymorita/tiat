
import React, { Component } from 'react'
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import moment from 'moment'
import _ from 'lodash'
import { connect } from 'react-redux'

import { initSwitchChat } from '../../actions/chat'
import { LIGHT_BLUE, TINDER_COLOR } from '../../lib/colors'

class MatchCell extends Component {
  _onPressCell(key) {
    const { dispatch, navigator } = this.props
    dispatch(initSwitchChat(key))
    navigator.push({
      title: "Chat"
    })
  }

  render() {
    const { activeChats, characters, date, matchInfo } = this.props
    const { date_matched, key } = matchInfo
    const activeChat = activeChats[key]
    let isTerminated = false

    const isNewMatch = _.isEmpty(activeChat)
    let lastMessageText = ''

    if (!isNewMatch && activeChat.giftedChat.messages.length) {
      isTerminated = activeChat.terminate.isTerminated
      const messages = activeChat.giftedChat.messages
      const lastMessage = _.last(messages)
      lastMessageText = lastMessage.text
    }

    const isChar = (el) => { return el.key === key }

    const femaleChar = characters.find(isChar)
    const { images } = femaleChar

    const imageMapping = {
      '101_Ana': require('./101Ana0.png'),
      '102_Jessica': require('./102Jessica0.png'),
      '103_Christina': require('./103Christina0.png'),
      '104_Em': require('./104Em0.png'),
      '105_Katrina': require('./105Katrina0.png'),
      '106_Susan': require('./106Susan0.png'),
      '107_Lucy': require('./107Lucy0.png'),
      '108_Jane': require('./108Jane0.png'),
      '109_Bianca': require('./109Bianca0.png'),
      '110_Mai': require('./110Mai0.png'),
      '111_Karen': require('./111Karen0.png'),
      '112_Mina': require('./112Mina0.png'),
      '113_Ashley': require('./113Ashley0.png')
    }

    const firstImage = (key) => { return imageMapping[key] }

    return (
      <TouchableOpacity onPress={this._onPressCell.bind(this, key)}>
        <View style={styles.container}>
          <View>
            <Image
              style={styles.thumb}
              source={firstImage(key)}
            />

          </View>
          <View style={styles.infoColumn}>
            <Text style={styles.name}>
              {femaleChar.first_name}
            </Text>
            {isNewMatch &&
              <Text style={styles.newMatch}>
                New Match!
              </Text>
            }
            {!isTerminated && !isNewMatch &&
              <Text
                style={styles.subText}
                numberOfLines={1}
              >
                {lastMessageText}
              </Text>
            }
            {isTerminated &&
              <Text style={styles.chatEnded}>
                Chat Ended
              </Text>
            }
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
    marginLeft: 15,
    flex: 1
  },
  name: {
    marginTop: 15,
    marginBottom: 5,
    fontWeight: 'bold',
    fontSize: 18
  },
  subText: {
    color: '#B2B2B2',
    fontWeight: '500'
  },
  newMatch: {
    color: LIGHT_BLUE,
    fontWeight: '500'
  },
  chatEnded: {
    color: TINDER_COLOR,
    fontWeight: '500'
  }
})

const mapStateToProps = function(state) {
  const { activeChats, characters, date } = state

  return {
    activeChats,
    characters,
    date
  }
}

export default connect(mapStateToProps)(MatchCell)