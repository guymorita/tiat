
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

import { LIGHT_BLUE, LIGHT_GRAY, getBackgroundStyle, getBackgroundColor } from '../../lib/colors'
import { getMatch, nextStep, switchBranchPushMessage, shouldWait } from '../../actions/chat'

const TEXT_COLOR_LIGHT = 'white'

class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: []
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

  _onNextPress() {
    const { curChat, dispatch } = this.props
    const { key } = curChat
    dispatch(nextStep(key))
  }

  _onOptionPress(option) {
    const { curChat, dispatch } = this.props
    const { key } = curChat
    dispatch(switchBranchPushMessage(key, option.target_thread))
  }

  renderBubble(props) {
    const firstBgColor = getBackgroundColor(this.props.platform)
    const { currentMessage } = props
    const secondBgColor = currentMessage.cha_id === 2 ? LIGHT_BLUE : LIGHT_GRAY

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

    let renderInputContent = this.renderNextBubble
    if (curChat && curChat.atBranch) {
      renderInputContent = this.renderBranchOptions
    } else if (curChat && shouldWait(curChat)) {
      renderInputContent = this.renderWaitingBubble
    }

    return (
      <View style={styles.inputToolbar}>
        {renderInputContent()}
      </View>
    )
  }

  renderBranchOptions = () => {
    const { curChat, match } = this.props
    const currentThread = match.threads[curChat.thread]
    const { branch } = currentThread
    const { options } = branch

    return this.renderOptionBubbles(options)
  }

  renderOptionBubbles(options) {
    return options.map((option) => {
      { return this.renderOptionBubble(option) }
    })
  }

  renderOptionBubble(option) {
    const backgroundStyle = getBackgroundStyle(this.props.platform)

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

  renderNextBubble = () => {
    const backgroundStyle = getBackgroundStyle(this.props.platform)

    return (
      <TouchableOpacity onPress={this._onNextPress.bind(this)}>
        <View style={[styles.bubbleBase, styles.centerBubble, backgroundStyle]}>
          <Text
            style={styles.nextBubbleText}>
            Next
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  renderWaitingBubble() {
    return (
      <TouchableOpacity onPress={this._onNextPress}>
        <View style={[styles.bubbleBase, styles.centerBubble, styles.waitBubble]}>
          <Text>
            Waiting
          </Text>
        </View>
      </TouchableOpacity>
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

    const hasNewMessage = this.state.messages.length !== messages.length
    if (hasNewMessage) {
      this.setState({
        messages: GiftedChat.append(this.state.messages, messages[messages.length - 1]),
      })
    }
  }

  render() {
    const { characters, curChat } = this.props
    let first_name = "Ann"
    const isActive = !_.isEmpty(curChat)
    if (isActive) {
      const char = characters.find((cha) => { return cha.key === curChat.key})
      first_name = char && char.first_name
    }

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
  centerBubble: {
    marginLeft: 50,
    marginRight: 50,
    paddingLeft: 50,
    paddingRight: 50,
    alignItems: 'center',
  },
  waitBubble: {
    backgroundColor: LIGHT_GRAY
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

  const match = getMatch(state, key)
  const curChat = activeChats[key]
  const platform = match && match.threads[curChat.thread].platform || 'tinder'

  return {
    characters,
    curChat,
    key,
    match,
    platform
  }
}

export default connect(mapStateToProps)(Chat)
