
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
import { getInputFormat } from '../../actions/chat'

const TEXT_COLOR_LIGHT = 'white'

class Chat extends React.Component {
  constructor(props) {
    super(props);
    const { characters, curChat, dispatch, matches } = props
    const key = '101_Ana'
    let threads = {}
    let match = {}

    const character = characters.find((char) => { return char.key === key })
    let platform = 'tinder'

    if (key) {
      match = matches.find((match) => { return match.key === key })
      threads = match.threads
      firstThread = threads.a
      platform = firstThread.platform
    }

    // FIX get rid of all state except messages
    this.state = {
      messages: [],
      currentLineRender: 0,
      curChat: {
        key,
        thread: 'a',
        msg_id: 0,
        atBranch: false,
        platform
      },
      match,
      threads,
      character
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

  nextStep() {
    const { curChat, threads } = this.state
    const currentThread = threads[curChat.thread]
    const { msg_id } = curChat
    const { messages } = currentThread
    let nextIsBranch = true
    if (messages.length) {
      const lastMessage = _.last(messages)
      nextIsBranch = msg_id >= lastMessage.msg_id
    }
    if (!nextIsBranch) {
      this.showNextBubble()
    } else {
      this.execBranch()
    }
  }

  getThumb(nextMessage) {
    const { characters } = this.props
    const { curChat } = this.state
    const { key } = curChat
    const { cha_id } = nextMessage
    if (nextMessage.cha_id === 2) {
      return 'https://www.playshakespeare.com/images/avatar/thumb_1b09da63a23c12d8d02185e9.jpg'
    } else if ( cha_id < 100) {
      return ''
    }
    const character = characters.find((char) => { return char.key === key })
    return character.images.thumb
  }

  setChaId(nextMessage) {
    // main character needs to be 1 to render on the right side
    if (nextMessage.cha_id > 10 && nextMessage.cha_id < 100) {
      return 1
    }
    return nextMessage.cha_id
  }

  showNextBubble(){
    const { curChat, currentLineRender, threads } = this.state
    const currentThread = threads[curChat.thread]
    const { msg_id } = curChat
    const { messages } = currentThread
    const nextMessage = messages.find((msg) => { return msg.msg_id === msg_id })

    nextMessage.user = {}
    nextMessage.user._id = this.setChaId(nextMessage)
    nextMessage.user.avatar = this.getThumb(nextMessage)
    nextMessage._id = currentLineRender

    this.setState(() => {
      return {
        messages: GiftedChat.append(this.state.messages, nextMessage),
        currentLineRender: currentLineRender + 1,
        curChat: {
          ...curChat,
          msg_id: curChat.msg_id + 1
        }
      };
    });
  }

  execBranch() {
    const { curChat, threads } = this.state
    const currentThread = threads[curChat.thread]
    const { branch } = currentThread

    switch(branch.branch_type) {
      case 'linear':
        const { branch_target } = branch
        this.switchBranch(branch_target)
        return
      case 'multi':
        this.setState({
          curChat: {
            ...curChat,
            atBranch: true
          }
        })
        return
      case 'terminal':
        console.log('terminal')
        return
    }
  }

  switchBranch(branch_target) {
    const { curChat, threads } = this.state
    const currentThread = threads[curChat.thread]
    const newThread = threads[branch_target]

    this.setState({
      curChat: {
        ...curChat,
        thread: branch_target,
        msg_id: 0,
        atBranch: false,
        platform: newThread.platform
      }
    }, () => {
      this.nextStep()
    })
  }

  _onNextPress() {
    this.nextStep()
  }

  _onOptionPress(option) {
    this.switchBranch(option.target_thread)
  }

  renderBubble(props) {
    const { curChat } = this.state
    const firstBgColor = getBackgroundColor(curChat.platform)
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

  renderInputToolbar(props) {
    const { curChat } = this.state
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
    const backgroundStyle = getBackgroundStyle(curChat.platform)

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
    const { curChat } = this.state
    const backgroundStyle = getBackgroundStyle(curChat.platform)

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
  // no longer needs currentChat again.
  const { key } = currentChat
  const activeChatMatch = (chat) => { return chat.key === key }
  const curChat = activeChats.find(activeChatMatch)

  return {
    characters,
    curChat,
    matches
  }
}
export default connect(mapStateToProps)(Chat)
