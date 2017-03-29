
import React from 'react'
import {
  Button,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { connect } from 'react-redux'
import NavigationBar from 'react-native-navbar'
import _ from 'lodash'
import { Bubble, GiftedChat } from 'react-native-gifted-chat'

import { getBackgroundStyle, getBackgroundColor } from '../../lib/colors'
import { nextStep } from '../../actions/chat'

const TEXT_COLOR_LIGHT = 'white'

class Chat extends React.Component {
  constructor(props) {
    super(props);
    const { characters, curChat, dispatch, matches } = props
    // const { key } = curChat
    let threads = {}
    let match = {}

    // const character = characters.find((char) => { return char.key === key })
    // let platform = 'tinder'

    // if (key) {
    //   match = matches.find((match) => { return match.key === key })
    //   threads = match.threads
    //   firstThread = threads.a
    //   platform = firstThread.platform
    // }

    // FIX get rid of all state except messages
    this.state = {
      messages: [],
      platform: 'tinder',
      match,
      threads,
      // character
    }
  }

  leftButtonConfig = {
    title: 'Back',
    tintColor: 'black',
    handler: () => this._onBackPress(),
  }

  _onBackPress() {
    const { navigator } = this.props
    navigator.pop()
  }

  // FIX remove all functions except button handlers and render functions

  // getThumb(nextMessage) {
  //   const { characters } = this.props
  //   const { curChat } = this.state
  //   const { key } = curChat
  //   const { cha_id } = nextMessage
  //   if (nextMessage.cha_id === 2) {
  //     return 'https://www.playshakespeare.com/images/avatar/thumb_1b09da63a23c12d8d02185e9.jpg'
  //   } else if ( cha_id < 100) {
  //     return ''
  //   }
  //   const character = characters.find((char) => { return char.key === key })
  //   return character.images.thumb
  // }

  _onNextPress() {
    const { curChat, dispatch } = this.props
    const { key } = curChat

    dispatch(nextStep(key))
  }

  _onOptionPress(option) {
    this.switchBranch(option.target_thread)
  }

  renderBubble(props) {
    // const { curChat } = this.state
    const firstBgColor = getBackgroundColor('tinder')
    const { currentMessage } = props
    const secondBgColor = currentMessage.cha_id === 2 ? '#D0E2F4': '#F0F0F0'

    return (
      <Bubble
        {...props}
        textStyle={{
          right: {
          color: TEXT_COLOR_LIGHT,
        }
        }}
        wrapperStyle={{
          left: {
            backgroundColor: secondBgColor
          },
          right: {
            backgroundColor: firstBgColor
          }
        }}
      />
    );
  }

  renderInputToolbar() {
    const { curChat } = this.props
    const isActive = !_.isEmpty(curChat)
    if (!isActive) {
      return this.renderNextBubble()
    }
    const { atBranch } = curChat
    if (atBranch) {
      return this.renderBranchOptions()
    } else {
      return this.renderNextBubble()
    }
  }

  renderBranchOptions() {
    const { curChat, threads } = this.state
    const currentThread = threads[curChat.thread]
    const { branch } = currentThread
    const { options } = branch

    return (
      <View style={styles.inputToolbar}>
        { this.renderOptionBubbles(options) }
      </View>
    );
  }

  renderOptionBubbles(options) {
    return options.map((option) => {
      { return this.renderOptionBubble(option) }
    })
  }

  renderOptionBubble(option) {
    const { curChat } = this.state
    const backgroundStyle = getBackgroundStyle('tinder')

    return (
      <TouchableOpacity key={option.dec_id} style={styles.optionBubbleTouch} onPress={this._onOptionPress.bind(this, option)}>
        <View  style={[styles.bubbleBase, styles.optionBubble, backgroundStyle]}>
          <Text
            style={styles.optionBubbleText}
            numberOfLines={2}>
            {option.text}
          </Text>

        </View>
      </TouchableOpacity>
    );
  }

  renderNextBubble() {
    // const { curChat } = this.state
    const backgroundStyle = getBackgroundStyle('tinder')

    return (
      <View style={styles.inputToolbar}>
        <TouchableOpacity onPress={this._onNextPress.bind(this)}>
          <View style={[styles.bubbleBase, styles.nextBubble, backgroundStyle]}>
            <Text
              style={styles.nextBubbleText}>
              Next
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  renderAccessory(props) {
    return (
      <View>
      </View>
    );
  }

  componentWillMount() {
    this.setState({
      messages: [
      ],
    });
  }

  componentWillReceiveProps(nextProps) {
    const { curChat } = nextProps
    const { giftedChat } = curChat
    const { messages } = giftedChat
    console.log('curChat', curChat)
    this.setState({
      messages: GiftedChat.append(this.state.messages, messages[messages.length - 1]),
    })
  }

  render() {
    const { character } = this.state
    const first_name = character && character.first_name || "Ann"

    return (
      <View style={styles.container}>
        <NavigationBar
          leftButton={this.leftButtonConfig}
          tintColor={"#F8F8F8"}
          title={{title: first_name}}
        />
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          renderInputToolbar={this.renderInputToolbar.bind(this)}
          renderAccessory={this.renderAccessory.bind(this)}
          messages={this.state.messages}
          bottomOffset={100}
          user={{
            _id: 1,
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  inputToolbar: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  bubbleBase: {
    flex: 1,
    borderRadius: 15,
    borderBottomRightRadius: 0,
    marginTop: 10,
    minHeight: 20,
    justifyContent: 'center',
    height: 70
  },
  nextBubble: {
    marginLeft: 50,
    marginRight: 50,
    paddingLeft: 50,
    paddingRight: 50,
    alignItems: 'center',
  },
  nextBubbleText: {
    fontSize: 16,
    color: TEXT_COLOR_LIGHT
  },
  optionBubbleTouch: {
    flex: 1
  },
  optionBubble: {
    marginLeft: 10,
    marginRight: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
  optionBubbleText: {
    color: TEXT_COLOR_LIGHT
  }
})

const mapStateToProps = function(state) {
  const { characters, chat, matches } = state
  const { activeChats, currentChat } = chat
  const { key } = currentChat
  const curChat = activeChats[key]

  return {
    characters,
    curChat,
    key,
    matches
  }
}
export default connect(mapStateToProps)(Chat)
